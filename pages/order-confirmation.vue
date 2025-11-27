<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="flex justify-center mb-6">
          <div class="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 class="text-2xl font-bold text-secondary mb-4">Děkujeme za Vaši objednávku!</h1>
        <p class="text-gray-600 mb-6">Vaše objednávka byla úspěšně přijata a bude zpracována co nejdříve.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-gray-700">Číslo objednávky: <span class="font-medium">{{ orderId }}</span></p>
        </div>
        
        <p class="text-gray-600 mb-8">
          Potvrzení objednávky bylo odesláno na Váš email. Budeme Vás informovat o stavu Vaší objednávky.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/" class="bg-primary text-white py-3 px-6 rounded-lg hover:bg-accent transition-colors">
            Zpět na úvodní stránku
          </NuxtLink>
          
          <NuxtLink to="/bath-bombs" class="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
            Pokračovat v nákupu
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = computed(() => route.query.orderId || 'N/A');
</script>
