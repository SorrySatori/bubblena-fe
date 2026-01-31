
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
const customerInformationRef = ref(null);

// Redirect to products if cart is empty
onMounted(() => {
  if (isEmpty.value) {
    router.push('/bath-bombs');
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

// No clear cart function needed

// Go to specific checkout step
const goToStep = (step) => {
  checkoutState.value.step = step;
};

const handleNextStep = () => {
  if (checkoutState.value.step === 'information') {
    if (customerInformationRef.value) {
      const isValid = customerInformationRef.value.validateAllFields();
      
      if (!isValid) {
        toastMessage.value = 'Prosím vyplňte všechna povinná pole správně';
        toastType.value = 'error';
        showToast.value = true;
        
        setTimeout(() => {
          showToast.value = false;
        }, 4000);
        
        return;
      }
    }
  }
  
  nextStep();
};

// Validate customer information
const isCustomerInfoValid = computed(() => {
  const info = checkoutState.value.customerInfo;
  const requiredFields = [
    info.firstName,
    info.lastName,
    info.email,
    info.phone,
    info.address.street,
    info.address.city,
    info.address.postalCode
  ];
  
  // Check if all required fields are filled
  const mainFieldsValid = requiredFields.every(field => field && field.trim() !== '');
  
  // Check billing address fields if separate billing address is selected
  if (!info.billingAddressSameAsShipping && info.billingAddress) {
    const billingFields = [
      info.billingAddress.street,
      info.billingAddress.city,
      info.billingAddress.postalCode
    ];
    return mainFieldsValid && billingFields.every(field => field && field.trim() !== '');
  }
  
  return mainFieldsValid;
});

// Submit order function
const submitOrder = async () => {
  try {
    // Show loading toast
    toastMessage.value = 'Odesílání objednávky...';
    toastType.value = 'info';
    showToast.value = true;
    
    // Submit order using the checkout composable
    const result = await useCheckout().submitOrder();
    
    if (result?.success) {
      // Show success toast
      toastMessage.value = 'Objednávka byla úspěšně odeslána!';
      toastType.value = 'success';
      showToast.value = true;
      
      // Redirect to order confirmation page
      setTimeout(() => {
        router.push({
          path: '/order-confirmation',
          query: { orderId: result.orderId }
        });
      }, 1500);
    } else {
      // Show error toast
      toastMessage.value = result.error || 'Došlo k chybě při zpracování objednávky. Zkuste to prosím znovu.';
      toastType.value = 'error';
      showToast.value = true;
    }
  } catch (error) {
    console.error('Order submission error:', error);
    
    // Show error toast
    toastMessage.value = 'Došlo k chybě při zpracování objednávky. Zkuste to prosím znovu.';
    toastType.value = 'error';
    showToast.value = true;
  }
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
        <NuxtLink to="/bath-bombs" class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors">
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
              ref="customerInformationRef"
              @next="handleNextStep"
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
                    <p>{{ item.quantity }} × {{ item.price?.toFixed(2) }} Kč</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Price summary -->
            <div class="space-y-3 border-t border-gray-200 pt-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Mezisoučet</span>
                <span class="font-medium">{{ totalPrice?.toFixed(2) }} Kč</span>
              </div>
              
              <div class="flex justify-between" v-if="selectedShipping">
                <span class="text-gray-600">Doprava: {{ selectedShipping.name }}</span>
                <span class="font-medium">{{ shippingCost?.toFixed(2) }} Kč</span>
              </div>
              
              <div class="flex justify-between" v-if="selectedPayment && paymentSurcharge > 0">
                <span class="text-gray-600">Platba: {{ selectedPayment.name }}</span>
                <span class="font-medium">{{ paymentSurcharge?.toFixed(2) }} Kč</span>
              </div>
              
              <div class="border-t border-gray-200 pt-3 flex justify-between">
                <span class="text-lg font-medium text-secondary">Celkem</span>
                <span class="text-lg font-bold text-secondary">{{ orderTotal?.toFixed(2) }} Kč</span>
              </div>
            </div>
            
            <!-- Continue to next step buttons -->
            <!-- Information step button -->
            <button 
              v-if="checkoutState.step === 'information'" 
              @click="handleNextStep" 
              class="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Pokračovat k dopravě
            </button>
            
            <!-- Shipping step button -->
            <button 
              v-else-if="checkoutState.step === 'shipping'" 
              @click="nextStep" 
              class="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
              :disabled="!checkoutState.selectedShippingMethod"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Pokračovat k platbě
            </button>
            
            <!-- Payment step button -->
            <button 
              v-else-if="checkoutState.step === 'payment'" 
              @click="nextStep" 
              class="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
              :disabled="!checkoutState.selectedPaymentMethod"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Pokračovat k souhrnu
            </button>
            
            <!-- Review step button -->
            <button 
              v-else-if="checkoutState.step === 'review'" 
              @click="submitOrder" 
              class="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Dokončit objednávku
            </button>
            
            <!-- No clear cart button -->
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
