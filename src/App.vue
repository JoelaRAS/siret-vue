<script setup lang="ts">
import EnterpriseForm from './components/EnterpriseForm.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <EnterpriseForm />
  </div>
</template>

<style>
.min-h-screen {
  min-height: 100vh;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>