<script setup lang="ts">
import { ref } from 'vue';
import type { EntrepriseInfo } from '../types/entreprise';

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

const updateFormData = (company: EntrepriseInfo) => {
  formData.value = { ...company };
};

defineExpose({ updateFormData });
</script>

<template>
  <form class="company-form" @submit.prevent>
    <div class="form-group">
      <label for="nom_complet">Nom de l'entreprise</label>
      <InputText 
        id="nom_complet"
        v-model="formData.nom_complet" 
        name="nom_complet"
        placeholder="Nom de l'entreprise"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="siret">SIRET</label>
        <InputText 
          id="siret"
          v-model="formData.siret" 
          name="siret"
          placeholder="Numéro SIRET"
        />
      </div>
      <div class="form-group">
        <label for="siren">SIREN</label>
        <InputText 
          id="siren"
          v-model="formData.siren" 
          name="siren"
          placeholder="Numéro SIREN"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="adresse">Adresse</label>
      <InputText 
        id="adresse"
        v-model="formData.adresse" 
        name="adresse"
        placeholder="Adresse complète"
      />
    </div>

    <div class="form-row">
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
        <InputText 
          id="tranche_effectif"
          v-model="formData.tranche_effectif" 
          name="tranche_effectif"
          placeholder="Tranche d'effectif"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="activite_principale">Activité principale</label>
      <InputText 
        id="activite_principale"
        v-model="formData.activite_principale" 
        name="activite_principale"
        placeholder="Activité principale de l'entreprise"
      />
    </div>

    <div class="form-group">
      <label for="nature_juridique">Nature juridique</label>
      <InputText 
        id="nature_juridique"
        v-model="formData.nature_juridique" 
        name="nature_juridique"
        placeholder="Nature juridique de l'entreprise"
      />
    </div>

    <div class="form-actions">
      <Button 
        type="submit"
        label="Enregistrer" 
        icon="pi pi-check" 
        class="p-button-success"
      />
    </div>
  </form>
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