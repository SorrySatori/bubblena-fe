<template>
  <div class="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back button -->
      <NuxtLink to="/products" class="inline-flex items-center text-secondary hover:text-primary font-medium mb-8 transition-colors group">
        <span class="mr-2 text-xl transform group-hover:-translate-x-1 transition-transform">←</span> 
        <span class="group-hover:underline">Zpět na produkty</span>
      </NuxtLink>

      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <p class="text-lg text-gray-600 animate-pulse">Načítání produktu...</p>
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
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div class="relative rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 h-96 md:h-[500px] bg-gray-100">
          <img 
            :src="product.imageUrl || '/images/product-placeholder.jpg'" 
            :alt="product.name" 
            class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span 
            v-if="!product.inStock" 
            class="absolute top-5 right-5 bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium shadow-lg transform -rotate-2"
          >
            Vyprodáno
          </span>
        </div>
        
        <div class="flex flex-col gap-8">
          <div>
            <h1 class="text-4xl md:text-5xl text-secondary font-bold mb-2">{{ product.name }}</h1>
            <div class="h-1 w-20 bg-primary rounded-full mb-6"></div>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <div class="text-3xl font-bold text-secondary bg-gray-50 py-2 px-4 rounded-lg shadow-sm">
              {{ product.price.toFixed(2) }} Kč
            </div>
            
            <div class="flex items-center gap-2" v-if="product.inStock">
              <div class="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <button 
                  @click="decrementQuantity" 
                  class="px-3 py-2 text-gray-600 hover:text-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="quantity <= 1"
                >
                  <span class="text-xl font-medium">-</span>
                </button>
                <span class="px-3 py-2 text-gray-800 font-medium min-w-[40px] text-center">{{ quantity }}</span>
                <button 
                  @click="incrementQuantity" 
                  class="px-3 py-2 text-gray-600 hover:text-primary focus:outline-none"
                  :disabled="quantity >= (product.stockCount || 10)"
                >
                  <span class="text-xl font-medium">+</span>
                </button>
              </div>
              
              <button 
                class="bg-primary text-white border-none py-2 px-4 rounded-lg text-base font-medium transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1 flex items-center gap-2" 
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Přidat do košíku
              </button>
            </div>
            
            <button 
              v-else
              class="bg-gray-200 text-gray-500 border-none py-2 px-4 rounded-lg text-base font-medium cursor-not-allowed"
              disabled
            >
              Vyprodáno
            </button>
          </div>
          
          <div class="flex items-center gap-3 text-base bg-gray-50 p-3 rounded-lg">
            <span 
              :class="[product.inStock ? 'bg-green-500' : 'bg-red-500', 'inline-block w-4 h-4 rounded-full shadow-inner animate-pulse']"
            ></span>
            <span class="font-medium">{{ product.inStock ? 'Skladem' : 'Vyprodáno' }}</span>
            <span 
              v-if="product.stockCount && product.inStock" 
              class="text-gray-600 bg-white py-1 px-2 rounded-md text-sm"
            >
              {{ product.stockCount }} ks
            </span>
          </div>
          
          <div 
            v-if="product.shortDescription" 
            class="my-2 py-4 px-5 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary rounded-r-lg shadow-sm"
          >
            <p class="m-0 italic text-gray-700 leading-relaxed">{{ product.shortDescription }}</p>
          </div>
          
          <div class="mt-6">
            <h2 class="text-2xl mb-4 text-secondary font-semibold flex items-center">
              <span class="inline-block w-2 h-6 bg-primary rounded-full mr-3"></span>
              Příběh
            </h2>
            <p class="leading-relaxed text-gray-800 bg-white p-5 rounded-lg shadow-sm border border-gray-100">{{ product.description }}</p>
          </div>
          
          <div class="mt-8 border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium mb-4 text-secondary">Specifikace produktu</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="product.storageMethod" class="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Způsob skladování</span>
                <span class="text-gray-800 font-medium">{{ product.storageMethod }}</span>
              </div>
              <div v-if="product.weight" class="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Hmotnost</span>
                <span class="text-gray-800 font-medium">{{ product.weight }} g</span>
              </div>
              <div v-if="product.createdAt" class="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Přidáno</span>
                <span class="text-gray-800 font-medium">{{ formatDate(product.createdAt) }}</span>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useProduct } from '~/composables/useProduct';
import { useRoute } from 'vue-router';

const route = useRoute();
const productId = route.params.id;
const { product, loading, error, fetchProduct } = useProduct();

// Quantity state for add to cart
const quantity = ref(1);

// Increment and decrement quantity functions
const incrementQuantity = () => {
  const maxQuantity = product.value?.stockCount || 10;
  if (quantity.value < maxQuantity) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Reset quantity when product changes
watch(() => product.value, () => {
  quantity.value = 1;
});

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
