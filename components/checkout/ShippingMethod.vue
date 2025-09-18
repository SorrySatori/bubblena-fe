<template>
  <div class="space-y-6">
    <h2 class="text-xl font-medium text-secondary">Způsob dopravy</h2>
    
    <div class="space-y-4">
      <div 
        v-for="method in shippingMethods" 
        :key="method.id"
        class="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
        :class="{ 'border-primary bg-primary bg-opacity-5': selectedShippingMethod === method.id }"
        @click="selectShippingMethod(method.id)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 mr-4">
            <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center"
                :class="selectedShippingMethod === method.id ? 'border-primary' : 'border-gray-300'"
            >
              <div v-if="selectedShippingMethod === method.id" class="h-3 w-3 rounded-full bg-primary"></div>
            </div>
          </div>
          
          <div class="flex-grow">
            <div class="flex justify-between">
              <h3 class="font-medium">{{ method.name }}</h3>
              <span class="font-medium">{{ method.price.toFixed(2) }} Kč</span>
            </div>
            <p class="text-sm text-gray-600">{{ method.description }}</p>
            <p class="text-xs text-gray-500 mt-1">Doručení: {{ method.estimatedDelivery }}</p>
          </div>
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
import { computed } from 'vue';
import { useCheckout } from '~/composables/useCheckout';

const { checkoutState, shippingMethods } = useCheckout();

const selectedShippingMethod = computed({
  get: () => checkoutState.value.selectedShippingMethod,
  set: (value) => { checkoutState.value.selectedShippingMethod = value; }
});

const selectShippingMethod = (methodId) => {
  selectedShippingMethod.value = methodId;
};

defineEmits(['prev', 'next']);
</script>
