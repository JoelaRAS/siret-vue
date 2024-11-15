import axios from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = 'https://api.insee.fr/entreprises/sirene/V3.11';

// Configuration de l'instance axios avec le token de l'API INSEE
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await tokenService.getValidToken();
  config.headers.Authorization = `Bearer ${token}`;
  console.log('Token utilisé pour la requête:', token);
  return config;
});

// Fonction pour formater l'adresse en une chaîne unique
const formatAddress = (adresse: { numeroVoieEtablissement?: any; typeVoieEtablissement?: any; libelleVoieEtablissement?: any; codePostalEtablissement: any; libelleCommuneEtablissement: any; }) => {
  return `${adresse.numeroVoieEtablissement || ''} ${adresse.typeVoieEtablissement || ''} ${adresse.libelleVoieEtablissement || ''}, ${adresse.codePostalEtablissement || ''} ${adresse.libelleCommuneEtablissement || ''}`.trim();
};

// Génération du numéro de TVA intracommunautaire
const generateVATNumber = (siren: string) => {
  if (!/^\d{9}$/.test(siren)) {
    console.error("Le numéro SIREN doit être composé de 9 chiffres.");
    return 'Non disponible';
  }
  const sirenNumber = parseInt(siren, 10);
  const key = (12 + 3 * (sirenNumber % 97)) % 97;
  return `FR${String(key).padStart(2, '0')}${siren}`;
};

// Extraction des informations d'une entreprise
const extractEntrepriseInfoFromINSEE = (etablissement: any) => {
  // Vérification et extraction de la date
  const dateCreation = etablissement.uniteLegale.dateCreationUniteLegale 
    ? new Date(etablissement.uniteLegale.dateCreationUniteLegale).toLocaleDateString() 
    : 'Non disponible';

  // Assure que le SIREN est correctement extrait
  const siren = etablissement.uniteLegale.siren || 'Non disponible';

  return {
    nom_complet: etablissement.uniteLegale.denominationUniteLegale || 'Non disponible',
    siret: etablissement.siret || 'Non disponible',
    siren: siren,
    adresse: formatAddress(etablissement.adresseEtablissement) || 'Non disponible',
    code_postal: etablissement.adresseEtablissement?.codePostalEtablissement || 'Non disponible',
    ville: etablissement.adresseEtablissement?.libelleCommuneEtablissement || 'Non disponible',
    date_creation: dateCreation,
    tranche_effectif: etablissement.uniteLegale.trancheEffectifsUniteLegale || 'Non disponible',
    activite_principale: etablissement.uniteLegale.activitePrincipaleUniteLegale || 'Non disponible',
    nature_juridique: etablissement.uniteLegale.categorieJuridiqueUniteLegale || 'Non disponible',
    vat_number: generateVATNumber(siren),
  };
};

// Fonction principale pour rechercher une entreprise par SIRET ou SIREN
export const searchEntreprise = async (query: string) => {
  try {
    const param = query.length === 9 ? `siren:${query}` : `siret:${query}`;
    console.log(`Recherche pour ${param}`);
    
    const response = await axiosInstance.get('/siret', {
      params: {
        q: `${param}*`,
        nombre: 10,
      },
    });

    const entreprises = response.data.etablissements.map(extractEntrepriseInfoFromINSEE);
    console.log('Entreprises trouvées:', entreprises);
    return entreprises;
  } catch (error) {
    const err = error as any;
    console.error('Erreur lors de la recherche :', err.response?.data || err.message);
    throw new Error("Impossible de trouver l'entreprise avec ce SIRET/SIREN.");
  }
};

// Recherche de SIRENs par nom via l'API gouvernementale
export const searchEntrepriseByTextGovApi = async (query: string) => {
  try {
    const response = await axios.get('https://recherche-entreprises.api.gouv.fr/search', {
      params: {
        q: query,
        per_page: 10,
      },
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results.map((result: { siren: string }) => result.siren);
    }
    throw new Error("Aucune entreprise trouvée avec ce nom");
  } catch (error) {
    console.error("Erreur lors de la recherche via l'API gouv :", error instanceof Error ? error.message : error);
    throw new Error("Impossible de rechercher des entreprises pour le moment");
  }
};

// Recherche d'une entreprise par nom et obtention des détails via INSEE
export const searchEntrepriseByName = async (query: string) => {
  try {
    const sirenList = await searchEntrepriseByTextGovApi(query);
    console.log("SIRENs trouvés via l'API gouv :", sirenList);

    const entreprises = await Promise.all(
      sirenList.map(async (siren: string) => {
        try {
          const result = await searchEntreprise(siren);
          return result;
        } catch (error) {
          console.warn(`Erreur pour le SIREN ${siren}:`, error);
          return null;
        }
      })
    );

    const validEntreprises = entreprises.flat().filter(Boolean);
    console.log("Entreprises trouvées :", validEntreprises);
    return validEntreprises;
  } catch (error) {
    console.error("Erreur lors de la recherche par nom :", error);
    throw new Error("Impossible de trouver des entreprises avec ce nom.");
  }
};
