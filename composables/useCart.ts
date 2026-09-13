import { computed, nextTick } from 'vue';
import { useState } from '#app';
import type { ProductVariant } from './useProducts';

// Define the cart item interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight?: number;
  variant?: ProductVariant;
  imageUrl?: string;
}

// Cart state persisted in localStorage. The backend has no cart concept any
// more: prices are re-resolved server-side when the order is created.
export const useCart = () => {
  const loadCart = (): CartItem[] => {
    if (!import.meta.client) return [];
    try {
      const savedCart = localStorage.getItem('bubblena-cart');
      return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
    } catch {
      return [];
    }
  };

  const cartItems = useState<CartItem[]>('cart-items', () => []);

  // Hydrate once on the client (useState initializers don't re-run after SSR).
  if (import.meta.client) {
    nextTick(() => {
      if (cartItems.value.length === 0) cartItems.value = loadCart();
    });
  }

  const saveCart = () => {
    if (!import.meta.client) return;
    try {
      localStorage.setItem('bubblena-cart', JSON.stringify(cartItems.value));
    } catch {
      /* storage full or disabled – keep in-memory cart */
    }
  };

  // Add item to cart
  const addToCart = (item: CartItem) => {
    const existingItem = cartItems.value.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // If item already exists, update quantity
      existingItem.quantity += item.quantity;
    } else {
      // Otherwise add new item
      cartItems.value.push(item);
    }
    
    saveCart();
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    cartItems.value = cartItems.value.filter(item => item.id !== itemId);
    saveCart();
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    const item = cartItems.value.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      saveCart();
    }
  };

  // Clear the entire cart
  const clearCart = () => {
    cartItems.value = [];
    saveCart();
  };

  // Calculate total items in cart
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });
  // Calculate total price
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Check if cart is empty
  const isEmpty = computed(() => cartItems.value.length === 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isEmpty,
    loadCart
  };
};
