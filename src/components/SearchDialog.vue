<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchEntreprise, searchEntrepriseByName } from '../services/entrepriseApi';
import type { EntrepriseInfo } from '../types';

const query = ref('');
const searchType = ref('siret');
const shouldSearch = ref(false);
const loading = ref(false);
const results = ref<EntrepriseInfo[]>([]);
const error = ref<string | null>(null);

const handleSubmit = (e: Event) => {
  e.preventDefault();
  shouldSearch.value = true;
};

watch([query, searchType, shouldSearch], async ([newQuery, newSearchType, newShouldSearch]) => {
  if (newShouldSearch && newQuery) {
    loading.value = true;
    error.value = null;
    try {
      results.value = await (newSearchType === 'siret' 
        ? searchEntreprise(newQuery)
        : searchEntrepriseByName(newQuery));
    } catch (e: any) {
      error.value = e.message;
      results.value = [];
    } finally {
      loading.value = false;
      shouldSearch.value = false;
    }
  }
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="card w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
      <div class="card-header bg-gray-800 p-6">
        <h2 class="card-title text-2xl font-bold text-white">Recherche d'entreprise</h2>
      </div>
      <div class="card-content p-6">
        <div class="tabs">
          <div class="tabs-list grid w-full grid-cols-2 mb-6">
            <button 
              class="tabs-trigger py-2 px-4 text-center font-medium transition-colors duration-200"
              :class="{ 'bg-gray-800 text-white': searchType === 'siret', 'bg-gray-200 text-gray-700': searchType !== 'siret' }"
              @click="searchType = 'siret'"
            >
              Par SIRET/SIREN
            </button>
            <button 
              class="tabs-trigger py-2 px-4 text-center font-medium transition-colors duration-200"
              :class="{ 'bg-gray-800 text-white': searchType === 'name', 'bg-gray-200 text-gray-700': searchType !== 'name' }"
              @click="searchType = 'name'"
            >
              Par Nom
            </button>
          </div>
          <div class="tabs-content" v-if="searchType === 'siret'">
            <form @submit="handleSubmit" class="space-y-4">
              <input
                type="text"
                v-model="query"
                placeholder="Entrez le numéro SIRET ou SIREN (complet ou partiel)"
                class="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
              <button type="submit" class="button w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200">Rechercher</button>
            </form>
          </div>
          <div class="tabs-content" v-if="searchType === 'name'">
            <form @submit="handleSubmit" class="space-y-4">
              <input
                type="text"
                v-model="query"
                placeholder="Entrez le nom de l'entreprise (complet ou partiel)"
                class="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
              <button type="submit" class="button w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200">Rechercher</button>
            </form>
          </div>
        </div>

        <div v-if="loading" class="mt-4 text-center text-gray-600">Chargement...</div>
        <div v-if="results.length" class="mt-6 space-y-6">
          <div v-for="(entreprise, index) in results" :key="index" class="border border-gray-200 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ entreprise.nom_complet || 'Nom non disponible' }}</h2>
            <p class="text-sm text-gray-600"><strong>SIRET :</strong> {{ entreprise.siret || 'Non disponible' }}</p>
            <p class="text-sm text-gray-600"><strong>SIREN :</strong> {{ entreprise.siren || 'Non disponible' }}</p>
            <p class="text-sm text-gray-600"><strong>Adresse :</strong> {{ entreprise.adresse || 'Non disponible' }}</p>
            <p class="text-sm text-gray-600"><strong>Date de création :</strong> {{ entreprise.date_creation || 'Non disponible' }}</p>
            <p class="text-sm text-gray-600"><strong>Tranche d'effectif :</strong> {{ entreprise.tranche_effectif || 'Non disponible' }}</p>
            <p class="text-sm text-gray-600"><strong>Activité principale :</strong> {{ entreprise.activite_principale || 'Non disponible' }}</p>
            <p class="text-sm text-gray-600"><strong>Nature juridique :</strong> {{ entreprise.nature_juridique || 'Non disponible' }}</p>
          </div>
        </div>
        <div v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</div>
      </div>
    </div>
  </div>
</template>