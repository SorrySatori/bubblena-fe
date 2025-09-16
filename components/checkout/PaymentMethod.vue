<template>
  <div class="space-y-6">
    <h2 class="text-xl font-medium text-secondary">Způsob platby</h2>
    
    <div class="space-y-4">
      <div 
        v-for="method in paymentMethods" 
        :key="method.id"
        class="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
        :class="{ 'border-primary bg-primary bg-opacity-5': selectedPaymentMethod === method.id }"
        @click="selectPaymentMethod(method.id)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 mr-4">
            <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center"
                :class="selectedPaymentMethod === method.id ? 'border-primary' : 'border-gray-300'"
            >
              <div v-if="selectedPaymentMethod === method.id" class="h-3 w-3 rounded-full bg-primary"></div>
            </div>
          </div>
          
          <div class="flex-grow">
            <div class="flex justify-between">
              <h3 class="font-medium">{{ method.name }}</h3>
              <span v-if="method.surcharge > 0" class="font-medium">+{{ method.surcharge.toFixed(2) }} Kč</span>
              <span v-else class="font-medium text-green-600">Zdarma</span>
            </div>
            <p class="text-sm text-gray-600">{{ method.description }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-8">
      <h3 class="text-lg font-medium text-secondary mb-2">Poznámka k objednávce</h3>
      <textarea 
        v-model="orderNotes" 
        rows="3" 
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        placeholder="Máte nějaké speciální požadavky nebo poznámky k objednávce?"
      ></textarea>
    </div>
    
    <div class="flex justify-between mt-8">
      <button 
        @click="$emit('prev')" 
        class="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Zpět
      </button>
      
      <button 
        @click="$emit('next')" 
        class="bg-primary text-white py-2 px-6 rounded-lg hover:bg-accent transition-colors"
        :disabled="!selectedPaymentMethod"
      >
        Pokračovat k souhrnu
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCheckout } from '~/composables/useCheckout';

const { checkoutState, paymentMethods } = useCheckout();

const selectedPaymentMethod = computed({
  get: () => checkoutState.value.selectedPaymentMethod,
  set: (value) => { checkoutState.value.selectedPaymentMethod = value; }
});

const orderNotes = computed({
  get: () => checkoutState.value.orderNotes,
  set: (value) => { checkoutState.value.orderNotes = value; }
});

const selectPaymentMethod = (methodId) => {
  selectedPaymentMethod.value = methodId;
};

defineEmits(['prev', 'next']);
</script>
