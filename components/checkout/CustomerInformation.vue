<template>
  <div class="space-y-6">
    <h2 class="text-xl font-medium text-secondary">Kontaktní informace</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Jméno</label>
        <input 
          id="firstName" 
          v-model="customerInfo.firstName" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>
      
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Příjmení</label>
        <input 
          id="lastName" 
          v-model="customerInfo.lastName" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          id="email" 
          v-model="customerInfo.email" 
          type="email" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>
      
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
        <input 
          id="phone" 
          v-model="customerInfo.phone" 
          type="tel" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>
    </div>
    
    <h2 class="text-xl font-medium text-secondary mt-8">Doručovací adresa</h2>
    
    <div class="space-y-4">
      <div>
        <label for="street" class="block text-sm font-medium text-gray-700 mb-1">Ulice a číslo</label>
        <input 
          id="street" 
          v-model="customerInfo.address.street" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Město</label>
          <input 
            id="city" 
            v-model="customerInfo.address.city" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div>
          <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">PSČ</label>
          <input 
            id="postalCode" 
            v-model="customerInfo.address.postalCode" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>
      </div>
      
      <div>
        <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Země</label>
        <select 
          id="country" 
          v-model="customerInfo.address.country" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="Česká republika">Česká republika</option>
          <option value="Slovensko">Slovensko</option>
        </select>
      </div>
    </div>
    
    <div class="mt-6">
      <div class="flex items-center">
        <input 
          id="billingAddressSame" 
          v-model="customerInfo.billingAddressSameAsShipping" 
          type="checkbox" 
          class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label for="billingAddressSame" class="ml-2 block text-sm text-gray-700">
          Fakturační adresa je stejná jako doručovací
        </label>
      </div>
    </div>
    
    <div v-if="!customerInfo.billingAddressSameAsShipping" class="mt-6 space-y-4">
      <h2 class="text-xl font-medium text-secondary">Fakturační adresa</h2>
      
      <div>
        <label for="billingStreet" class="block text-sm font-medium text-gray-700 mb-1">Ulice a číslo</label>
        <input 
          id="billingStreet" 
          v-model="billingAddress.street" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="billingCity" class="block text-sm font-medium text-gray-700 mb-1">Město</label>
          <input 
            id="billingCity" 
            v-model="billingAddress.city" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div>
          <label for="billingPostalCode" class="block text-sm font-medium text-gray-700 mb-1">PSČ</label>
          <input 
            id="billingPostalCode" 
            v-model="billingAddress.postalCode" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>
      </div>
      
      <div>
        <label for="billingCountry" class="block text-sm font-medium text-gray-700 mb-1">Země</label>
        <select 
          id="billingCountry" 
          v-model="billingAddress.country" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="Česká republika">Česká republika</option>
          <option value="Slovensko">Slovensko</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, reactive } from 'vue';
import { useCheckout } from '~/composables/useCheckout';

const { checkoutState } = useCheckout();
const customerInfo = computed(() => checkoutState.value.customerInfo);

// Create a reactive billing address that syncs with the checkout state
const billingAddress = reactive({
  street: '',
  city: '',
  postalCode: '',
  country: 'Česká republika'
});

// Initialize billing address if it exists
if (customerInfo.value.billingAddress) {
  billingAddress.street = customerInfo.value.billingAddress.street;
  billingAddress.city = customerInfo.value.billingAddress.city;
  billingAddress.postalCode = customerInfo.value.billingAddress.postalCode;
  billingAddress.country = customerInfo.value.billingAddress.country;
}

// Watch for changes in billing address and update checkout state
watch(billingAddress, (newValue) => {
  if (!customerInfo.value.billingAddressSameAsShipping) {
    customerInfo.value.billingAddress = { ...newValue };
  }
}, { deep: true });

// Watch for changes in billingAddressSameAsShipping
watch(() => customerInfo.value.billingAddressSameAsShipping, (isSame) => {
  if (isSame) {
    customerInfo.value.billingAddress = undefined;
  } else {
    customerInfo.value.billingAddress = { ...billingAddress };
  }
});

// Validate form
const isFormValid = computed(() => {
  const info = customerInfo.value;
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
  if (!info.billingAddressSameAsShipping) {
    const billingFields = [
      billingAddress.street,
      billingAddress.city,
      billingAddress.postalCode
    ];
    return mainFieldsValid && billingFields.every(field => field && field.trim() !== '');
  }
  
  return mainFieldsValid;
});

defineEmits(['next']);
</script>
