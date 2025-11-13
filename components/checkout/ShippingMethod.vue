<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCheckout } from '~/composables/useCheckout';

const { checkoutState, shippingMethods, setSelectedPickupPoint } = useCheckout();

const selectedShippingMethod = computed({
  get: () => checkoutState.value.selectedShippingMethod,
  set: (value) => { checkoutState.value.selectedShippingMethod = value; }
});

const selectedPickupPoint = ref(null);
const isPacketaLoaded = ref(false);
const packetaApiKey = process.env.NUXT_PACKETA_API_KEY

const selectShippingMethod = (methodId) => {
  selectedShippingMethod.value = methodId;
};

const handlePacketaCallback = (point) => {
  if (point) {
    selectedPickupPoint.value = point;
    setSelectedPickupPoint(point);
  }
};

const openPacketaWidget = () => {

  try {
    window.packetaCallback = handlePacketaCallback;

    if (window.Packeta && window.Packeta.Widget) {
      window.Packeta.Widget.pick(packetaApiKey, window.packetaCallback);
    } else {
      alert('Packeta widget není k dispozici. Zkuste obnovit stránku.');
    }
  } catch (error) {
    alert('Nastala chyba při otevírání widgetu Zásilkovny.');
  }
};

onMounted(() => {
  console.log('Component mounted, setting up Packeta widget');

  const script = document.createElement('script');
  script.src = 'https://widget.packeta.com/v6/www/js/library.js';
  script.async = true;
  script.onload = () => {
    isPacketaLoaded.value = true;

    if (window.Packeta && window.Packeta.Widget) {
    } else {
      console.error('Script loaded but Packeta.Widget is not available');
    }
  };
  script.onerror = (error) => {
    console.error('Failed to load Packeta widget script:', error);
    alert('Nepodařilo se načíst widget Zásilkovny. Zkuste obnovit stránku.');
  };

  document.head.appendChild(script);
});

</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-medium text-secondary">Způsob dopravy</h2>

    <div class="space-y-4">
      <div v-if="selectedShippingMethod === 'zasilkovna'" class="mb-4">
        <button id="zasilkovna-button" @click="openPacketaWidget"
          class="mt-2 mb-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          :disabled="!isPacketaLoaded">
          Vybrat výdejní místo
        </button>
        <div v-if="!isPacketaLoaded" class="text-xs text-gray-500">Načítání widgetu Zásilkovny...</div>
        <div v-if="selectedPickupPoint" class="mt-2 p-3 border border-primary rounded-lg bg-primary bg-opacity-5">
          <p class="font-medium">Vybrané výdejní místo:</p>
          <p>{{ selectedPickupPoint.name }}</p>
          <p class="text-sm text-gray-600">{{ selectedPickupPoint.city }}, {{ selectedPickupPoint.street }}</p>
        </div>
        <div id="zasilkovna-branch"></div>
      </div>
      <div v-for="method in shippingMethods" :key="method.id"
        class="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
        :class="{ 'border-primary bg-primary bg-opacity-5': selectedShippingMethod === method.id }"
        @click="selectShippingMethod(method.id)">
        <div class="flex items-center">
          <div class="flex-shrink-0 mr-4">
            <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center"
              :class="selectedShippingMethod === method.id ? 'border-primary' : 'border-gray-300'">
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
      <button @click="$emit('prev')"
        class="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors">
        Zpět
      </button>
    </div>
  </div>
</template>
