import { defineStore } from 'pinia'

export interface CartItem {
  productId: string
  variantId?: string
  quantity: number
}

export interface Cart {
  _id: string
  sessionId: string
  cartId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null as Cart | null
  }),

  actions: {
    async initCart() {
      let sessionId = localStorage.getItem('cartSessionId')
      if (sessionId !== undefined && sessionId !== null) {
        const existingCart = await $fetch<Cart>(`/api/cart/${sessionId}`)
        this.cart = existingCart
      }
      else {
        const newCart = await $fetch<Cart>('/api/cart/cart', { method: 'POST' })
        this.cart = newCart
        localStorage.setItem('cartSessionId', newCart.cartId)
      }
    },

    async addItem(productId: string, variantId?: string, quantity = 1) {
      if (!this.cart) await this.initCart()

      const updatedCart = await $fetch<Cart>(`/api/cart/items`, {
        method: 'POST',
        body: { productId, variantId, quantity, sessionId: this.cart!.cartId }
      })
      this.cart = updatedCart
    },

    async updateItem(productId: string, variantId: string, quantity: number) {
      if (!this.cart) return

      const updatedCart = await $fetch<Cart>(`/api/cart/${this.cart!.cartId}/items`, {
        method: 'PUT',
        body: { productId, variantId, quantity }
      })

      this.cart = updatedCart
    }
  }
})
