<script setup lang="ts">
import { ref } from 'vue';
import type { EntrepriseInfo } from '../types';
import SearchDialog from './SearchDialog.vue';

const showSearch = ref(false);
const formData = ref({
  nom_complet: '',
  siret: '',
  siren: '',
  adresse: '',
  date_creation: '',
  tranche_effectif: '',
  activite_principale: '',
  nature_juridique: '',
  telephone: '',
  email: '',
  commentaire: ''
});

const handleEntrepriseSelect = (entreprise: EntrepriseInfo) => {
  formData.value = {
    ...formData.value,
    ...entreprise,
    telephone: formData.value.telephone,
    email: formData.value.email,
    commentaire: formData.value.commentaire
  };
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
              <InputText
                id="nom_complet"
                v-model="formData.nom_complet"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="siret">SIRET</label>
              <InputText
                id="siret"
                v-model="formData.siret"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="siren">SIREN</label>
              <InputText
                id="siren"
                v-model="formData.siren"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="adresse">Adresse</label>
              <InputText
                id="adresse"
                v-model="formData.adresse"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="telephone">Téléphone</label>
              <InputText
                id="telephone"
                v-model="formData.telephone"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="email">Email</label>
              <InputText
                id="email"
                v-model="formData.email"
                type="email"
                class="w-full"
              />
            </div>

            <div class="field col-span-2">
              <label for="commentaire">Commentaire</label>
              <Textarea
                id="commentaire"
                v-model="formData.commentaire"
                rows="4"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <Button
              type="submit"
              label="Enregistrer"
              icon="pi pi-check"
              class="p-button-success"
            />
          </div>
        </form>
      </template>
    </Card>

    <SearchDialog
      v-model="showSearch"
      @select="handleEntrepriseSelect"
    />
  </div>
</template>