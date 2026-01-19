<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useProduct } from '~/composables/useProduct';
import { useRoute } from 'vue-router';
import { useCart } from '~/composables/useCart';
import ToastNotification from '~/components/ToastNotification.vue';
import { useCartStore } from "~/stores/cart";

const route = useRoute();
const productId = route.params.id;
const { product, loading, error, fetchProduct } = useProduct();
const { addToCart } = useCart();
const cart = useCartStore();

const showToast = ref(false);
const toastMessage = ref('');
const selectedVariantIndex = ref(0);
const quantity = ref(1);
const isHoveringImage = ref(false);
const isVideoLoaded = ref(false);

const selectedVariant = computed(() => {
  if (!product.value || !product.value.variants || product.value.variants.length === 0) {
    return null;
  }
  return product.value.variants[selectedVariantIndex.value];
});

const incrementQuantity = () => {
  const maxQuantity = selectedVariant.value?.stockCount || 10;
  if (quantity.value < maxQuantity) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

onMounted(() => {
  if (product.value?.variants?.length)
    selectedVariant.value = product.value.variants[selectedVariantIndex.value]
})

// Reset quantity and selected variant when product changes
watch(() => product.value, () => {
  quantity.value = 1;
  selectedVariantIndex.value = 0;
});


const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const loadProduct = async () => {
  await fetchProduct(productId);
};

const handleVideoLoaded = () => {
  isVideoLoaded.value = true;
};

const addItemToCart = () => {
  if (product.value && selectedVariant.value && quantity.value > 0) {
    addToCart({
      id: `${product.value._id}-${selectedVariant.value.weight}`,
      name: `${product.value.name} (${selectedVariant.value.weight}g)`,
      price: selectedVariant.value.price,
      quantity: quantity.value,
      weight: selectedVariant.weight,
      variant: selectedVariant.value,
      imageUrl: product.value.imageUrl
    });
    cart.addItem(product.value._id, selectedVariant.value.weight, quantity.value)

    toastMessage.value = `${quantity.value}× ${product.value.name} (${selectedVariant.value.weight}g) přidáno do košíku`;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
};

onMounted(() => {
  loadProduct();
});
</script>


<template>
  <ClientOnly class="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <ToastNotification :show="showToast" :message="toastMessage" type="cart" @close="showToast = false" />
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/bath-bombs"
        class="inline-flex items-center text-secondary hover:text-primary font-medium mb-8 transition-colors group">
        <span class="mr-2 text-xl transform group-hover:-translate-x-1 transition-transform">←</span>
        <span class="group-hover:underline">Zpět na produkty</span>
      </NuxtLink>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <p class="text-lg text-gray-600 animate-pulse">Načítání produktu...</p>
      </div>

      <div v-else-if="error" class="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-700 my-8">
        <p>{{ error }}</p>
        <button @click="loadProduct"
          class="bg-primary hover:bg-accent text-white border-none py-2 px-4 rounded mt-4 cursor-pointer transition-colors">
          Zkusit znovu
        </button>
      </div>

      <div v-else-if="!product" class="text-center py-12 text-gray-800">
        <p>Produkt nebyl nalezen.</p>
        <NuxtLink to="/bath-bombs" class="inline-block mt-4 text-primary hover:underline">
          Zpět na seznam produktů
        </NuxtLink>
      </div>

      <div v-else class="mt-8">
        <!-- Two Column Layout: Image and Product Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column: Image + Short Description -->
          <div class="flex flex-col gap-6">
            <div
              class="relative rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 h-96 md:h-[500px] bg-gray-100"
              @mouseenter="isHoveringImage = true" @mouseleave="isHoveringImage = false">
              <video v-if="product.videoUrl && isHoveringImage && isVideoLoaded" :src="product.videoUrl" autoplay loop muted playsinline
                class="w-full h-full object-cover object-center" @loadeddata="handleVideoLoaded">
              </video>
              <video v-else-if="product.videoUrl && isHoveringImage" :src="product.videoUrl" muted playsinline
                class="hidden" @loadeddata="handleVideoLoaded">
              </video>
              <img v-if="!isHoveringImage || !isVideoLoaded" :src="product.imageUrl || '/images/product-placeholder.jpg'" :alt="product.name"
                class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105">

              <span v-if="selectedVariant && !selectedVariant.inStock"
                class="absolute top-5 right-5 bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium shadow-lg transform -rotate-2">
                Vyprodáno
              </span>
            </div>

            <!-- Short Description beneath image -->
            <div v-if="product.shortDescription"
              class="py-4 px-5 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary rounded-r-lg shadow-sm">
              <p class="m-0 italic text-gray-700 leading-relaxed">{{ product.shortDescription }}</p>
            </div>
          </div>

          <!-- Right Column: Product Info + Purchase Options -->
          <div class="flex flex-col gap-6">
          <div>
            <h1 class="text-3xl md:text-4xl text-secondary font-bold mb-2">{{ product.name }}</h1>
            <div class="h-1 w-20 bg-primary rounded-full mb-4"></div>
          </div>

          <!-- Stock Status -->
          <div class="flex items-center gap-3 text-base bg-gray-50 p-3 rounded-lg">
            <span
              :class="[selectedVariant && selectedVariant.inStock ? 'bg-green-500' : 'bg-red-500', 'inline-block w-4 h-4 rounded-full shadow-inner animate-pulse']"></span>
            <span class="font-medium">{{ selectedVariant && selectedVariant.inStock ? 'Skladem' : 'Vyprodáno' }}</span>
            <span v-if="selectedVariant && selectedVariant.stockCount && selectedVariant.inStock"
              class="text-gray-600 bg-white py-1 px-2 rounded-md text-sm">
              {{ selectedVariant.stockCount }} ks
            </span>
          </div>
          <div class="flex flex-col gap-6 w-full">
            <div class="w-full" v-if="product.variants && product.variants?.length > 0">
              <label for="variant-select" class="block text-sm font-medium text-gray-700 mb-2">Vyberte hmotnost:</label>
              <div class="relative">
                <select id="variant-select" v-model="selectedVariantIndex"
                  class="block w-full pl-4 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg appearance-none bg-white shadow-sm">
                  <option v-for="(variant, index) in product.variants" :key="index" :value="index"
                    :disabled="!variant?.inStock">
                    {{ variant?.weight }}g - {{ variant?.price.toFixed(2) }} Kč {{ !variant?.inStock ? '(Vyprodáno)' : '' }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <div class="text-3xl font-bold text-secondary bg-gray-50 py-2 px-4 rounded-lg shadow-sm">
                {{ selectedVariant ? selectedVariant.price.toFixed(2) * quantity : '0.00' }} Kč
              </div>

              <!-- Preview Mode - Coming Soon Message -->
              <div class="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-lg p-4 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-semibold text-secondary mb-1">Brzy k dispozici!</p>
                  <p class="text-sm text-gray-600">E-shop se připravuje na spuštění. Sledujte nás na sociálních sítích pro aktuální informace.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium mb-4 text-secondary">Specifikace produktu</h3>
            <div class="flex flex-col p-3">
              <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Složení</span>
              <span class="text-gray-800 font-medium">{{ product.ingredients }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="product.storageMethod" class="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Způsob skladování</span>
                <span class="text-gray-800 font-medium">{{ product.storageMethod }}</span>
              </div>
              <div v-if="product.weight" class="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Hmotnost</span>
                <span class="text-gray-800 font-medium">{{ product.weight }} g</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Full Width Story Section -->
        <div class="my-8">
          <div>
            <h2 class="text-2xl mb-4 text-secondary font-semibold flex items-center">
              <span class="inline-block w-2 h-6 bg-primary rounded-full mr-3"></span>
              Příběh
            </h2>
            <p class="leading-relaxed text-gray-800 bg-white p-5 rounded-lg shadow-sm border border-gray-100">{{ product.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
