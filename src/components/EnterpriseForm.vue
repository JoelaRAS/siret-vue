<script setup lang="ts">
import { ref, computed } from 'vue';
import type { EntrepriseInfo } from '../types';
import SearchDialog from './SearchDialog.vue';

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
            <Calendar id="date_creation" v-model="formattedDateCreation" dateFormat="dd/mm/yy" class="w-full" />
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