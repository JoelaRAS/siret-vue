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

interface Address {
  numeroVoieEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
  codePostalEtablissement?: string;
  libelleCommuneEtablissement?: string;
}

interface EntrepriseInfo {
  nom_complet: string;
  siret: string;
  siren: string;
  adresse: string;
  date_creation: string;
  tranche_effectif: string;
  activite_principale: string;
  nature_juridique: string;
}

const formatAddress = (adresse: Address): string => {
  return `${adresse.numeroVoieEtablissement || ''} ${adresse.typeVoieEtablissement || ''} ${adresse.libelleVoieEtablissement || ''}, ${adresse.codePostalEtablissement || ''} ${adresse.libelleCommuneEtablissement || ''}`.trim();
};

const extractEntrepriseInfoFromINSEE = (etablissement: any): EntrepriseInfo => {
  return {
    nom_complet: etablissement.uniteLegale.denominationUniteLegale,
    siret: etablissement.siret,
    siren: etablissement.siren,
    adresse: formatAddress(etablissement.adresseEtablissement),
    date_creation: etablissement.dateCreationEtablissement,
    tranche_effectif: etablissement.trancheEffectifsEtablissement?.trancheEffectifsEtablissement || 'Non disponible',
    activite_principale: etablissement.activitePrincipaleEtablissement?.libelleActivitePrincipaleEtablissement || 'Non disponible',
    nature_juridique: etablissement.uniteLegale.categorieJuridiqueUniteLegale,
  };
};

export const searchEntreprise = async (query: string): Promise<EntrepriseInfo[]> => {
  try {
    const response = await axiosInstance.get('/siret', {
      params: {
        q: `siret:${query}* OR siren:${query}*`,
        nombre: 10,
      },
    });

    return response.data.etablissements.map(extractEntrepriseInfoFromINSEE);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur lors de la recherche :', error.response?.data || error.message);
    } else {
      console.error('Erreur lors de la recherche :', (error as Error).message);
    }
    throw new Error("Impossible de trouver l'entreprise avec ce SIRET/SIREN.");
  }
};

export const searchEntrepriseByTextGovApi = async (query: string): Promise<string[]> => {
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
    console.error('Erreur lors de la recherche via l\'API gouv :', (error as any).message);
    throw new Error("Impossible de rechercher des entreprises pour le moment");
  }
};

export const searchEntrepriseByName = async (query: string): Promise<EntrepriseInfo[]> => {
  try {
    const sirenList = await searchEntrepriseByTextGovApi(query);

    const entreprises = await Promise.all(
      sirenList.map(async (siren) => {
        try {
          return await searchEntreprise(siren);
        } catch (error) {
          console.warn(`Erreur pour le SIREN ${siren}:`, error);
          return null;
        }
      })
    );

    return entreprises.flat().filter(Boolean) as EntrepriseInfo[];
  } catch (error) {
    console.error('Erreur lors de la recherche par nom :', error);
    throw new Error("Impossible de trouver des entreprises avec ce nom.");
  }
};