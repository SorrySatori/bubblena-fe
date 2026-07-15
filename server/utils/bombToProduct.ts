// Adapter: maps the backend `Bomb` model (the single source of truth, managed
// by admin + production) into the flat `Product` shape the storefront already
// consumes (name + variants[{weight, price, inStock, stockCount}]).
// Stock per weight is aggregated across ALL lots → batches → variants, so a
// weight is "in stock" if any batch has pieces of it.
export function bombToProduct(bomb: any) {
  if (!bomb || typeof bomb !== 'object') return bomb

  const stockByWeight: Record<number, number> = {}
  for (const lot of bomb.lots || []) {
    for (const batch of lot.batches || []) {
      for (const v of batch.variants || []) {
        stockByWeight[v.weight] = (stockByWeight[v.weight] || 0) + (v.stockCount || 0)
      }
    }
  }

  // `pricing` defines which weights are offered and at what price.
  const variants = (bomb.pricing || []).map((p: any) => {
    const stockCount = stockByWeight[p.weight] || 0
    return { weight: p.weight, price: p.price, stockCount, inStock: stockCount > 0 }
  })

  return {
    _id: bomb._id,
    name: bomb.name,
    shortDescription: bomb.shortDescription,
    description: bomb.description,
    imageUrl: bomb.imageUrl,
    bathImageUrl: bomb.bathImageUrl,
    videoUrl: bomb.videoUrl,
    storageMethod: bomb.storageMethod,
    // Bomb has no `ingredients` field (recipes live separately); kept for
    // shape compatibility with the storefront's detail page.
    ingredients: bomb.ingredients ?? '',
    variants,
    createdAt: bomb.createdAt,
    updatedAt: bomb.updatedAt,
  }
}
