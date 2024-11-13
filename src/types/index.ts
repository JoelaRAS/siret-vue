export interface EntrepriseInfo {
  nom_complet: string;
  siret: string;
  siren: string;
  adresse: string;
  date_creation: string | null; // Utilisez string | null pour les dates
  tranche_effectif: string;
  activite_principale: string;
  nature_juridique: string;
}