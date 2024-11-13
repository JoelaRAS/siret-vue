<script setup lang="ts">
import { ref } from 'vue';
import { searchEntreprise, searchEntrepriseByName } from '../services/entrepriseApi';
import type { EntrepriseInfo } from '../types';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', entreprise: EntrepriseInfo): void;
}>();

const query = ref('');
const searchType = ref('siret');
const loading = ref(false);
const results = ref<EntrepriseInfo[]>([]);
const error = ref<string | null>(null);

const handleSearch = async () => {
  if (!query.value) return;
  
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

const selectEntreprise = (entreprise: EntrepriseInfo) => {
  emit('select', entreprise);
  emit('update:modelValue', false);
};
</script>

<template>
  <Dialog
    :visible="modelValue"
    @update:visible="value => emit('update:modelValue', value)"
    modal
    header="Rechercher une entreprise"
  >
    <div class="mb-4">
      <TabView>
        <TabPanel header="Recherche par SIRET/SIREN">
          <div class="p-4">
            <InputText
              v-model="query"
              placeholder="Entrez un SIRET ou SIREN"
              class="w-full mb-3"
              @keyup.enter="handleSearch"
            />
            <Button label="Rechercher" @click="handleSearch" class="w-full" />
          </div>
        </TabPanel>
        <TabPanel header="Recherche par nom">
          <div class="p-4">
            <InputText
              v-model="query"
              placeholder="Entrez le nom de l'entreprise"
              class="w-full mb-3"
              @keyup.enter="handleSearch"
            />
            <Button label="Rechercher" @click="handleSearch" class="w-full" />
          </div>
        </TabPanel>
      </TabView>
    </div>

    <div v-if="loading" class="flex justify-center p-4">
      <ProgressSpinner />
    </div>

    <div v-else-if="error" class="text-red-500 p-4">
      {{ error }}
    </div>

    <div v-else-if="results.length > 0" class="space-y-4">
      <div
        v-for="entreprise in results"
        :key="entreprise.siret"
        class="p-4 border rounded hover:bg-gray-50 cursor-pointer"
        @click="selectEntreprise(entreprise)"
      >
        <h3 class="font-bold">{{ entreprise.nom_complet }}</h3>
        <p>SIRET: {{ entreprise.siret }}</p>
        <p>{{ entreprise.adresse }}</p>
      </div>
    </div>

    <template #footer>
      <Button
        label="Fermer"
        @click="$emit('update:modelValue', false)"
        class="p-button-secondary"
      />
    </template>
  </Dialog>
</template>