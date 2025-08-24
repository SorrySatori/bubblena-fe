
<script setup>
import { ref } from 'vue';
import { useCart } from '~/composables/useCart';
import ToastNotification from '~/components/ToastNotification.vue';

const { 
  cartItems, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  totalItems, 
  totalPrice, 
  isEmpty 
} = useCart();

// Fixed shipping cost
const shipping = ref(99);

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('cart');

// Quantity adjustment functions
const incrementQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item) {
    updateQuantity(itemId, item.quantity + 1);
  }
};

const decrementQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    updateQuantity(itemId, item.quantity - 1);
  }
};

// Remove item from cart
const removeItem = (itemId) => {
  removeFromCart(itemId);
  
  // Show toast notification
  toastMessage.value = 'Položka byla odstraněna z košíku';
  toastType.value = 'info';
  showToast.value = true;
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Clear cart with confirmation
const clearCartWithConfirmation = () => {
  if (confirm('Opravdu chcete vyprázdnit košík?')) {
    clearCart();
    
    // Show toast notification
    toastMessage.value = 'Košík byl vyprázdněn';
    toastType.value = 'info';
    showToast.value = true;
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
};

// Proceed to payment (placeholder function)
const proceedToPayment = () => {
  // This would typically navigate to a payment page or process
  // For now, just show a toast notification
  toastMessage.value = 'Tato funkce ještě není implementována';
  toastType.value = 'info';
  showToast.value = true;
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};
</script>


<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-secondary mb-8">Pokladna</h1>
      
      <!-- Empty cart state -->
      <div v-if="isEmpty" class="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-xl font-medium text-secondary mb-4">Váš košík je prázdný</h2>
        <p class="text-gray-500 mb-6">Přidejte nějaké produkty do košíku a vraťte se zpět.</p>
        <NuxtLink to="/products" class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zpět na produkty
        </NuxtLink>
      </div>
      
      <!-- Cart with items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-medium text-secondary">Položky v košíku ({{ totalItems }})</h2>
            </div>
            
            <ul class="divide-y divide-gray-200">
              <li v-for="item in cartItems" :key="item.id" class="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div class="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    :src="item.imageUrl || '/images/product-placeholder.jpg'" 
                    :alt="item.name" 
                    class="h-full w-full object-cover"
                  >
                </div>
                
                <div class="flex-1">
                  <h3 class="font-medium text-secondary">{{ item.name }}</h3>
                  <p class="text-gray-500 text-sm mt-1">{{ item.price.toFixed(2) }} Kč / ks</p>
                </div>
                
                <div class="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    @click="decrementQuantity(item.id)" 
                    class="px-3 py-1 text-gray-600 hover:text-primary focus:outline-none"
                  >
                    <span class="text-lg font-medium">-</span>
                  </button>
                  <span class="px-3 py-1 text-gray-800 font-medium min-w-[40px] text-center">{{ item.quantity }}</span>
                  <button 
                    @click="incrementQuantity(item.id)" 
                    class="px-3 py-1 text-gray-600 hover:text-primary focus:outline-none"
                  >
                    <span class="text-lg font-medium">+</span>
                  </button>
                </div>
                
                <div class="text-right">
                  <div class="font-medium text-secondary">{{ (item.price * item.quantity).toFixed(2) }} Kč</div>
                  <button 
                    @click="removeItem(item.id)" 
                    class="text-sm text-red-500 hover:text-red-700 mt-1 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Odstranit
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Order summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-medium text-secondary mb-6">Souhrn objednávky</h2>
            
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Mezisoučet</span>
                <span class="font-medium">{{ totalPrice.toFixed(2) }} Kč</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Doprava</span>
                <span class="font-medium">{{ shipping.toFixed(2) }} Kč</span>
              </div>
              
              <div class="border-t border-gray-200 pt-4 flex justify-between">
                <span class="text-lg font-medium text-secondary">Celkem</span>
                <span class="text-lg font-bold text-secondary">{{ (totalPrice + shipping).toFixed(2) }} Kč</span>
              </div>
            </div>
            
            <button 
              @click="proceedToPayment" 
              class="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pokračovat k platbě
            </button>
            
            <button 
              @click="clearCart" 
              class="w-full mt-4 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Vyprázdnit košík
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <ToastNotification 
      :show="showToast" 
      :message="toastMessage" 
      :type="toastType"
      @close="showToast = false"
    />
  </div>
</template>
