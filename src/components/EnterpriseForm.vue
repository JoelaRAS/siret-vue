<script setup lang="ts">
import { ref, computed } from 'vue';
import type { EntrepriseInfo } from '../types';
import SearchDialog from './SearchDialog.vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
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
  toast.add({
    severity: 'success',
    summary: 'Entreprise sélectionnée',
    detail: 'Les informations ont été remplies automatiquement',
    life: 3000,
  });
};

const submitForm = () => {
  console.log('Formulaire soumis:', formData.value);
  toast.add({
    severity: 'success',
    summary: 'Formulaire soumis',
    detail: 'Les informations ont été enregistrées avec succès',
    life: 3000,
  });
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
    <Toast position="top-right" />
    
    <Card class="enterprise-form-card">
      <template #title>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Formulaire d'entreprise</h2>
          <Button 
            label="Rechercher une entreprise" 
            icon="pi pi-search" 
            class="p-button-outlined" 
            @click="showSearch = true"
          />
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label for="nom_complet" class="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <InputText 
                v-model="formData.nom_complet" 
                id="nom_complet" 
                class="w-full"
              />
            </div>
            
            <div class="form-group">
              <label for="siret" class="block text-sm font-medium text-gray-700 mb-1">
                SIRET
              </label>
              <InputText 
                v-model="formData.siret" 
                id="siret" 
                class="w-full"
              />
            </div>
            
            <div class="form-group">
              <label for="siren" class="block text-sm font-medium text-gray-700 mb-1">
                SIREN
              </label>
              <InputText 
                v-model="formData.siren" 
                id="siren" 
                class="w-full"
              />
            </div>
            
            <div class="form-group">
              <label for="adresse" class="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <InputText 
                v-model="formData.adresse" 
                id="adresse" 
                class="w-full"
              />
            </div>
            
            <div class="form-group">
              <label for="date_creation" class="block text-sm font-medium text-gray-700 mb-1">
                Date de création
              </label>
              <Calendar 
                v-model="formattedDateCreation" 
                id="date_creation" 
                dateFormat="dd/mm/yy" 
                class="w-full"
              />
            </div>
            
            <div class="form-group">
              <label for="tranche_effectif" class="block text-sm font-medium text-gray-700 mb-1">
                Tranche d'effectif
              </label>
              <InputText 
                v-model="formData.tranche_effectif" 
                id="tranche_effectif" 
                class="w-full"
              />
            </div>
            
            <div class="form-group">
              <label for="activite_principale" class="block text-sm font-medium text-gray-700 mb-1">
                Activité principale
              </label>
              <InputText 
                v-model="formData.activite_principale" 
                id="activite_principale" 
                class="w-full"
              />
            </div>
            
            <div class="form-group">
              <label for="nature_juridique" class="block text-sm font-medium text-gray-700 mb-1">
                Nature juridique
              </label>
              <InputText 
                v-model="formData.nature_juridique" 
                id="nature_juridique" 
                class="w-full"
              />
            </div>
          </div>
          
          <Button type="submit" label="Soumettre" class="w-full p-button-primary" />
        </form>
      </template>
    </Card>
    
    <SearchDialog v-model:visible="showSearch" @select="handleEntrepriseSelect" />
  </div>
</template>

<style scoped>
.p-calendar {
  width: 100%;
}

.p-calendar .p-inputtext {
  width: 100%;
}

.form-group {
  position: relative;
}

.form-group label {
  transition: all 0.2s;
}

:deep(.form-group:focus-within) label {
  color: var(--primary-color);
}
</style>