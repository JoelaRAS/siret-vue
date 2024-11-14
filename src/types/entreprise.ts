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
  date_creation: Date | null; // Modifié pour être de type Date ou null
  tranche_effectif: string;
  activite_principale: string;
  nature_juridique: string;
}