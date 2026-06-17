<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="flex justify-center mb-6">
          <div class="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 class="text-2xl font-bold text-secondary mb-4">Děkujeme za Vaši objednávku!</h1>
        <p class="text-gray-600 mb-6">Vaše objednávka byla úspěšně přijata a bude zpracována co nejdříve.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-gray-700">Číslo objednávky: <span class="font-medium">{{ orderId }}</span></p>
        </div>

        <div v-if="isBankTransfer" class="mb-8 rounded-lg border border-primary/30 bg-primary/5 p-6 text-left">
          <h2 class="text-xl font-semibold text-secondary mb-3">Platební údaje pro bankovní převod</h2>
          <p class="text-gray-700 mb-4">
            Objednávku prosím uhraďte převodem na níže uvedený účet. Do zprávy pro příjemce uveďte číslo objednávky.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">Příjemce</p>
                <p class="font-medium text-secondary">{{ bankPayment.recipient }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Číslo účtu</p>
                <p class="font-medium text-secondary">{{ formattedBankAccount || 'Není nastaveno' }}</p>
              </div>
              <div v-if="bankPayment.iban">
                <p class="text-sm text-gray-500">IBAN</p>
                <p class="font-medium text-secondary break-all">{{ bankPayment.iban }}</p>
              </div>
              <div v-if="bankPayment.bic">
                <p class="text-sm text-gray-500">BIC/SWIFT</p>
                <p class="font-medium text-secondary">{{ bankPayment.bic }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Částka</p>
                <p class="font-medium text-secondary">{{ formatPrice(bankPayment.amount) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Zpráva pro příjemce</p>
                <p class="font-medium text-secondary">{{ bankPayment.message }}</p>
              </div>
            </div>

            <div class="flex flex-col items-center justify-center rounded-lg bg-white p-4">
              <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR kód pro bankovní převod" class="h-48 w-48" />
              <p class="mt-3 text-sm text-gray-600 text-center">Naskenujte QR kód v bankovní aplikaci.</p>
            </div>
          </div>
        </div>
        
        <p class="text-gray-600 mb-8">
          Potvrzení objednávky bylo odesláno na Váš email. Budeme Vás informovat o stavu Vaší objednávky.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/" class="bg-primary text-white py-3 px-6 rounded-lg hover:bg-accent transition-colors">
            Zpět na úvodní stránku
          </NuxtLink>
          
          <NuxtLink to="/bath-bombs" class="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
            Pokračovat v nákupu
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({ title: 'Potvrzení objednávky', robots: 'noindex, follow' });

import QRCode from 'qrcode';
import { useRoute } from 'vue-router';
import { useCart } from '~/composables/useCart';

const route = useRoute();
const orderId = computed(() => route.query.orderId || 'N/A');
const { clearCart } = useCart();
const config = useRuntimeConfig();

const getQueryValue = (value) => Array.isArray(value) ? value[0] : value;
const parseAmount = (amount) => {
  const parsed = Number(getQueryValue(amount));
  return Number.isFinite(parsed) ? parsed : 0;
};

const fetchedOrder = ref(null);
const qrCodeDataUrl = ref('');
const bankPayment = ref({
  recipient: config.public.bankRecipient || 'Bubblena.cz',
  accountNumber: config.public.bankAccountNumber || '',
  bankCode: config.public.bankCode || '',
  iban: config.public.bankIban || '',
  bic: config.public.bankBic || '',
  amount: parseAmount(route.query.amount),
  currency: 'CZK',    "qrcode": "^1.5.4",

  paymentReference: getQueryValue(route.query.orderId) || '',
  message: `Objednávka ${getQueryValue(route.query.orderId) || ''}`.trim()
});

const isBankTransfer = computed(() => {
  return route.query.paymentMethod === 'bank-transfer' || fetchedOrder.value?.paymentMethod === 'bank-transfer';
});

const formattedBankAccount = computed(() => {
  if (!bankPayment.value.accountNumber) return '';
  return bankPayment.value.bankCode
    ? `${bankPayment.value.accountNumber}/${bankPayment.value.bankCode}`
    : bankPayment.value.accountNumber;
});

const formatPrice = (price) => `${Number(price || 0).toFixed(2)} Kč`;

const sanitizeQrText = (value) => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\*/g, ' ')
    .trim()
    .slice(0, 60);
};

const buildQrPaymentString = () => {
  if (!bankPayment.value.iban || !bankPayment.value.amount) return '';

  const fields = [
    'SPD',
    '1.0',
    `ACC:${bankPayment.value.iban.replace(/\s/g, '')}`,
    `AM:${Number(bankPayment.value.amount).toFixed(2)}`,
    `CC:${bankPayment.value.currency || 'CZK'}`,
    `MSG:${sanitizeQrText(bankPayment.value.message)}`
  ];

  if (/^\d{1,10}$/.test(bankPayment.value.paymentReference)) {
    fields.push(`X-VS:${bankPayment.value.paymentReference}`);
  }

  return fields.join('*');
};

const generateQrCode = async () => {
  const qrPaymentString = buildQrPaymentString();
  qrCodeDataUrl.value = qrPaymentString
    ? await QRCode.toDataURL(qrPaymentString, { width: 256, margin: 1 })
    : '';
};

const updateBankPayment = (order) => {
  if (order?.bankTransferPayment) {
    bankPayment.value = {
      ...bankPayment.value,
      ...order.bankTransferPayment
    };
    return;
  }

  if (order?.totals?.total) {
    bankPayment.value.amount = order.totals.total;
  }
};

const confirmationSent = useState(`order-confirmed-${route.query.orderId}`, () => false);

onMounted(async () => {
  await generateQrCode();

  if (confirmationSent.value || !route.query.orderId) return;
  confirmationSent.value = true;

  try {
    // Fetch full order data from backend
    const orderData = await $fetch(`/api/order/${route.query.orderId}`);
    console.log('Order data fetched:', orderData);

    // The backend returns { success: true, order: {...} }
    const order = orderData?.order || orderData;
    fetchedOrder.value = order;
    updateBankPayment(order);
    await generateQrCode();

    if (order?.orderId || order?.customerInfo) {
      // Send confirmation email + Fakturoid invoice
      await $fetch('/api/order-confirmation', {
        method: 'POST',
        body: order
      });
      console.log('Confirmation email sent');
    } else {
      console.error('Order data missing or invalid:', orderData);
    }
  } catch (err) {
    console.error('Failed to send order confirmation:', err);
  }

  clearCart();
});
</script>
