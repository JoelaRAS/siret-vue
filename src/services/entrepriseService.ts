import axios from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = 'https://api.insee.fr/entreprises/sirene/V3.11';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await tokenService.getValidToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Formate l'adresse en chaîne
const formatAddress = (adresse: any) => {
  return `${adresse.numeroVoieEtablissement || ''} ${adresse.typeVoieEtablissement || ''} ${adresse.libelleVoieEtablissement || ''}, ${adresse.codePostalEtablissement || ''} ${adresse.libelleCommuneEtablissement || ''}`.trim();
};

// Génère le numéro de TVA intracommunautaire
const generateVATNumber = (siren: string) => {
  if (!/^\d{9}$/.test(siren)) {
    console.error("Le numéro SIREN doit être composé de 9 chiffres.");
    return null;
  }
  const sirenNumber = parseInt(siren, 10);
  const key = (12 + 3 * (sirenNumber % 97)) % 97;
  return `FR${String(key).padStart(2, '0')}${siren}`;
};

// Extrait les informations d'une entreprise
const extractEntrepriseInfoFromINSEE = (etablissement: any) => {
  return {
    nom_complet: etablissement.uniteLegale.denominationUniteLegale || 'Non disponible',
    siret: etablissement.siret || 'Non disponible',
    siren: etablissement.uniteLegale.siren || 'Non disponible',
    adresse: formatAddress(etablissement.adresseEtablissement) || 'Non disponible',
    code_postal: etablissement.adresseEtablissement?.codePostalEtablissement || 'Non disponible',
    ville: etablissement.adresseEtablissement?.libelleCommuneEtablissement || 'Non disponible',
    date_creation: etablissement.uniteLegale.dateCreationUniteLegale || 'Non disponible',
    tranche_effectif: etablissement.uniteLegale.trancheEffectifsUniteLegale || 'Non disponible',
    activite_principale: etablissement.uniteLegale.activitePrincipaleUniteLegale || 'Non disponible',
    nature_juridique: etablissement.uniteLegale.categorieJuridiqueUniteLegale || 'Non disponible',
    vat_number: generateVATNumber(etablissement.uniteLegale.siren) || 'Non disponible',
  };
};


// Recherche d'entreprise par SIRET ou SIREN
export const searchEntreprise = async (query: string) => {
  try {
    const param = query.length === 9 ? `siren:${query}` : `siret:${query}`;
    const response = await axiosInstance.get('/siret', {
      params: {
        q: `${param}*`,
        nombre: 10,
      },
    });
    return response.data.etablissements.map(extractEntrepriseInfoFromINSEE);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur lors de la recherche :', error.response?.data || error.message);
    } else {
      console.error('Erreur lors de la recherche :', error);
    }
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
      return response.data.results.map((result: any) => result.siren);
    }
    throw new Error("Aucune entreprise trouvée avec ce nom");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors de la recherche via l'API gouv :", error.message);
    } else {
      console.error("Erreur lors de la recherche via l'API gouv :", error);
    }
    throw new Error("Impossible de rechercher des entreprises pour le moment");
  }
};

// Recherche d'une entreprise par nom et obtention des détails via INSEE
export const searchEntrepriseByName = async (query: string) => {
  try {
    const sirenList = await searchEntrepriseByTextGovApi(query);
    const entreprises = await Promise.all(
      sirenList.map(async (siren: string) => {
        try {
          return await searchEntreprise(siren);
        } catch (error) {
          console.warn(`Erreur pour le SIREN ${siren}:`, error);
          return null;
        }
      })
    );

    return entreprises.flat().filter(Boolean);
  } catch (error) {
    console.error("Erreur lors de la recherche par nom :", error);
    throw new Error("Impossible de trouver des entreprises avec ce nom.");
  }
};
