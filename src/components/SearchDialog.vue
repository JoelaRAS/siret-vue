<script setup lang="ts">
import { ref, watch } from 'vue';
import { defineEmits, defineProps } from 'vue';
import type { EntrepriseInfo } from '../types/entreprise';
import { searchEntreprise, searchEntrepriseByName } from '../services/entrepriseService';

const props = defineProps<{
  visible: boolean;
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

// Watcher pour fermer le popup lorsque props.visible change
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    searchQuery.value = '';
    results.value = [];
    selectedCompany.value = null;
    error.value = '';
  }
});
</script>

<template>
  <Dialog :visible="props.visible" @hide="emit('update:visible', false)">
    <template #header>
      <h3>Recherche d'entreprise</h3>
    </template>
    <div>
      <div class="form-group">
        <label for="searchQuery">Recherche</label>
        <InputText 
          id="searchQuery"
          v-model="searchQuery" 
          placeholder="Entrez le SIRET ou le nom de l'entreprise"
        />
      </div>
      <div class="form-group">
        <label for="searchType">Type de recherche</label>
        <Dropdown 
          id="searchType"
          v-model="searchType" 
          :options="[{ label: 'SIRET', value: 'siret' }, { label: 'Nom', value: 'name' }]"
        />
      </div>
      <Button @click="search" :loading="loading">Rechercher</Button>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="results.length">
        <ul>
          <li v-for="company in results" :key="company.siret" @click="emit('select', company)">
            {{ company.nom_complet }} - {{ company.siret }}
          </li>
        </ul>
      </div>
    </div>
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