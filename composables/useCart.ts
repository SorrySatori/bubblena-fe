import { computed } from 'vue';
import { useState } from '#app';

// Define the cart item interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Create a reactive cart state that persists using localStorage
export const useCart = () => {
  // Initialize cart from localStorage if available
  const loadCart = (): CartItem[] => {
    if (import.meta.client) {
      const savedCart = localStorage.getItem('bubblena-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  };

  // Use Nuxt's useState for global state management
  const cartItems = useState<CartItem[]>('cart-items', loadCart);
  // Save cart to localStorage whenever it changes
  const saveCart = () => {
    if (import.meta.client) {
      localStorage.setItem('bubblena-cart', JSON.stringify(cartItems.value));
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
    isEmpty
  };
};
