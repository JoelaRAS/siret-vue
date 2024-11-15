// entrepriseService.ts
import axios from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = 'https://api.insee.fr/entreprises/sirene/V3.11';

// Configuration d'axios
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

export interface Address {
  numeroVoieEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
  codePostalEtablissement?: string;
  libelleCommuneEtablissement?: string;
}

export interface EntrepriseInfo {
  nom_complet: string;
  siret: string;
  siren: string;
  adresse: string; 
  code_postal: string;
  ville: string;
  numeroVoieEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
  date_creation: Date | null;
  tranche_effectif: string;
  activite_principale: string;
  nature_juridique: string;
  vat_number: string;
}

// Formate l'adresse pour l'afficher sous forme de chaîne
const formatAddress = (adresse: Address): string => {
  return `${adresse.numeroVoieEtablissement || ''} ${adresse.typeVoieEtablissement || ''} ${adresse.libelleVoieEtablissement || ''}, ${adresse.codePostalEtablissement || ''} ${adresse.libelleCommuneEtablissement || ''}`.trim();
};

// Génère le numéro de TVA intracommunautaire
const generateVATNumber = (siren: string): string | null => {
  if (!/^\d{9}$/.test(siren)) {
    console.error("Le numéro SIREN doit être composé de 9 chiffres.");
    return null;
  }
  const sirenNumber = parseInt(siren, 10);
  const key = (12 + 3 * (sirenNumber % 97)) % 97;
  return `FR${String(key).padStart(2, '0')}${siren}`;
};

// Extraction des informations d'une entreprise
const extractEntrepriseInfoFromINSEE = (etablissement: any): EntrepriseInfo => {
  return {
    nom_complet: etablissement.uniteLegale.denominationUniteLegale || 'Non disponible',
    siret: etablissement.siret || 'Non disponible',
    siren: etablissement.siren || 'Non disponible',
    adresse: formatAddress(etablissement.adresseEtablissement), 
    code_postal: etablissement.adresseEtablissement?.codePostalEtablissement || 'Non disponible',
    ville: etablissement.adresseEtablissement?.libelleCommuneEtablissement || 'Non disponible',
    numeroVoieEtablissement: etablissement.adresseEtablissement?.numeroVoieEtablissement || '',
    typeVoieEtablissement: etablissement.adresseEtablissement?.typeVoieEtablissement || '',
    libelleVoieEtablissement: etablissement.adresseEtablissement?.libelleVoieEtablissement || '',
    date_creation: etablissement.dateCreationUniteLegale ? new Date(etablissement.dateCreationUniteLegale) : null,
    tranche_effectif: etablissement.trancheEffectifsUniteLegale || 'Non disponible',
    activite_principale: etablissement.activitePrincipaleUniteLegale || 'Non disponible',
    nature_juridique: etablissement.categorieJuridiqueUniteLegale || 'Non disponible',
    vat_number: generateVATNumber(etablissement.siren) || 'Non disponible',
  };
};

// Requête par SIRET ou SIREN
export const searchEntreprise = async (query: string): Promise<EntrepriseInfo[]> => {
  try {
    const response = await axiosInstance.get(`/siret/${query}`);
    return [extractEntrepriseInfoFromINSEE(response.data)];
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    throw new Error("Impossible de trouver l'entreprise avec ce SIRET/SIREN.");
  }
};

// Requête par nom
export const searchEntrepriseByName = async (query: string): Promise<string[]> => {
  try {
    const response = await axios.get('https://recherche-entreprises.api.gouv.fr/search', {
      params: { q: query, per_page: 10 },
    });
    if (response.data.results) {
      return response.data.results.map((result: any) => result.siren);
    }
    throw new Error("Aucune entreprise trouvée avec ce nom");
  } catch (error) {
    console.error('Erreur lors de la recherche via l\'API gouv :', error);
    throw new Error("Impossible de rechercher des entreprises pour le moment");
  }
};
