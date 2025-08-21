<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Back button -->
      <NuxtLink to="/products" class="inline-flex items-center text-secondary hover:text-primary font-medium mb-8 transition-colors">
        <span class="mr-2 text-xl">←</span> Zpět na produkty
      </NuxtLink>

      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p>Načítání produktu...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-700 my-8">
        <p>{{ error }}</p>
        <button @click="loadProduct" class="bg-primary hover:bg-accent text-white border-none py-2 px-4 rounded mt-4 cursor-pointer transition-colors">
          Zkusit znovu
        </button>
      </div>
      
      <!-- No product state -->
      <div v-else-if="!product" class="text-center py-12 text-gray-800">
        <p>Produkt nebyl nalezen.</p>
        <NuxtLink to="/products" class="inline-block mt-4 text-primary hover:underline">
          Zpět na seznam produktů
        </NuxtLink>
      </div>
      
      <!-- Product detail -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <div class="relative rounded-lg overflow-hidden shadow-md">
          <img :src="product.imageUrl || '/images/product-placeholder.jpg'" :alt="product.name" class="w-full h-auto block">
          <span v-if="!product.inStock" class="absolute top-5 right-5 bg-red-500/90 text-white py-2 px-4 rounded text-sm font-medium">
            Vyprodáno
          </span>
        </div>
        
        <div class="flex flex-col gap-6">
          <h1 class="text-4xl md:text-5xl text-secondary m-0">{{ product.name }}</h1>
          <div class="text-3xl font-bold text-secondary">${{ product.price.toFixed(2) }}</div>
          
          <div class="flex items-center gap-2 text-base">
            <span :class="[product.inStock ? 'bg-green-500' : 'bg-red-500', 'inline-block w-3 h-3 rounded-full']"></span>
            <span>{{ product.inStock ? 'Skladem' : 'Vyprodáno' }}</span>
            <span v-if="product.stockCount && product.inStock" class="text-gray-500">({{ product.stockCount }} ks)</span>
          </div>
          
          <div v-if="product.shortDescription" class="my-2 py-3 px-4 bg-gray-50 border-l-3 border-primary rounded">
            <p class="m-0 italic text-gray-600 leading-relaxed">{{ product.shortDescription }}</p>
          </div>
          
          <div class="mt-4">
            <h2 class="text-2xl mb-4 text-secondary">Popis produktu</h2>
            <p class="leading-relaxed text-gray-800">{{ product.description }}</p>
          </div>
          
          <div class="mt-4 border-t border-gray-200 pt-4">
            <div v-if="product.storageMethod" class="mb-2">
              <span class="font-medium mr-2">Způsob skladování:</span>
              <span class="text-gray-600">{{ product.storageMethod }}</span>
            </div>
            <div v-if="product.weight" class="mb-2">
              <span class="font-medium mr-2">Hmotnost:</span>
              <span class="text-gray-600">{{ product.weight }} g</span>
            </div>
            <div v-if="product.createdAt" class="mb-2">
              <span class="font-medium mr-2">Přidáno:</span>
              <span class="text-gray-600">{{ formatDate(product.createdAt) }}</span>
            </div>
          </div>
          
          <div class="mt-4">
            <button 
              class="bg-primary text-white border-none py-3 px-6 rounded text-base font-medium w-full max-w-xs transition-colors hover:bg-accent disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed" 
              :disabled="!product.inStock"
            >
              {{ product.inStock ? 'Přidat do košíku' : 'Vyprodáno' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProduct } from '~/composables/useProduct';
import { useRoute } from 'vue-router';

const route = useRoute();
const productId = route.params.id;
const { product, loading, error, fetchProduct } = useProduct();

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Load product data
const loadProduct = async () => {
  await fetchProduct(productId);
};

// Load product when component is mounted
onMounted(() => {
  loadProduct();
});
</script>
