
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '~/composables/useCart';
import { useCheckout } from '~/composables/useCheckout';
import CustomerInformation from '~/components/checkout/CustomerInformation.vue';
import ShippingMethod from '~/components/checkout/ShippingMethod.vue';
import PaymentMethod from '~/components/checkout/PaymentMethod.vue';
import OrderReview from '~/components/checkout/OrderReview.vue';
import ToastNotification from '~/components/ToastNotification.vue';

const router = useRouter();

const { 
  cartItems, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  totalItems, 
  totalPrice, 
  isEmpty 
} = useCart();

const {
  checkoutState,
  selectedShipping,
  selectedPayment,
  shippingCost,
  paymentSurcharge,
  orderTotal,
  nextStep,
  previousStep
} = useCheckout();

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('cart');

// Redirect to products if cart is empty
onMounted(() => {
  if (isEmpty.value) {
    router.push('/products');
  }
});

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
    
    // Redirect to products
    router.push('/products');
  }
};

// Go to specific checkout step
const goToStep = (step) => {
  checkoutState.value.step = step;
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
      
      <!-- Checkout process -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout steps -->
        <div class="lg:col-span-2">
          <!-- Step indicator -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between">
              <div 
                v-for="(step, index) in ['information', 'shipping', 'payment', 'review']" 
                :key="step"
                class="flex flex-col items-center"
                :class="{'text-primary': checkoutState.step === step, 'text-gray-400': checkoutState.step !== step}"
              >
                <div 
                  class="h-8 w-8 rounded-full flex items-center justify-center mb-2"
                  :class="{
                    'bg-primary text-white': checkoutState.step === step,
                    'bg-gray-200 text-gray-600': checkoutState.step !== step
                  }"
                >
                  {{ index + 1 }}
                </div>
                <span class="text-sm hidden sm:block">
                  {{ step === 'information' ? 'Informace' : 
                     step === 'shipping' ? 'Doprava' : 
                     step === 'payment' ? 'Platba' : 'Souhrn' }}
                </span>
              </div>
            </div>
            <div class="relative mt-2">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded"></div>
              <div 
                class="absolute top-0 left-0 h-1 bg-primary rounded transition-all duration-300"
                :style="{
                  width: checkoutState.step === 'information' ? '25%' : 
                         checkoutState.step === 'shipping' ? '50%' : 
                         checkoutState.step === 'payment' ? '75%' : '100%'
                }"
              ></div>
            </div>
          </div>
          
          <!-- Step content -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Customer Information Step -->
            <CustomerInformation 
              v-if="checkoutState.step === 'information'" 
              @next="nextStep"
            />
            
            <!-- Shipping Method Step -->
            <ShippingMethod 
              v-else-if="checkoutState.step === 'shipping'" 
              @prev="previousStep"
              @next="nextStep"
            />
            
            <!-- Payment Method Step -->
            <PaymentMethod 
              v-else-if="checkoutState.step === 'payment'" 
              @prev="previousStep"
              @next="nextStep"
            />
            
            <!-- Order Review Step -->
            <OrderReview 
              v-else-if="checkoutState.step === 'review'" 
              @prev="previousStep"
            />
          </div>
        </div>
        
        <!-- Order summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-medium text-secondary mb-6">Souhrn objednávky</h2>
            
            <!-- Cart items summary -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-600 mb-2">Položky ({{ totalItems }})</h3>
              <div class="space-y-3 max-h-48 overflow-auto pr-2">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="flex items-center gap-3 text-sm"
                >
                  <div class="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <img 
                      :src="item.imageUrl || '/images/product-placeholder.jpg'" 
                      :alt="item.name" 
                      class="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div class="flex-grow truncate">
                    <p class="truncate">{{ item.name }}</p>
                  </div>
                  <div class="text-right whitespace-nowrap">
                    <p>{{ item.quantity }} × {{ item.price.toFixed(2) }} Kč</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Price summary -->
            <div class="space-y-3 border-t border-gray-200 pt-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Mezisoučet</span>
                <span class="font-medium">{{ totalPrice.toFixed(2) }} Kč</span>
              </div>
              
              <div class="flex justify-between" v-if="selectedShipping">
                <span class="text-gray-600">Doprava: {{ selectedShipping.name }}</span>
                <span class="font-medium">{{ shippingCost.toFixed(2) }} Kč</span>
              </div>
              
              <div class="flex justify-between" v-if="selectedPayment && paymentSurcharge > 0">
                <span class="text-gray-600">Platba: {{ selectedPayment.name }}</span>
                <span class="font-medium">{{ paymentSurcharge.toFixed(2) }} Kč</span>
              </div>
              
              <div class="border-t border-gray-200 pt-3 flex justify-between">
                <span class="text-lg font-medium text-secondary">Celkem</span>
                <span class="text-lg font-bold text-secondary">{{ orderTotal.toFixed(2) }} Kč</span>
              </div>
            </div>
            
            <!-- Clear cart button -->
            <button 
              @click="clearCartWithConfirmation" 
              class="w-full mt-6 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
