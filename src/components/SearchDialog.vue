<script setup lang="ts">
import { ref } from 'vue';
import type { EntrepriseInfo } from '../types/entreprise';
import { searchEntreprise, searchEntrepriseByName } from '../services/entrepriseService';

const props = defineProps<{ visible: boolean }>();

const emit = defineEmits<{ 
  (e: 'update:visible', value: boolean): void;
  (e: 'selectCompany', company: EntrepriseInfo): void; 
}>();

const searchQuery = ref('');
const searchType = ref('siret');
const loading = ref(false);
const results = ref<EntrepriseInfo[]>([]);
const error = ref('');
const selectedCompany = ref<EntrepriseInfo | null>(null);

const search = async () => {
  loading.value = true;
  error.value = '';
  results.value = [];
  selectedCompany.value = null;

  try {
    const rawResults = await (searchType.value === 'siret'
      ? searchEntreprise(searchQuery.value)
      : searchEntrepriseByName(searchQuery.value));

      results.value = rawResults.map((company: { date_creation: string }) => ({
  ...company,
  date_creation: company.date_creation && company.date_creation !== 'Non disponible'
    ? new Date(company.date_creation).toLocaleDateString('fr-FR')  // Format français (ou ajuster selon besoin)
    : 'Non disponible'
}));


  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
};

const selectCompany = (company: EntrepriseInfo) => {
  selectedCompany.value = company;
};

const confirmSelection = () => {
  if (selectedCompany.value) {
    emit('selectCompany', selectedCompany.value);
    emit('update:visible', false);
    selectedCompany.value = null;
  }
};

const closeDialog = () => {
  emit('update:visible', false);
  selectedCompany.value = null;
  results.value = [];
  searchQuery.value = '';
  error.value = '';
};
</script>

<template>
  <Dialog :visible="props.visible" modal header="Rechercher une entreprise" :style="{ width: '50vw' }" @update:visible="closeDialog">
    <div class="search-container">
      <div class="search-type">
        <RadioButton v-model="searchType" value="siret" inputId="siret" />
        <label for="siret">SIRET</label>
        
        <RadioButton v-model="searchType" value="siren" inputId="siren" />
        <label for="siren">Nom d'entreprise</label>
      </div>

      <div class="search-input">
        <InputText v-model="searchQuery" :placeholder="searchType === 'siret' ? 'Entrez un SIRET ou SIREN' : 'Entrez le nom de l\'entreprise'" @keyup.enter="search" />
        <Button icon="pi pi-search" @click="search" :loading="loading" />
      </div>

      <small class="error-message" v-if="error">{{ error }}</small>

      <div class="results" v-if="results.length">
        <div v-for="company in results" :key="company.siret" class="result-item" :class="{ 'selected': selectedCompany?.siret === company.siret }" @click="selectCompany(company)">
          <div class="result-content">
            <h3>{{ company.nom_complet }}</h3>
            <p>SIRET: {{ company.siret }}</p>
            <p>SIREN: {{ company.siren }}</p>
            <p>Adresse: {{ company.adresse }}</p>
            <p>date de creation : {{ company.date_creation }}</p>
            <p>Code Postal: {{ company.code_postal }}</p>
            <p>Ville: {{ company.ville }}</p>
            <p>Activité Principale: {{ company.activite_principale }}</p>
            <p>Tranche Effectif: {{ company.tranche_effectif }}</p>
            <p>Nature Juridique: {{ company.nature_juridique }}</p>
            <p>Numéro TVA: {{ company.vat_number }}</p>
          </div>
          <div class="selection-indicator">
            <i class="pi pi-check" v-if="selectedCompany?.siret === company.siret"></i>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Annuler" icon="pi pi-times" @click="closeDialog" class="p-button-text" />
      <Button label="Sélectionner" icon="pi pi-check" @click="confirmSelection" :disabled="!selectedCompany" class="p-button-success" />
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.search-container {
  padding: 1rem;

  .search-type {
    margin-bottom: 1rem;
    label {
      margin-right: 1rem;
      margin-left: 0.5rem;
    }
  }

  .search-input {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    .p-inputtext { flex: 1; }
  }

  .error-message {
    color: red;
    display: block;
    margin-bottom: 1rem;
  }

  .results {
    max-height: 400px;
    overflow-y: auto;
    .result-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover { background-color: #f5f5f5; border-color: #ccc; }
      &.selected { background-color: #e3f2fd; border-color: #2196f3; }
      .result-content { flex: 1; }
      .selection-indicator { width: 24px; color: #2196f3; }
    }
  }
}
</style>
