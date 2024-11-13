<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchEntreprise, searchEntrepriseByName } from '../services/entrepriseApi';
import type { EntrepriseInfo } from '../types';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext';

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

watch(query, (newValue) => {
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
  query.value = '';
  results.value = [];
  error.value = null;
  emit('update:visible', false);
};
</script>

<template>
  <Dialog 
    :visible="props.visible" 
    @update:visible="closeDialog" 
    modal 
    header="Recherche d'entreprise"
    :style="{ width: '90vw', maxWidth: '800px' }"
    class="p-dialog-modern"
  >
    <div class="p-6 space-y-6">
      <div class="search-header space-y-4">
        <div class="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <Button 
            :class="[
              'flex-1 transition-all duration-200',
              searchType === 'siret' ? 'p-button-primary' : 'p-button-text'
            ]"
            @click="searchType = 'siret'"
          >
            Par SIRET/SIREN
          </Button>
          <Button
            :class="[
              'flex-1 transition-all duration-200',
              searchType === 'name' ? 'p-button-primary' : 'p-button-text'
            ]"
            @click="searchType = 'name'"
          >
            Par Nom
          </Button>
        </div>
        
        <div class="search-input-container">
          <InputText
            v-model="query"
            :placeholder="searchType === 'siret' ? 'Entrez le numéro SIRET ou SIREN' : 'Entrez le nom de l'entreprise'"
            class="w-full p-3"
          />
        </div>
      </div>

      <Transition name="fade">
        <div v-if="loading" class="flex justify-center py-8">
          <ProgressSpinner style="width: 50px; height: 50px;" />
        </div>
      </Transition>

      <Transition name="slide-up">
        <div v-if="results.length && !loading" class="space-y-4">
          <TransitionGroup name="search-results" tag="div" class="space-y-4">
            <Card v-for="entreprise in results" :key="entreprise.siret" class="result-card">
              <template #title>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">
                    {{ entreprise.nom_complet || 'Nom non disponible' }}
                  </h3>
                  <Button 
                    label="Sélectionner" 
                    icon="pi pi-check" 
                    @click="selectEntreprise(entreprise)"
                    class="p-button-sm p-button-outlined"
                  />
                </div>
              </template>
              <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <p class="flex items-center gap-2">
                      <span class="font-medium">SIRET:</span>
                      <span>{{ entreprise.siret || 'Non disponible' }}</span>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-medium">SIREN:</span>
                      <span>{{ entreprise.siren || 'Non disponible' }}</span>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-medium">Date de création:</span>
                      <span>{{ entreprise.date_creation || 'Non disponible' }}</span>
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="flex items-center gap-2">
                      <span class="font-medium">Effectif:</span>
                      <span>{{ entreprise.tranche_effectif || 'Non disponible' }}</span>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-medium">Nature juridique:</span>
                      <span>{{ entreprise.nature_juridique || 'Non disponible' }}</span>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-medium">Adresse:</span>
                      <span>{{ entreprise.adresse || 'Non disponible' }}</span>
                    </p>
                  </div>
                </div>
              </template>
            </Card>
          </TransitionGroup>
        </div>
      </Transition>

      <Transition name="fade">
        <div 
          v-if="error" 
          class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center"
        >
          {{ error }}
        </div>
      </Transition>

      <Transition name="fade">
        <div 
          v-if="query.length > 0 && !loading && results.length === 0 && !error" 
          class="text-center text-gray-500 py-8"
        >
          Aucun résultat trouvé
        </div>
      </Transition>
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