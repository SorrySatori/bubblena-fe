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

// Define the cart response interface
export interface CartResponse {
  id: string;
  items: CartItem[];
}

// Create a reactive cart state that persists using localStorage and database
export const useCart = () => {
  // Cart session ID
  const cartSessionId = useState<string | null>('cart-session-id', () => {
    if (import.meta.client) {
      return sessionStorage.getItem('bubblena-cart-id');
    }
    return null;
  });

  // Initialize cart from database if session ID exists, otherwise from localStorage
  const loadCart = async (): Promise<CartItem[]> => {
    if (import.meta.client) {
      // Check if we have a cart session ID
      if (cartSessionId.value) {
        try {
          // Load cart from database using the session ID
          const response = await $fetch<CartResponse>(`/api/cart/${cartSessionId.value}`);
          return response.items || [];
        } catch (error) {
          console.error('Failed to load cart from database:', error);
          // If loading from database fails, try localStorage as fallback
          const savedCart = localStorage.getItem('bubblena-cart');
          return savedCart ? JSON.parse(savedCart) : [];
        }
      } else {
        // No session ID, try to load from localStorage
        const savedCart = localStorage.getItem('bubblena-cart');
        return savedCart ? JSON.parse(savedCart) : [];
      }
    }
    return [];
  };

  // Use Nuxt's useState for global state management
  const cartItems = useState<CartItem[]>('cart-items', () => []);
  
  // Load cart items on initialization
  if (import.meta.client) {
    // We need to use nextTick to ensure this runs after component mounting
    nextTick(async () => {
      cartItems.value = await loadCart();
    });
  }

  // Save cart to localStorage and database whenever it changes
  const saveCart = async () => {
    if (import.meta.client) {
      // Save to localStorage for quick access
      localStorage.setItem('bubblena-cart', JSON.stringify(cartItems.value));
      
      // Save to database if we have a session ID
      if (cartSessionId.value) {
        try {
          await $fetch(`/api/cart/${cartSessionId.value}/items`, {
            method: 'PUT',
            body: {
              items: cartItems.value
            }
          });
        } catch (error) {
          console.error('Failed to save cart to database:', error);
        }
      } else if (cartItems.value.length > 0) {
        // Create a new cart in the database if we don't have a session ID but have items
        try {
          const response = await $fetch<CartResponse>('/api/cart/cart', {
            method: 'POST'
          });
          
          // Store the new cart session ID
          cartSessionId.value = response.id;
          sessionStorage.setItem('bubblena-cart-id', response.id);
          
          // Now save the items to this new cart
          await $fetch(`/api/cart/items`, {
            method: 'POST',
            body: {
              sessionId: response.id,
              items: cartItems.value
            }
          });
        } catch (error) {
          console.error('Failed to create new cart in database:', error);
        }
      }
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
    // Also clear the session ID when clearing the cart
    if (import.meta.client && cartSessionId.value) {
      sessionStorage.removeItem('bubblena-cart-id');
      cartSessionId.value = null;
    }
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
    cartSessionId,
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
