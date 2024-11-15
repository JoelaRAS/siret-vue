<script setup lang="ts">
import { ref } from 'vue';
import type { EntrepriseInfo } from '../types/entreprise';
import CompanySearchDialog from './SearchDialog.vue';

const formData = ref<EntrepriseInfo>({
  nom_complet: '',
  siret: '',
  siren: '',
  adresse: '',
  code_postal: '',
  ville: '',
  numeroVoieEtablissement: '',
  typeVoieEtablissement: '',
  libelleVoieEtablissement: '',
  date_creation: null,
  tranche_effectif: '',
  activite_principale: '',
  nature_juridique: '',
  vat_number: '',
});

const isDialogVisible = ref(false);

const updateFormData = (company: EntrepriseInfo) => {
  console.log("Date de création reçue:", company.date_creation);
  let formattedDate = null;

  if (company.date_creation && typeof company.date_creation === 'string') {
    const dateParts = (company.date_creation as string).split('/');
    if (dateParts.length === 3) {
      // Recompose la date en format "aaaa-mm-jj" pour que JavaScript puisse la reconnaître
      const isoDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const parsedDate = new Date(isoDateString);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate;
      } else {
        console.warn("Impossible de convertir la date :", company.date_creation);
      }
    } else {
      console.warn("Format de date inattendu :", company.date_creation);
    }
  }

  formData.value = { 
    ...company,
    date_creation: formattedDate, // Affecte la date au bon format ou null
  };
};



defineExpose({ updateFormData });
</script>

<template>
  <!-- Formulaire principal -->
  <form class="company-form" @submit.prevent>
    <!-- Bouton pour ouvrir le popup de recherche -->
    <Button label="Rechercher une entreprise" icon="pi pi-search" @click="isDialogVisible = true" />

    <div class="form-group">
      <label for="nom_complet">Nom de l'entreprise</label>
      <InputText id="nom_complet" v-model="formData.nom_complet" placeholder="Nom de l'entreprise" />

    <div class="form-group">
      <label for="siret">SIRET</label>
      <InputText id="siret" v-model="formData.siret" placeholder="Numéro SIRET" />
    </div>

    <div class="form-group">
      <label for="siren">SIREN</label>
      <InputText id="siren" v-model="formData.siren" placeholder="Numéro SIREN" />
    </div>

    <div class="form-group">
      <label for="adresse">Adresse complète</label>
      <InputText id="adresse" v-model="formData.adresse" placeholder="Adresse complète" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="code_postal">Code postal</label>
        <InputText id="code_postal" v-model="formData.code_postal" placeholder="Code postal" />
      </div>

      <div class="form-group">
        <label for="ville">Ville</label>
        <InputText id="ville" v-model="formData.ville" placeholder="Ville" />
      </div>
    </div>

    <div class="form-group">
      <label for="date_creation">Date de création</label>
      <Calendar 
        id="date_creation"
        v-model="formData.date_creation" 
        name="date_creation"
        dateFormat="dd/mm/yy"
        placeholder="Sélectionnez une date"
      />
    </div>


      <div class="form-group">
        <label for="tranche_effectif">Tranche d'effectif</label>
        <InputText id="tranche_effectif" v-model="formData.tranche_effectif" placeholder="Tranche d'effectif" />
      </div>
    </div>

    <div class="form-group">
      <label for="activite_principale">Activité principale</label>
      <InputText id="activite_principale" v-model="formData.activite_principale" placeholder="Activité principale" />
    </div>

    <div class="form-group">
      <label for="nature_juridique">Nature juridique</label>
      <InputText id="nature_juridique" v-model="formData.nature_juridique" placeholder="Nature juridique" />
    </div>

    <div class="form-group">
      <label for="vat_number">Numéro de TVA intracommunautaire</label>
      <InputText id="vat_number" v-model="formData.vat_number" placeholder="Numéro de TVA intracommunautaire" disabled />
    </div>
  </form>

  <!-- Popup de recherche d'entreprise -->
  <CompanySearchDialog 
    :visible="isDialogVisible" 
    @update:visible="isDialogVisible = $event" 
    @selectCompany="updateFormData" 
  />
</template>

<style scoped lang="scss">
.company-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #444;
    }

    .p-inputtext,
    .p-calendar {
      width: 100%;
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-actions {
    margin-top: 2rem;
    text-align: right;
  }
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-inputtext::placeholder) {
  color: #999;
}
</style>
