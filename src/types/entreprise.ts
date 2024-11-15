// types/entreprise.ts
export interface Address {
  numeroVoieEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
  codePostalEtablissement?: string;
  libelleCommuneEtablissement?: string;
}

export interface EntrepriseInfo {
  nom_complet: string;                // Nom complet de l'entreprise
  siret: string;                       // Numéro SIRET
  siren: string;                       // Numéro SIREN
  adresse: string;                     // Adresse complète en chaîne de caractères
  code_postal?: string;                // Code postal
  ville?: string;                      // Ville
  numeroVoieEtablissement?: string;    // Numéro de voie
  typeVoieEtablissement?: string;      // Type de voie (Rue, Avenue, etc.)
  libelleVoieEtablissement?: string;   // Libellé de la voie
  date_creation: Date | null;          // Date de création de l'entreprise
  tranche_effectif?: string;           // Tranche d'effectif de l'entreprise
  activite_principale?: string;        // Activité principale
  nature_juridique?: string;           // Nature juridique de l'entreprise
  vat_number?: string;                 // Numéro de TVA intracommunautaire
}
