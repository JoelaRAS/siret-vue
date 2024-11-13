<script setup lang="ts">
import { ref } from 'vue'
import type { EntrepriseInfo } from '../types'
import { Button } from 'primevue/button'
import { Card } from 'primevue/card'
import { InputText } from 'primevue/inputtext'
import { Calendar } from 'primevue/calendar'
import SearchDialog from './SearchDialog.vue'

const showSearch = ref(false)
const formData = ref<EntrepriseInfo>({
  nom_complet: '',
  siret: '',
  siren: '',
  adresse: '',
  date_creation: '',
  tranche_effectif: '',
  activite_principale: '',
  nature_juridique: '',
})

const handleEntrepriseSelect = (entreprise: EntrepriseInfo) => {
  formData.value = { ...entreprise }
  showSearch.value = false
}

const submitForm = () => {
  console.log('Formulaire soumis:', formData.value)
  // Ajoutez ici la logique de soumission du formulaire
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <Card>
      <template #title>
        <h2 class="text-2xl font-bold mb-4">Formulaire d'entreprise</h2>
      </template>
      <template #content>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div v-for="(value, key) in formData" :key="key" class="mb-4">
            <label :for="key" class="block text-sm font-medium text-gray-700 mb-1">
              {{ key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') }}
            </label>
            <InputText 
              v-if="key !== 'date_creation'" 
              :id="key" 
              v-model="formData[key as keyof EntrepriseInfo]" 
              class="w-full p-2 border rounded" 
            />
            <Calendar 
              v-else 
              :id="key" 
              v-model="formData.date_creation" 
              dateFormat="dd/mm/yy" 
              class="w-full" 
            />
          </div>
          <Button type="submit" label="Soumettre" class="w-full p-button-primary" />
        </form>
      </template>
    </Card>
    <Button 
      label="Rechercher une entreprise" 
      icon="pi pi-search" 
      class="mt-4 p-button-secondary" 
      @click="showSearch = true" 
    />
    <SearchDialog 
      v-model:visible="showSearch" 
      @select="handleEntrepriseSelect" 
    />
  </div>
</template>

<style scoped>
.p-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.p-button {
  transition: background-color 0.3s ease;
}

.p-button:hover {
  opacity: 0.9;
}

.p-inputtext:focus, .p-calendar:focus {
  box-shadow: 0 0 0 2px #4299e1;
}
</style>


