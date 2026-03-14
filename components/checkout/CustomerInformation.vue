<template>
  <div class="space-y-6">
    <div v-if="showValidationSummary && errorMessages.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-start">
        <svg class="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800 mb-2">Opravte prosím následující chyby:</h3>
          <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
            <li v-for="(message, index) in errorMessages" :key="index">{{ message }}</li>
          </ul>
        </div>
        <button @click="showValidationSummary = false" class="ml-3 flex-shrink-0 text-red-600 hover:text-red-800">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <h2 class="text-xl font-medium text-secondary">Kontaktní informace</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Jméno *</label>
        <input 
          id="firstName" 
          v-model="customerInfo.firstName" 
          type="text" 
          :class="[
            'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary',
            touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'
          ]"
          @blur="handleBlur('firstName')"
          @input="handleTextInput('firstName')"
          required
        />
        <p v-if="touched.firstName && errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
      </div>
      
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Příjmení *</label>
        <input 
          id="lastName" 
          v-model="customerInfo.lastName" 
          type="text" 
          :class="[
            'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary',
            touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'
          ]"
          @blur="handleBlur('lastName')"
          @input="handleTextInput('lastName')"
          required
        />
        <p v-if="touched.lastName && errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input 
          id="email" 
          v-model="customerInfo.email" 
          type="email" 
          :class="[
            'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary',
            touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
          ]"
          @blur="handleBlur('email')"
          @input="handleInput('email')"
          placeholder="priklad@email.cz"
          required
        />
        <p v-if="touched.email && errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
      </div>
      
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
        <input 
          id="phone" 
          v-model="customerInfo.phone" 
          type="tel" 
          :class="[
            'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary',
            touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
          ]"
          @blur="handleBlur('phone')"
          @input="handlePhoneInput('phone')"
          placeholder="777 123 456"
          required
        />
        <p v-if="touched.phone && errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
      </div>
    </div>
    
    <h2 class="text-xl font-medium text-secondary mt-8">Doručovací adresa</h2>
    
    <div class="space-y-4">
      <div>
        <label for="street" class="block text-sm font-medium text-gray-700 mb-1">Ulice a číslo *</label>
        <input 
          id="street" 
          v-model="customerInfo.address.street" 
          type="text" 
          :class="[
            'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary smartform-instance-shipping smartform-address-street-and-number',
            touched.street && errors.street ? 'border-red-500' : 'border-gray-300'
          ]"
          @blur="handleBlur('street')"
          @input="handleAddressInput('street')"
          placeholder="Hlavní 123"
          required
        />
        <p v-if="touched.street && errors.street" class="mt-1 text-sm text-red-600">{{ errors.street }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Město *</label>
          <input 
            id="city" 
            v-model="customerInfo.address.city" 
            type="text" 
            :class="[
              'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary smartform-instance-shipping smartform-address-city',
              touched.city && errors.city ? 'border-red-500' : 'border-gray-300'
            ]"
            @blur="handleBlur('city')"
            @input="handleTextInput('city')"
            placeholder="Praha"
            required
          />
          <p v-if="touched.city && errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
        </div>
        
        <div>
          <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">PSČ *</label>
          <input 
            id="postalCode" 
            v-model="customerInfo.address.postalCode" 
            type="text" 
            :class="[
              'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary smartform-instance-shipping smartform-address-zip',
              touched.postalCode && errors.postalCode ? 'border-red-500' : 'border-gray-300'
            ]"
            @blur="handleBlur('postalCode')"
            @input="handlePostalCodeInput('postalCode')"
            placeholder="110 00"
            required
          />
          <p v-if="touched.postalCode && errors.postalCode" class="mt-1 text-sm text-red-600">{{ errors.postalCode }}</p>
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
        <label for="billingStreet" class="block text-sm font-medium text-gray-700 mb-1">Ulice a číslo *</label>
        <input 
          id="billingStreet" 
          v-model="billingAddress.street" 
          type="text" 
          :class="[
            'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary smartform-instance-billing smartform-address-street-and-number',
            touched.billingStreet && errors.billingStreet ? 'border-red-500' : 'border-gray-300'
          ]"
          @blur="handleBlur('billingStreet')"
          @input="handleAddressInput('billingStreet')"
          placeholder="Hlavní 123"
          required
        />
        <p v-if="touched.billingStreet && errors.billingStreet" class="mt-1 text-sm text-red-600">{{ errors.billingStreet }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="billingCity" class="block text-sm font-medium text-gray-700 mb-1">Město *</label>
          <input 
            id="billingCity" 
            v-model="billingAddress.city" 
            type="text" 
            :class="[
              'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary smartform-instance-billing smartform-address-city',
              touched.billingCity && errors.billingCity ? 'border-red-500' : 'border-gray-300'
            ]"
            @blur="handleBlur('billingCity')"
            @input="handleTextInput('billingCity')"
            placeholder="Praha"
            required
          />
          <p v-if="touched.billingCity && errors.billingCity" class="mt-1 text-sm text-red-600">{{ errors.billingCity }}</p>
        </div>
        
        <div>
          <label for="billingPostalCode" class="block text-sm font-medium text-gray-700 mb-1">PSČ *</label>
          <input 
            id="billingPostalCode" 
            v-model="billingAddress.postalCode" 
            type="text" 
            :class="[
              'w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary smartform-instance-billing smartform-address-zip',
              touched.billingPostalCode && errors.billingPostalCode ? 'border-red-500' : 'border-gray-300'
            ]"
            @blur="handleBlur('billingPostalCode')"
            @input="handleBillingPostalCodeInput('billingPostalCode')"
            placeholder="110 00"
            required
          />
          <p v-if="touched.billingPostalCode && errors.billingPostalCode" class="mt-1 text-sm text-red-600">{{ errors.billingPostalCode }}</p>
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
import { computed, watch, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { useCheckout } from '~/composables/useCheckout';
import { useFormValidation } from '~/composables/useFormValidation';

const { checkoutState } = useCheckout();
const customerInfo = computed(() => checkoutState.value.customerInfo);

const billingAddress = reactive({
  street: '',
  city: '',
  postalCode: '',
  country: 'Česká republika'
});

if (customerInfo.value.billingAddress) {
  billingAddress.street = customerInfo.value.billingAddress.street;
  billingAddress.city = customerInfo.value.billingAddress.city;
  billingAddress.postalCode = customerInfo.value.billingAddress.postalCode;
  billingAddress.country = customerInfo.value.billingAddress.country;
}

const {
  errors,
  touched,
  showValidationSummary,
  errorMessages,
  handlePhoneInput,
  handlePostalCodeInput,
  handleBillingPostalCodeInput,
  handleTextInput,
  handleAddressInput,
  handleBlur,
  validateAllFields,
  clearBillingErrors
} = useFormValidation(customerInfo, billingAddress);

watch(billingAddress, (newValue) => {
  if (!customerInfo.value.billingAddressSameAsShipping) {
    customerInfo.value.billingAddress = { ...newValue };
  }
}, { deep: true });

watch(() => customerInfo.value.billingAddressSameAsShipping, (isSame) => {
  if (isSame) {
    customerInfo.value.billingAddress = undefined;
    clearBillingErrors();
  } else {
    customerInfo.value.billingAddress = { ...billingAddress };
    nextTick(() => {
      const sf = window.smartform;
      if (sf) {
        sf.rebindAllForms();
      }
    });
  }
});

const syncSmartformValues = () => {
  const streetEl = document.getElementById('street');
  const cityEl = document.getElementById('city');
  const postalCodeEl = document.getElementById('postalCode');
  if (streetEl && streetEl.value !== customerInfo.value.address.street) {
    customerInfo.value.address.street = streetEl.value;
    handleBlur('street');
  }
  if (cityEl && cityEl.value !== customerInfo.value.address.city) {
    customerInfo.value.address.city = cityEl.value;
    handleBlur('city');
  }
  if (postalCodeEl && postalCodeEl.value !== customerInfo.value.address.postalCode) {
    customerInfo.value.address.postalCode = postalCodeEl.value;
    handleBlur('postalCode');
  }

  if (!customerInfo.value.billingAddressSameAsShipping) {
    const bStreetEl = document.getElementById('billingStreet');
    const bCityEl = document.getElementById('billingCity');
    const bPostalCodeEl = document.getElementById('billingPostalCode');
    if (bStreetEl && bStreetEl.value !== billingAddress.street) {
      billingAddress.street = bStreetEl.value;
      handleBlur('billingStreet');
    }
    if (bCityEl && bCityEl.value !== billingAddress.city) {
      billingAddress.city = bCityEl.value;
      handleBlur('billingCity');
    }
    if (bPostalCodeEl && bPostalCodeEl.value !== billingAddress.postalCode) {
      billingAddress.postalCode = bPostalCodeEl.value;
      handleBlur('billingPostalCode');
    }
  }
};

const initSmartform = () => {
  const sf = window.smartform;
  if (!sf) return;

  sf.rebindAllForms();

  const setupCallback = (instanceName) => {
    try {
      const instance = sf.getInstance(instanceName);
      if (instance?.addressControl) {
        instance.addressControl.addValidationCallback(() => {
          nextTick(syncSmartformValues);
        });
      }
    } catch (_) {}
  };

  setupCallback('shipping');
  setupCallback('billing');
};

onMounted(() => {
  const waitForSmartform = () => {
    if (window.smartform) {
      initSmartform();
    } else {
      setTimeout(waitForSmartform, 200);
    }
  };
  waitForSmartform();

  const addressFields = ['street', 'city', 'postalCode', 'billingStreet', 'billingCity', 'billingPostalCode'];
  addressFields.forEach(id => {
    document.getElementById(id)?.addEventListener('change', syncSmartformValues);
  });
});

onUnmounted(() => {
  const addressFields = ['street', 'city', 'postalCode', 'billingStreet', 'billingCity', 'billingPostalCode'];
  addressFields.forEach(id => {
    document.getElementById(id)?.removeEventListener('change', syncSmartformValues);
  });
});

defineEmits(['next']);

const wrappedValidateAllFields = () => {
  syncSmartformValues();
  return validateAllFields();
};

defineExpose({
  validateAllFields: wrappedValidateAllFields
});
</script>
