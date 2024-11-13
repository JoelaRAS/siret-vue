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
  date_creation: '',
  tranche_effectif: '',
  activite_principale: '',
  nature_juridique: '',
});

const handleEntrepriseSelect = (entreprise: EntrepriseInfo) => {
  formData.value = { ...entreprise };
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
        Formulaire Entreprise
      </template>
      <template #content>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Informations de l'entreprise</h2>
            <Button 
              type="button"
              icon="pi pi-search"
              label="Rechercher une entreprise"
              @click="showSearch = true"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="field">
              <label for="nom_complet">Nom de l'entreprise</label>
              <InputText id="nom_complet" v-model="formData.nom_complet" class="w-full" />
            </div>

            <div class="field">
              <label for="siret">SIRET</label>
              <InputText id="siret" v-model="formData.siret" class="w-full" />
            </div>

            <div class="field">
              <label for="siren">SIREN</label>
              <InputText id="siren" v-model="formData.siren" class="w-full" />
            </div>

            <div class="field">
              <label for="adresse">Adresse</label>
              <InputText id="adresse" v-model="formData.adresse" class="w-full" />
            </div>

            <div class="field">
              <label for="date_creation">Date de création</label>
              <Calendar id="date_creation" v-model="formData.date_creation" dateFormat="dd/mm/yy" class="w-full" />
            </div>

            <div class="field">
              <label for="tranche_effectif">Tranche d'effectif</label>
              <InputText id="tranche_effectif" v-model="formData.tranche_effectif" class="w-full" />
            </div>

            <div class="field">
              <label for="activite_principale">Activité principale</label>
              <InputText id="activite_principale" v-model="formData.activite_principale" class="w-full" />
            </div>

            <div class="field">
              <label for="nature_juridique">Nature juridique</label>
              <InputText id="nature_juridique" v-model="formData.nature_juridique" class="w-full" />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <Button type="submit" label="Enregistrer" icon="pi pi-check" class="p-button-success" />
          </div>
        </form>
      </template>
    </Card>

    <SearchDialog
      v-model:visible="showSearch"
      @select="handleEntrepriseSelect"
    />
  </div>
</template>