<template>
  <div class="space-y-6">
    <h2 class="text-xl font-medium text-secondary">Souhrn objednávky</h2>
    
    <div class="bg-gray-50 rounded-lg p-6 space-y-6">
      <!-- Customer Information -->
      <div>
        <h3 class="font-medium text-secondary mb-2 flex items-center justify-between">
          <span>Kontaktní informace</span>
          <button 
            @click="goToStep('information')" 
            class="text-sm text-primary hover:text-accent"
          >
            Upravit
          </button>
        </h3>
        <div class="text-gray-700">
          <p>{{ customerInfo.firstName }} {{ customerInfo.lastName }}</p>
          <p>{{ customerInfo.email }}</p>
          <p>{{ customerInfo.phone }}</p>
        </div>
      </div>
      
      <!-- Shipping Address -->
      <div>
        <h3 class="font-medium text-secondary mb-2 flex items-center justify-between">
          <span>Doručovací adresa</span>
          <button 
            @click="goToStep('information')" 
            class="text-sm text-primary hover:text-accent"
          >
            Upravit
          </button>
        </h3>
        <div class="text-gray-700">
          <p>{{ customerInfo.address.street }}</p>
          <p>{{ customerInfo.address.postalCode }} {{ customerInfo.address.city }}</p>
          <p>{{ customerInfo.address.country }}</p>
        </div>
      </div>
      
      <!-- Billing Address -->
      <div v-if="!customerInfo.billingAddressSameAsShipping && customerInfo.billingAddress">
        <h3 class="font-medium text-secondary mb-2 flex items-center justify-between">
          <span>Fakturační adresa</span>
          <button 
            @click="goToStep('information')" 
            class="text-sm text-primary hover:text-accent"
          >
            Upravit
          </button>
        </h3>
        <div class="text-gray-700">
          <p>{{ customerInfo.billingAddress.street }}</p>
          <p>{{ customerInfo.billingAddress.postalCode }} {{ customerInfo.billingAddress.city }}</p>
          <p>{{ customerInfo.billingAddress.country }}</p>
        </div>
      </div>
      
      <!-- Shipping Method -->
      <div>
        <h3 class="font-medium text-secondary mb-2 flex items-center justify-between">
          <span>Způsob dopravy</span>
          <button 
            @click="goToStep('shipping')" 
            class="text-sm text-primary hover:text-accent"
          >
            Upravit
          </button>
        </h3>
        <div class="text-gray-700 flex justify-between">
          <span>{{ selectedShipping?.name }}</span>
          <span>{{ selectedShipping?.price.toFixed(2) }} Kč</span>
        </div>
      </div>
      
      <!-- Payment Method -->
      <div>
        <h3 class="font-medium text-secondary mb-2 flex items-center justify-between">
          <span>Způsob platby</span>
          <button 
            @click="goToStep('payment')" 
            class="text-sm text-primary hover:text-accent"
          >
            Upravit
          </button>
        </h3>
        <div class="text-gray-700 flex justify-between">
          <span>{{ selectedPayment?.name }}</span>
          <span v-if="selectedPayment?.surcharge > 0">{{ selectedPayment?.surcharge.toFixed(2) }} Kč</span>
          <span v-else class="text-green-600">Zdarma</span>
        </div>
      </div>
      
      <!-- Order Notes -->
      <div v-if="checkoutState.orderNotes">
        <h3 class="font-medium text-secondary mb-2">Poznámka k objednávce</h3>
        <p class="text-gray-700">{{ checkoutState.orderNotes }}</p>
      </div>
    </div>
    
    <!-- Order Items -->
    <div>
      <h3 class="font-medium text-secondary mb-4">Položky ({{ totalItems }})</h3>
      
      <div class="space-y-4">
        <div 
          v-for="item in cartItems" 
          :key="item.id" 
          class="flex items-center border-b border-gray-200 pb-4"
        >
          <div class="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 mr-4">
            <img 
              :src="item.imageUrl || '/images/product-placeholder.jpg'" 
              :alt="item.name" 
              class="h-full w-full object-cover object-center"
            />
          </div>
          
          <div class="flex-grow">
            <h4 class="font-medium">{{ item.name }}</h4>
            <p class="text-sm text-gray-600">Množství: {{ item.quantity }}</p>
          </div>
          
          <div class="text-right">
            <p class="font-medium">{{ (item.price * item.quantity).toFixed(2) }} Kč</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Order Summary -->
    <div class="bg-gray-50 rounded-lg p-6">
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">Mezisoučet</span>
          <span>{{ totalPrice.toFixed(2) }} Kč</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Doprava</span>
          <span>{{ shippingCost.toFixed(2) }} Kč</span>
        </div>
        
        <div v-if="paymentSurcharge > 0" class="flex justify-between">
          <span class="text-gray-600">Poplatek za platbu</span>
          <span>{{ paymentSurcharge.toFixed(2) }} Kč</span>
        </div>
        
        <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
          <span>Celkem</span>
          <span class="text-lg">{{ orderTotal.toFixed(2) }} Kč</span>
        </div>
      </div>
    </div>
    
    <div class="flex justify-between mt-8">
      <button 
        @click="$emit('prev')" 
        class="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Zpět
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCheckout } from '~/composables/useCheckout';
import { useCart } from '~/composables/useCart';

const router = useRouter();
const { 
  checkoutState, 
  selectedShipping, 
  selectedPayment,
  shippingCost,
  paymentSurcharge,
  orderTotal,
  submitOrder
} = useCheckout();

const { 
  cartItems, 
  totalItems, 
  totalPrice,
  clearCart
} = useCart();

const customerInfo = computed(() => checkoutState.value.customerInfo);
const isSubmitting = ref(false);

const goToStep = (step) => {
  checkoutState.value.step = step;
};

const placeOrder = async () => {
  isSubmitting.value = true;
  
  try {
    const result = await submitOrder();
    
    if (result.success) {
      // Clear the cart after successful order
      clearCart();
      
      // Redirect to order confirmation page
      router.push({
        path: '/order-confirmation',
        query: { orderId: result.orderId }
      });
    } else {
      // Show error
      alert(result.error || 'Došlo k chybě při zpracování objednávky. Zkuste to prosím znovu.');
    }
  } catch (error) {
    console.error('Order submission error:', error);
    alert('Došlo k chybě při zpracování objednávky. Zkuste to prosím znovu.');
  } finally {
    isSubmitting.value = false;
  }
};

defineEmits(['prev']);
</script>
