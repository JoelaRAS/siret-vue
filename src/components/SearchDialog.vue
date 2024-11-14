<script setup lang="ts">
import { ref } from 'vue';
import type { EntrepriseInfo } from '../types/entreprise';
import { searchEntreprise, searchEntrepriseByName } from '../services/entrepriseService';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', company: EntrepriseInfo): void
}>();

const searchQuery = ref('');
const searchType = ref('siret');
const loading = ref(false);
const results = ref<EntrepriseInfo[]>([]);
const error = ref('');
const selectedCompany = ref<EntrepriseInfo | null>(null);

const search = async () => {
  if (!searchQuery.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  results.value = [];
  selectedCompany.value = null;
  
  try {
    const rawResults = await (searchType.value === 'siret' 
      ? searchEntreprise(searchQuery.value)
      : searchEntrepriseByName(searchQuery.value));
    
    results.value = rawResults.map(company => ({
      ...company,
      date_creation: company.date_creation ? new Date(company.date_creation) : null // Conversion de la date
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
    emit('select', selectedCompany.value);
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
  <Dialog 
    :visible="props.visible"
    modal 
    header="Rechercher une entreprise" 
    :style="{ width: '50vw' }"
    @update:visible="closeDialog"
  >
    <div class="search-container">
      <div class="search-type">
        <RadioButton 
          v-model="searchType" 
          value="siret" 
          inputId="siret" 
        />
        <label for="siret">SIRET/SIREN</label>
        
        <RadioButton 
          v-model="searchType" 
          value="name" 
          inputId="name" 
        />
        <label for="name">Nom</label>
      </div>

      <div class="search-input">
        <InputText 
          v-model="searchQuery" 
          :placeholder="searchType === 'siret' ? 'Entrez un SIRET ou SIREN' : 'Entrez le nom de l\'entreprise'"
          @keyup.enter="search"
        />
        <Button 
          icon="pi pi-search" 
          @click="search" 
          :loading="loading"
        />
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
            <p>{{ company.adresse }}</p>
            <p>Activité: {{ company.activite_principale }}</p>
          </div>
          <div class="selection-indicator">
            <i class="pi pi-check" v-if="selectedCompany?.siret === company.siret"></i>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button 
        label="Annuler" 
        icon="pi pi-times" 
        @click="closeDialog" 
        class="p-button-text"
      />
      <Button 
        label="Sélectionner" 
        icon="pi pi-check" 
        @click="confirmSelection" 
        :disabled="!selectedCompany"
        class="p-button-success" 
      />
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