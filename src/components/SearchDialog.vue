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
const searchMode = ref('id'); // "id" pour SIRET/SIREN et "name" pour le nom de l'entreprise
const loading = ref(false);
const results = ref<EntrepriseInfo[]>([]);
const error = ref('');
const selectedCompany = ref<EntrepriseInfo | null>(null);

// Fonction de recherche d'entreprise
const search = async () => {
  loading.value = true;
  error.value = '';
  results.value = [];
  selectedCompany.value = null;

  try {
    // Appel de la bonne fonction selon le mode de recherche sélectionné
    const rawResults = searchMode.value === 'id'
      ? await searchEntreprise(searchQuery.value) // Recherche par SIRET ou SIREN
      : await searchEntrepriseByName(searchQuery.value); // Recherche par nom

    // Formate les résultats de la recherche pour affichage
    results.value = rawResults.map((company: { date_creation: string | number | Date; }) => ({
      ...company,
      date_creation: company.date_creation ? new Date(company.date_creation).toLocaleDateString() : 'Non disponible'
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
        <RadioButton v-model="searchMode" value="id" inputId="id" />
        <label for="id">SIRET/SIREN</label>
        
        <RadioButton v-model="searchMode" value="name" inputId="name" />
        <label for="name">Nom de l'entreprise</label>
      </div>

      <div class="search-input">
        <InputText 
          v-model="searchQuery" 
          :placeholder="searchMode === 'id' ? 'Entrez un SIRET ou SIREN' : 'Entrez le nom de l\'entreprise'" 
          @keyup.enter="search" 
        />
        <Button icon="pi pi-search" @click="search" :loading="loading" />
      </div>

      <small class="error-message" v-if="error">{{ error }}</small>

      <div class="results" v-if="results.length">
        <div 
          v-for="company in results" 
          :key="company.siret" 
          class="result-item" 
          :class="{ 'selected': selectedCompany?.siret === company.siret }" 
          @click="selectCompany(company)"
        >
          <div class="result-content">
            <h3>{{ company.nom_complet }}</h3>
            <p>SIRET: {{ company.siret }}</p>
            <p>SIREN: {{ company.siren }}</p>
            <p>Adresse: {{ company.adresse }}</p>
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

    .p-inputtext {
      flex: 1;
    }
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

      &:hover {
        background-color: #f5f5f5;
        border-color: #ccc;
      }

      &.selected {
        background-color: #e3f2fd;
        border-color: #2196f3;
      }

      .result-content {
        flex: 1;

        h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        p {
          margin: 0.25rem 0;
          color: #666;
          font-size: 0.9rem;
        }
      }

      .selection-indicator {
        width: 24px;
        color: #2196f3;
      }
    }
  }
}

:deep(.p-dialog-footer) {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
