<script setup lang="ts">
import { ref, computed } from 'vue';
import type { EntrepriseInfo } from '../types';
import SearchDialog from './SearchDialog.vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';

const showSearch = ref(false);
const formData = ref<EntrepriseInfo>({
  nom_complet: '',
  siret: '',
  siren: '',
  adresse: '',
  date_creation: '', // Utilisez string pour les dates initialement
  tranche_effectif: '',
  activite_principale: '',
  nature_juridique: '',
});

const handleEntrepriseSelect = (entreprise: EntrepriseInfo) => {
  formData.value = { 
    ...entreprise,
    date_creation: entreprise.date_creation ? new Date(entreprise.date_creation).toISOString().split('T')[0] : '' // Convertir en string
  };
  showSearch.value = false;
};

const submitForm = () => {
  console.log('Formulaire soumis:', formData.value);
  // Ajoutez ici la logique de soumission du formulaire
};

// Propriété calculée pour gérer la conversion de la date
const formattedDateCreation = computed({
  get() {
    return formData.value.date_creation ? new Date(formData.value.date_creation) : null;
  },
  set(value: Date | null) {
    formData.value.date_creation = value ? value.toISOString().split('T')[0] : '';
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <Card>
      <template #title>
        <h2 class="text-2xl font-bold mb-4">Formulaire d'entreprise</h2>
      </template>
      <template #content>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="mb-4">
            <label for="nom_complet" class="block text-sm font-medium text-gray-700">Nom complet</label>
            <InputText v-model="formData.nom_complet" id="nom_complet" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="siret" class="block text-sm font-medium text-gray-700">SIRET</label>
            <InputText v-model="formData.siret" id="siret" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="siren" class="block text-sm font-medium text-gray-700">SIREN</label>
            <InputText v-model="formData.siren" id="siren" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse</label>
            <InputText v-model="formData.adresse" id="adresse" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="date_creation" class="block text-sm font-medium text-gray-700">Date de création</label>
            <Calendar v-model="formattedDateCreation" id="date_creation" dateFormat="dd/mm/yy" class="w-full" />
          </div>
          <div class="mb-4">
            <label for="tranche_effectif" class="block text-sm font-medium text-gray-700">Tranche d'effectif</label>
            <InputText v-model="formData.tranche_effectif" id="tranche_effectif" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="activite_principale" class="block text-sm font-medium text-gray-700">Activité principale</label>
            <InputText v-model="formData.activite_principale" id="activite_principale" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label for="nature_juridique" class="block text-sm font-medium text-gray-700">Nature juridique</label>
            <InputText v-model="formData.nature_juridique" id="nature_juridique" class="w-full p-2 border rounded" />
          </div>
          <Button type="submit" label="Soumettre" class="w-full p-button-primary" />
        </form>
      </template>
    </Card>
    <Button label="Rechercher une entreprise" icon="pi pi-search" class="mt-4 p-button-secondary" @click="showSearch = true" />
    <SearchDialog v-model:visible="showSearch" @select="handleEntrepriseSelect" />
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