<template>
  <div class="relative" @click.stop>
    <!-- Cart Icon with Badge -->
    <button 
      @click.stop="toggleCart" 
      class="relative p-2 text-secondary hover:text-primary transition-colors focus:outline-none"
      aria-label="Shopping Cart"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span 
        v-if="totalItems > 0" 
        class="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ totalItems > 99 ? '99+' : totalItems }}
      </span>
    </button>

    <!-- Cart Dropdown -->
    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
      ref="cartDropdown"
    >
      <div class="p-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-secondary">Košík</h3>
          <span class="text-sm text-gray-500">{{ totalItems }} položek</span>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div v-if="isEmpty" class="p-6 text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p>Váš košík je prázdný</p>
      </div>

      <!-- Cart Items -->
      <div v-else class="max-h-96 overflow-y-auto">
        <div 
          v-for="item in cartItems" 
          :key="item.id" 
          class="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50"
        >
          <div class="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            <img 
              :src="item.imageUrl || '/images/product-placeholder.jpg'" 
              :alt="item.name" 
              class="h-full w-full object-cover"
            >
          </div>
          <div class="ml-4 flex-1">
            <div class="font-medium text-secondary">{{ item.name }}</div>
            <div class="flex justify-between items-center mt-1">
              <div class="text-sm text-gray-500">
                {{ item.price.toFixed(2) }} Kč × {{ item.quantity }}
              </div>
              <div class="text-primary font-medium">
                {{ (item.price * item.quantity).toFixed(2) }} Kč
              </div>
            </div>
          </div>
          <button 
            @click="removeItem(item.id)" 
            class="ml-2 text-gray-400 hover:text-red-500"
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Footer -->
      <div v-if="!isEmpty" class="p-4 bg-gray-50">
        <div class="flex justify-between items-center mb-4">
          <span class="font-medium">Celkem:</span>
          <span class="text-lg font-bold text-secondary">{{ totalPrice.toFixed(2) }} Kč</span>
        </div>
        <div>
          <NuxtLink 
            to="/checkout" 
            class="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-accent transition-colors text-center block"
          >
            Pokladna
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useCart } from '~/composables/useCart';

const { 
  cartItems, 
  removeFromCart, 
  totalItems, 
  totalPrice, 
  isEmpty 
} = useCart();
const isOpen = ref(false);
const cartDropdown = ref(null);

const toggleCart = () => {
  isOpen.value = !isOpen.value;
};

const removeItem = (id) => {
  removeFromCart(id);
};

// Close cart when clicking outside
// Modified click outside handler to prevent closing when clicking the cart button
const handleClickOutside = (event) => {
  // Get the cart button element
  const cartButton = document.querySelector('[aria-label="Shopping Cart"]');
  
  // Only close if we're not clicking on the cart button or inside the dropdown
  if (
    isOpen.value && 
    cartDropdown.value && 
    !cartDropdown.value.contains(event.target) && 
    (!cartButton || !cartButton.contains(event.target))
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  // Use nextTick to ensure the DOM is fully rendered
  nextTick(() => {
    document.addEventListener('click', handleClickOutside);
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
