import type { CartItem } from './useCart'

interface ReorderResult {
  added: number
  unavailable: string[]
  adjusted: string[]
}

/**
 * Repopulates the cart from a past order. For bath-bomb variants (id =
 * `${productId}-${weight}`) it refreshes the current price and checks
 * availability; out-of-stock items are skipped. Other item types are re-added
 * from stored data and validated by the backend at checkout.
 */
export const useReorder = () => {
  const { addToCart } = useCart()
  const { getProduct } = useProducts()

  async function reorder(order: { items?: any[] }): Promise<ReorderResult> {
    const items = order?.items || []
    const unavailable: string[] = []
    const adjusted: string[] = []
    let added = 0

    for (const item of items) {
      const parts = String(item.id).split('-')
      const productId = parts[0]
      const weight = parts.length > 1 ? Number(parts[1]) : undefined

      if (productId && weight && Number.isFinite(weight)) {
        const product: any = await getProduct(productId)
        const variant = product?.variants?.find((v: any) => v.weight === weight)

        if (!product || !variant || !variant.inStock || variant.stockCount < 1) {
          unavailable.push(item.name)
          continue
        }

        const qty = Math.min(item.quantity, variant.stockCount)
        if (qty < item.quantity) adjusted.push(item.name)

        const cartItem: CartItem = {
          id: `${productId}-${weight}`,
          name: `${product.name} (${weight}g)`,
          price: variant.price,
          quantity: qty,
          weight,
          variant,
          imageUrl: product.imageUrl,
        }
        addToCart(cartItem)
        added += 1
      } else {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })
        added += 1
      }
    }

    return { added, unavailable, adjusted }
  }

  return { reorder }
}
