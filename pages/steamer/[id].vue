<script setup>
import { onMounted, ref } from 'vue';
import { useSteamers } from '~/composables/useSteamers';
import { useRoute } from 'vue-router';
import { useCart } from '~/composables/useCart';
import ToastNotification from '~/components/ToastNotification.vue';
import { useCartStore } from "~/stores/cart";

const route = useRoute();
const steamerId = route.params.id;
const { getSteamer } = useSteamers();
const { addToCart } = useCart();
const cart = useCartStore();

const steamer = ref(null);
const loading = ref(false);
const error = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const quantity = ref(1);
const isHoveringImage = ref(false);
const isVideoLoaded = ref(false);

const incrementQuantity = () => {
  const maxQuantity = steamer.value?.stockCount || 10;
  if (quantity.value < maxQuantity) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const loadSteamer = async () => {
  loading.value = true;
  error.value = null;
  try {
    steamer.value = await getSteamer(steamerId);
  } catch (err) {
    error.value = 'Nepodařilo se načíst steamer';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleVideoLoaded = () => {
  isVideoLoaded.value = true;
};

const addItemToCart = () => {
  if (steamer.value && steamer.value.inStock && quantity.value > 0) {
    addToCart({
      id: steamer.value._id,
      name: `${steamer.value.name} (${steamer.value.weight}g)`,
      price: steamer.value.price,
      quantity: quantity.value,
      imageUrl: steamer.value.imageUrl
    });

    toastMessage.value = `${quantity.value}× ${steamer.value.name} přidáno do košíku`;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
};

onMounted(() => {
  loadSteamer();
});
</script>

<template>
  <ClientOnly class="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <ToastNotification :show="showToast" :message="toastMessage" type="cart" @close="showToast = false" />
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/steamers"
        class="inline-flex items-center text-secondary hover:text-primary font-medium mb-8 transition-colors group">
        <span class="mr-2 text-xl transform group-hover:-translate-x-1 transition-transform">←</span>
        <span class="group-hover:underline">Zpět na steamery</span>
      </NuxtLink>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <p class="text-lg text-gray-600 animate-pulse">Načítání steameru...</p>
      </div>

      <div v-else-if="error" class="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-700 my-8">
        <p>{{ error }}</p>
        <button @click="loadSteamer"
          class="bg-primary hover:bg-accent text-white border-none py-2 px-4 rounded mt-4 cursor-pointer transition-colors">
          Zkusit znovu
        </button>
      </div>

      <div v-else-if="!steamer" class="text-center py-12 text-gray-800">
        <p>Steamer nebyl nalezen.</p>
        <NuxtLink to="/steamers" class="inline-block mt-4 text-primary hover:underline">
          Zpět na seznam steamerů
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
              <video v-if="steamer.videoUrl && isHoveringImage && isVideoLoaded" :src="steamer.videoUrl" autoplay loop muted playsinline
                class="w-full h-full object-cover object-center" @loadeddata="handleVideoLoaded">
              </video>
              <video v-else-if="steamer.videoUrl && isHoveringImage" :src="steamer.videoUrl" muted playsinline
                class="hidden" @loadeddata="handleVideoLoaded">
              </video>
              <img v-if="!isHoveringImage || !isVideoLoaded" :src="steamer.imageUrl || '/images/product-placeholder.jpg'" :alt="steamer.name"
                class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105">

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <span v-if="!steamer.inStock"
                class="absolute top-5 right-5 bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium shadow-lg transform -rotate-2">
                Vyprodáno
              </span>
            </div>

            <!-- Short Description beneath image -->
            <div v-if="steamer.shortDescription"
              class="py-4 px-5 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary rounded-r-lg shadow-sm">
              <p class="m-0 italic text-gray-700 leading-relaxed">{{ steamer.shortDescription }}</p>
            </div>
          </div>

          <!-- Right Column: Product Info + Purchase Options -->
          <div class="flex flex-col gap-6">
          <div>
            <h1 class="text-3xl md:text-4xl text-secondary font-bold mb-2">{{ steamer.name }}</h1>
            <div class="h-1 w-20 bg-primary rounded-full mb-4"></div>
          </div>

          <!-- Stock Status -->
          <div class="flex items-center gap-3 text-base bg-gray-50 p-3 rounded-lg">
            <span
              :class="[steamer.inStock ? 'bg-green-500' : 'bg-red-500', 'inline-block w-4 h-4 rounded-full shadow-inner animate-pulse']"></span>
            <span class="font-medium">{{ steamer.inStock ? 'Skladem' : 'Vyprodáno' }}</span>
            <span v-if="steamer.stockCount && steamer.inStock"
              class="text-gray-600 bg-white py-1 px-2 rounded-md text-sm">
              {{ steamer.stockCount }} ks
            </span>
          </div>
          <div class="flex flex-col gap-6 w-full">
            <!-- Weight Display -->
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700 mb-2">Hmotnost:</label>
              <div class="bg-gray-50 py-3 px-4 rounded-lg shadow-sm">
                <span class="text-lg font-semibold text-secondary">{{ steamer.weight }}g</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <div class="text-3xl font-bold text-secondary bg-gray-50 py-2 px-4 rounded-lg shadow-sm">
                {{ (steamer.price * quantity).toFixed(2) }} Kč
              </div>

              <div class="flex items-center gap-2" v-if="steamer.inStock">
                <div class="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                  <button @click="decrementQuantity"
                    class="px-3 py-2 text-gray-600 hover:text-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="quantity <= 1">
                    <span class="text-xl font-medium">-</span>
                  </button>
                  <span class="px-3 py-2 text-gray-800 font-medium min-w-[40px] text-center">{{ quantity }}</span>
                  <button @click="incrementQuantity"
                    class="px-3 py-2 text-gray-600 hover:text-primary focus:outline-none"
                    :disabled="quantity >= (steamer.stockCount || 10)">
                    <span class="text-xl font-medium">+</span>
                  </button>
                </div>

                <button @click="addItemToCart"
                  class="bg-primary text-white border-none py-2 px-4 rounded-lg text-base font-medium transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Přidat do košíku
                </button>
              </div>

              <button v-else
                class="bg-gray-200 text-gray-500 border-none py-2 px-4 rounded-lg text-base font-medium cursor-not-allowed"
                disabled>
                Vyprodáno
              </button>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium mb-4 text-secondary">Specifikace produktu</h3>
            <div class="flex flex-col p-3">
              <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Složení</span>
              <span class="text-gray-800 font-medium">{{ steamer.ingredients }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="steamer.storageMethod" class="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Způsob skladování</span>
                <span class="text-gray-800 font-medium">{{ steamer.storageMethod }}</span>
              </div>
              <div v-if="steamer.weight" class="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                <span class="text-xs uppercase tracking-wider text-gray-500 mb-1">Hmotnost</span>
                <span class="text-gray-800 font-medium">{{ steamer.weight }} g</span>
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
            <p class="leading-relaxed text-gray-800 bg-white p-5 rounded-lg shadow-sm border border-gray-100">{{ steamer.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
