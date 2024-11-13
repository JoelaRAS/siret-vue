<script setup lang="ts">
import { ref } from 'vue';
import type { EntrepriseInfo } from '../types';
import SearchDialog from './SearchDialog.vue';

const showSearch = ref(false);
const formData = ref<EntrepriseInfo>({
  nom_complet: '',
  siret: '',
  siren: '',
  adresse: '',
  date_creation: null, // Utilisez null pour les dates initialement
  tranche_effectif: '',
  activite_principale: '',
  nature_juridique: '',
});

const handleEntrepriseSelect = (entreprise: EntrepriseInfo) => {
  formData.value = { 
    ...entreprise,
    date_creation: entreprise.date_creation ? new Date(entreprise.date_creation) : null // Convertir en Date
  };
  showSearch.value = false;
};

const submitForm = () => {
  console.log('Formulaire soumis:', formData.value);
  // Ajoutez ici la logique de soumission du formulaire
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <Card>
      <template #title>
        Formulaire d'entreprise
      </template>
      <template #content>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="nom_complet" class="block text-sm font-medium text-gray-700">Nom complet</label>
            <input type="text" v-model="formData.nom_complet" id="nom_complet" class="input w-full" />
          </div>
          <div class="mb-4">
            <label for="siret" class="block text-sm font-medium text-gray-700">SIRET</label>
            <input type="text" v-model="formData.siret" id="siret" class="input w-full" />
          </div>
          <div class="mb-4">
            <label for="siren" class="block text-sm font-medium text-gray-700">SIREN</label>
            <input type="text" v-model="formData.siren" id="siren" class="input w-full" />
          </div>
          <div class="mb-4">
            <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" v-model="formData.adresse" id="adresse" class="input w-full" />
          </div>
          <div class="mb-4">
            <label for="date_creation" class="block text-sm font-medium text-gray-700">Date de création</label>
            <input type="date" v-model="formData.date_creation" id="date_creation" class="input w-full" />
          </div>
          <div class="mb-4">
            <label for="tranche_effectif" class="block text-sm font-medium text-gray-700">Tranche d'effectif</label>
            <input type="text" v-model="formData.tranche_effectif" id="tranche_effectif" class="input w-full" />
          </div>
          <div class="mb-4">
            <label for="activite_principale" class="block text-sm font-medium text-gray-700">Activité principale</label>
            <input type="text" v-model="formData.activite_principale" id="activite_principale" class="input w-full" />
          </div>
          <div class="mb-4">
            <label for="nature_juridique" class="block text-sm font-medium text-gray-700">Nature juridique</label>
            <input type="text" v-model="formData.nature_juridique" id="nature_juridique" class="input w-full" />
          </div>
          <Button type="submit" label="Soumettre" class="w-full" />
        </form>
      </template>
    </Card>
    <Button label="Rechercher une entreprise" icon="pi pi-search" class="mt-4" @click="showSearch = true" />
    <SearchDialog :visible="showSearch" @update:visible="showSearch = $event" @select="handleEntrepriseSelect" />
  </div>
</template>

<style scoped>
.input {
  /* Ajoutez vos styles ici */
}
</style>