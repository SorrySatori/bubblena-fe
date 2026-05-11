import { ref, computed } from 'vue'
import { useState } from '#app'
import { useCart } from './useCart'
import { navigateTo } from 'nuxt/app'
import { v4 as uuidv4 } from "uuid"

// Define shipping method interface
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

// Define payment method interface
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  surcharge: number;
}

export interface AppliedDiscount {
  code: string;
  type: 'global' | 'individual';
  percentage: number;
  freeShipping: boolean;
}

export interface BankTransferPayment {
  recipient: string;
  accountNumber: string;
  bankCode: string;
  iban: string;
  bic: string;
  amount: number;
  currency: 'CZK';
  paymentReference: string;
  message: string;
}

// Define customer information interface
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddressSameAsShipping: boolean;
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

// Define checkout state interface
export interface CheckoutState {
  step: 'information' | 'shipping' | 'payment' | 'review';
  customerInfo: CustomerInfo;
  selectedShippingMethod: string | null;
  selectedPickupPoint: any | null;
  selectedPaymentMethod: string | null;
  discountCode: string;
  appliedDiscount: AppliedDiscount | null;
  orderNotes: string;
}

// Create a composable for checkout functionality
export const useCheckout = () => {
  const { cartItems, totalPrice, cartSessionId, clearCart } = useCart();

  const createBankTransferPayment = (orderId: string): BankTransferPayment => {
    const config = useRuntimeConfig();

    return {
      recipient: config.public.bankRecipient || 'Bubblena.cz',
      accountNumber: config.public.bankAccountNumber || '',
      bankCode: config.public.bankCode || '',
      iban: config.public.bankIban || '',
      bic: config.public.bankBic || '',
      amount: orderTotal.value,
      currency: 'CZK',
      paymentReference: orderId,
      message: `Objednávka ${orderId}`
    };
  };

  const getDeliveryEndpoint = (shippingMethod: string | null): string | null => {
    switch (shippingMethod) {
      case 'zasilkovna': return '/api/delivery/packeta'
      case 'gls': return '/api/delivery/gls'
      default: return null
    }
  }

  // Available shipping methods
  const shippingMethods = ref<ShippingMethod[]>([
    {
      id: 'zasilkovna',
      name: 'Zásilkovna',
      description: 'Doručení pomocí společnosti Zásilkovna',
      price: 99,
      estimatedDelivery: '2-3 pracovní dny'
    },
    {
      id: 'gls',
      name: 'GLS',
      description: 'Doručení pomocí společnosti GLS',
      price: 99,
      estimatedDelivery: '2-3 pracovní dny'
    }
  ]);
  
  // Available payment methods
  const paymentMethods = ref<PaymentMethod[]>([
    {
      id: 'card',
      name: 'Platební karta',
      description: 'Visa, Mastercard, American Express',
      icon: 'credit-card',
      surcharge: 0
    },
    {
      id: 'bank-transfer',
      name: 'Bankovní převod',
      description: 'Platba předem na účet',
      icon: 'bank',
      surcharge: 0
    },
  ]);
  
  // Initialize checkout state
  const checkoutState = useState<CheckoutState>('checkout-state', () => ({
    step: 'information',
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'Česká republika'
      },
      billingAddressSameAsShipping: true,
      billingAddress: undefined
    },
    selectedShippingMethod: null,
    selectedPaymentMethod: 'card',
    selectedPickupPoint: '',
    discountCode: '',
    appliedDiscount: null,
    orderNotes: ''
  }));
  
  // Get selected shipping method
  const selectedShipping = computed(() => {
    return shippingMethods.value.find(method => method.id === checkoutState.value.selectedShippingMethod) || null;
  });
  
  // Get selected payment method
  const selectedPayment = computed(() => {
    return paymentMethods.value.find(method => method.id === checkoutState.value.selectedPaymentMethod) || null;
  });
  
  // Calculate shipping cost
  const shippingCost = computed(() => {
    return selectedShipping.value ? selectedShipping.value.price : 0;
  });
  
  // Calculate payment surcharge
  const paymentSurcharge = computed(() => {
    return selectedPayment.value ? selectedPayment.value.surcharge : 0;
  });

  const percentageDiscount = computed(() => {
    const discount = checkoutState.value.appliedDiscount;
    if (!discount?.percentage) return 0;

    return Math.round(totalPrice.value * (discount.percentage / 100) * 100) / 100;
  });

  const shippingDiscount = computed(() => {
    const discount = checkoutState.value.appliedDiscount;
    if (!discount?.freeShipping) return 0;

    return shippingCost.value;
  });

  const totalDiscount = computed(() => {
    return percentageDiscount.value + shippingDiscount.value;
  });
  
  // Calculate total order cost
  const orderTotal = computed(() => {
    return Math.max(0, totalPrice.value + shippingCost.value + paymentSurcharge.value - totalDiscount.value);
  });

  const applyDiscountCode = async () => {
    const code = checkoutState.value.discountCode.trim().toUpperCase();
    if (!code) {
      return { success: false, error: 'Zadejte slevový kód.' };
    }

    try {
      const response: any = await $fetch('/api/discount-codes/validate', {
        method: 'POST',
        body: {
          code,
          subtotal: totalPrice.value,
          shipping: shippingCost.value,
        }
      });

      checkoutState.value.discountCode = code;
      checkoutState.value.appliedDiscount = {
        code: response.discount.code,
        type: response.discount.type,
        percentage: response.discount.percentage,
        freeShipping: response.discount.freeShipping,
      };

      return { success: true };
    } catch (error: any) {
      checkoutState.value.appliedDiscount = null;
      return {
        success: false,
        error: error?.data?.message || 'Slevový kód není platný nebo již vypršel.'
      };
    }
  };

  const removeDiscountCode = () => {
    checkoutState.value.discountCode = '';
    checkoutState.value.appliedDiscount = null;
  };
  
  // Go to next checkout step
  const nextStep = () => {
    const steps: CheckoutState['step'][] = ['information', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(checkoutState.value.step);
    
    if (currentIndex < steps.length - 1) {
      checkoutState.value.step = steps[currentIndex + 1]!;
    }
  };
  
  // Go to previous checkout step
  const previousStep = () => {
    const steps: CheckoutState['step'][] = ['information', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(checkoutState.value.step);
    
    if (currentIndex > 0) {
      checkoutState.value.step = steps[currentIndex - 1]!;
    }
  };
  
  // Submit order
  const submitOrder = async () => {
    if (!selectedShipping.value) {
      return {
        success: false,
        error: 'Vyberte prosím způsob dopravy.'
      };
    }

    if (!selectedPayment.value) {
      return {
        success: false,
        error: 'Vyberte prosím způsob platby.'
      };
    }

    const orderId = uuidv4();
    try {
      const bankTransferPayment = checkoutState.value.selectedPaymentMethod === 'bank-transfer'
        ? createBankTransferPayment(orderId)
        : null;

      // Create order payload
      const orderPayload = {
        cartId: cartSessionId.value,
        orderId,
        customerInfo: checkoutState.value.customerInfo,
        shippingMethod: checkoutState.value.selectedShippingMethod,
        selectedPickupPoint: checkoutState.value.selectedPickupPoint,
        paymentMethod: checkoutState.value.selectedPaymentMethod,
        bankTransferPayment,
        discount: checkoutState.value.appliedDiscount ? {
          code: checkoutState.value.appliedDiscount.code,
          type: checkoutState.value.appliedDiscount.type,
          percentage: checkoutState.value.appliedDiscount.percentage,
          freeShipping: checkoutState.value.appliedDiscount.freeShipping,
          percentageDiscount: percentageDiscount.value,
          shippingDiscount: shippingDiscount.value,
          totalDiscount: totalDiscount.value,
        } : null,
        orderNotes: checkoutState.value.orderNotes,
        items: cartItems.value,
        totals: {
          subtotal: totalPrice.value,
          shipping: shippingCost.value,
          paymentSurcharge: paymentSurcharge.value,
          total: orderTotal.value
        }
      };
      // 1. Create delivery shipment
      const deliveryEndpoint = getDeliveryEndpoint(checkoutState.value.selectedShippingMethod)
      let deliveryResponse = null
      if (deliveryEndpoint) {
        deliveryResponse = await $fetch(deliveryEndpoint, {
          method: 'POST',
          body: orderPayload
        })
      }

      // 2. Create order in database
      const order = await $fetch('/api/order/order', {
        method: 'POST',
        body: orderPayload
      })

      if (!order) {
        throw new Error('Failed to create order')
      }

      if (checkoutState.value.selectedPaymentMethod === 'bank-transfer') {
        return {
          success: true,
          orderId,
          paymentMethod: 'bank-transfer',
          amount: orderTotal.value,
          bankTransferPayment
        }
      }

      // 3. Process payment (get Stripe redirect URL)
      const paymentResponse: { url: string } = await $fetch('/api/orders', {
        method: 'POST',
        body: orderPayload
      })

      if (!paymentResponse?.url) {
        throw new Error('Failed to process payment')
      }

      // 4. Redirect to payment — email and cart clearing happen after payment on order-confirmation page
      navigateTo(paymentResponse.url, { external: true })
      return { success: true, orderId, paymentMethod: 'card', redirected: true }
      
    } catch (error: any) {
      console.error('Failed to submit order:', error);
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to submit order. Please try again.'
      };
    }
  };
  
  function setSelectedPickupPoint(pickupPoint: any) {
    checkoutState.value.selectedPickupPoint = pickupPoint;
  }

  function getSelectedPickupPoint() {
    return checkoutState.value.selectedPickupPoint;
  }

  return {
    checkoutState,
    shippingMethods,
    paymentMethods,
    selectedShipping,
    selectedPayment,
    shippingCost,
    paymentSurcharge,
    percentageDiscount,
    shippingDiscount,
    totalDiscount,
    orderTotal,
    applyDiscountCode,
    removeDiscountCode,
    nextStep,
    previousStep,
    submitOrder,
    setSelectedPickupPoint,
    getSelectedPickupPoint
  };
};
