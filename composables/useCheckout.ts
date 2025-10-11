import { ref, computed } from 'vue';
import { useState } from '#app';
import { useCart } from './useCart';

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
  selectedPaymentMethod: string | null;
  orderNotes: string;
}

// Create a composable for checkout functionality
export const useCheckout = () => {
  const { cartItems, totalPrice, cartSessionId } = useCart();
  
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
      id: 'express',
      name: 'Expresní doručení',
      description: 'Doručení do druhého dne',
      price: 149,
      estimatedDelivery: '1 pracovní den'
    },
    {
      id: 'pickup',
      name: 'Osobní odběr',
      description: 'Vyzvednutí na výdejním místě',
      price: 0,
      estimatedDelivery: 'Ihned po připravení'
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
    {
      id: 'cod',
      name: 'Dobírka',
      description: 'Platba při převzetí',
      icon: 'cash',
      surcharge: 30
    }
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
    selectedShippingMethod: 'standard',
    selectedPaymentMethod: 'card',
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
  
  // Calculate total order cost
  const orderTotal = computed(() => {
    return totalPrice.value + shippingCost.value + paymentSurcharge.value;
  });
  
  // Go to next checkout step
  const nextStep = () => {
    const steps: CheckoutState['step'][] = ['information', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(checkoutState.value.step);
    
    if (currentIndex < steps.length - 1) {
      checkoutState.value.step = steps[currentIndex + 1];
    }
  };
  
  // Go to previous checkout step
  const previousStep = () => {
    const steps: CheckoutState['step'][] = ['information', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(checkoutState.value.step);
    
    if (currentIndex > 0) {
      checkoutState.value.step = steps[currentIndex - 1];
    }
  };
  
  // Submit order
  const submitOrder = async () => {
    try {
      // Create order payload
      const orderPayload = {
        cartId: cartSessionId.value,
        customerInfo: checkoutState.value.customerInfo,
        shippingMethod: checkoutState.value.selectedShippingMethod,
        paymentMethod: checkoutState.value.selectedPaymentMethod,
        orderNotes: checkoutState.value.orderNotes,
        items: cartItems.value,
        totals: {
          subtotal: totalPrice.value,
          shipping: shippingCost.value,
          paymentSurcharge: paymentSurcharge.value,
          total: orderTotal.value
        }
      };
      
      // Send order to API
      const response = await $fetch('/api/orders', {
        method: 'POST',
        body: orderPayload
      });
      
      return {
        success: true,
        orderId: response.id
      };
    } catch (error) {
      console.error('Failed to submit order:', error);
      return {
        success: false,
        error: 'Failed to submit order. Please try again.'
      };
    }
  };
  
  return {
    checkoutState,
    shippingMethods,
    paymentMethods,
    selectedShipping,
    selectedPayment,
    shippingCost,
    paymentSurcharge,
    orderTotal,
    nextStep,
    previousStep,
    submitOrder
  };
};
