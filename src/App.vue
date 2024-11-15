<script setup lang="ts">
import { ref } from 'vue';
import SearchDialog from './components/SearchDialog.vue';
import CompanyForm from './components/CompanyForm.vue';
import type { EntrepriseInfo } from './types/entreprise';

const searchDialogVisible = ref(false);
const companyFormRef = ref();

const handleCompanySelect = (company: EntrepriseInfo) => {
  companyFormRef.value?.updateFormData(company);
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Gestion des entreprises</h1>>
    </header>

    <main class="app-content">
      <CompanyForm ref="companyFormRef" />
    </main>

    <SearchDialog 
      v-model:visible="searchDialogVisible"
      @select="handleCompanySelect"
    />
  </div>
</template>

<style>
@import 'primevue/resources/themes/lara-light-blue/theme.css';
@import 'primevue/resources/primevue.min.css';
@import 'primeicons/primeicons.css';

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  h1 {
    margin: 0;
  }
}

.app-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>