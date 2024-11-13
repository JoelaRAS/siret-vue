<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchEntreprise, searchEntrepriseByName } from '../services/entrepriseApi';
import type { EntrepriseInfo } from '../types';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', entreprise: EntrepriseInfo): void
}>();

const query = ref('');
const searchType = ref('siret');
const loading = ref(false);
const results = ref<EntrepriseInfo[]>([]);
const error = ref<string | null>(null);
const debounceTimeout = ref<number | null>(null);

const handleSearch = async () => {
  if (query.value.length < 3) {
    results.value = [];
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    results.value = await (searchType.value === 'siret' 
      ? searchEntreprise(query.value)
      : searchEntrepriseByName(query.value));
  } catch (e: any) {
    error.value = e.message;
    results.value = [];
  } finally {
    loading.value = false;
  }
};

watch(query, () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
  
  debounceTimeout.value = setTimeout(() => {
    handleSearch();
  }, 300) as unknown as number;
});

const selectEntreprise = (entreprise: EntrepriseInfo) => {
  emit('select', entreprise);
};

const closeDialog = () => {
  emit('update:visible', false);
};
</script>

<template>
  <Dialog :visible="props.visible" @update:visible="closeDialog" modal header="Recherche d'entreprise" :style="{ width: '50vw' }">
    <div class="card-content p-6">
      <div class="tabs">
        <div class="tabs-list grid w-full grid-cols-2 mb-6">
          <Button 
            :class="{ 'p-button-secondary': searchType !== 'siret' }"
            @click="searchType = 'siret'"
          >
            Par SIRET/SIREN
          </Button>
          <Button
            :class="{ 'p-button-secondary': searchType !== 'name' }"
            @click="searchType = 'name'"
          >
            Par Nom
          </Button>
        </div>
        <div class="tabs-content" v-if="searchType === 'siret'">
          <form @submit.prevent="handleSearch" class="space-y-4">
            <input
              type="text"
              v-model="query"
              placeholder="Entrez le numéro SIRET ou SIREN (complet ou partiel)"
              class="input w-full"
            />
            <Button type="submit" label="Rechercher" icon="pi pi-search" class="w-full" />
          </form>
        </div>
        <div class="tabs-content" v-if="searchType === 'name'">
          <form @submit.prevent="handleSearch" class="space-y-4">
            <input
              type="text"
              v-model="query"
              placeholder="Entrez le nom de l'entreprise (complet ou partiel)"
              class="input w-full"
            />
            <Button type="submit" label="Rechercher" icon="pi pi-search" class="w-full" />
          </form>
        </div>
      </div>

      <ProgressSpinner v-if="loading" style="width: 50px; height: 50px;" class="mt-4" />
      
      <div v-if="results.length" class="mt-6 space-y-6">
        <Card v-for="entreprise in results" :key="entreprise.siret" class="mb-4">
          <template #title>
            {{ entreprise.nom_complet || 'Nom non disponible' }}
          </template>
          <template #content>
            <p><strong>SIRET :</strong> {{ entreprise.siret || 'Non disponible' }}</p>
            <p><strong>SIREN :</strong> {{ entreprise.siren || 'Non disponible' }}</p>
            <p><strong>Adresse :</strong> {{ entreprise.adresse || 'Non disponible' }}</p>
            <p><strong>Date de création :</strong> {{ entreprise.date_creation || 'Non disponible' }}</p>
            <p><strong>Tranche d'effectif :</strong> {{ entreprise.tranche_effectif || 'Non disponible' }}</p>
            <p><strong>Activité principale :</strong> {{ entreprise.activite_principale || 'Non disponible' }}</p>
            <p><strong>Nature juridique :</strong> {{ entreprise.nature_juridique || 'Non disponible' }}</p>
          </template>
          <template #footer>
            <Button label="Choisir" icon="pi pi-check" @click="selectEntreprise(entreprise)" />
          </template>
        </Card>
      </div>
      <div v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</div>
    </div>
  </Dialog>
</template>

<style scoped>
.result-card {
  background-color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--tw-shadow-md);
}

.p-dialog-modern {
  backdrop-filter: blur(0.375rem);
  background-color: rgba(255, 255, 255, 0.9);
}

.search-input-container {
  position: relative;
}

.search-input-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.125rem;
  background-color: var(--tw-bg-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.search-input-container:focus-within::after {
  transform: scaleX(1);
}
</style>