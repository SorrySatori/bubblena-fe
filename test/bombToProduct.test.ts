import { describe, it, expect } from 'vitest'
import { bombToProduct } from '../server/utils/bombToProduct'

describe('bombToProduct', () => {
  it('aggregates stock per weight across lots and batches', () => {
    const bomb = {
      _id: 'b1',
      name: 'Kokobana',
      slug: 'kokobana',
      pricing: [{ weight: 100, price: 89 }, { weight: 180, price: 129 }],
      lots: [
        { batches: [{ variants: [{ weight: 100, stockCount: 3 }, { weight: 180, stockCount: 0 }] }] },
        { batches: [{ variants: [{ weight: 100, stockCount: 2 }] }] },
      ],
    }
    const product = bombToProduct(bomb)
    expect(product.slug).toBe('kokobana')
    expect(product.variants).toEqual([
      { weight: 100, price: 89, stockCount: 5, inStock: true },
      { weight: 180, price: 129, stockCount: 0, inStock: false },
    ])
  })
  it('offers only weights present in pricing', () => {
    const product = bombToProduct({ pricing: [{ weight: 100, price: 1 }], lots: [{ batches: [{ variants: [{ weight: 999, stockCount: 9 }] }] }] })
    expect(product.variants).toHaveLength(1)
    expect(product.variants[0].stockCount).toBe(0)
  })
  it('passes through non-objects untouched', () => {
    expect(bombToProduct(null)).toBeNull()
  })
})
