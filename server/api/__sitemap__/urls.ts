// Supplies dynamic detail-page URLs to @nuxtjs/sitemap. Runs in full Nitro
// context, so it fetches the backend directly (mirroring server/api/products.ts).
// Uses slug when the backend provides one, otherwise falls back to _id.
export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const apiKey = (config.apiKey as string) || ''
  if (!apiKey) return []

  const headers = { 'x-api-key': apiKey }
  const opts = { headers, timeout: 5000, retry: 1 } as const

  const fetchList = async (path: string): Promise<any[]> => {
    try {
      const data = await $fetch<any[]>(`${apiBase}${path}`, opts)
      return Array.isArray(data) ? data : []
    } catch (err) {
      console.error(`sitemap: failed to fetch ${path}`, err)
      return []
    }
  }

  const [products, steamers] = await Promise.all([
    fetchList('/products'),
    fetchList('/steamers'),
  ])

  const entry = (prefix: string, item: any) => ({
    loc: `${prefix}/${item.slug || item._id}`,
    lastmod: item.updatedAt,
  })

  return [
    ...products.map((p) => entry('/product', p)),
    ...steamers.map((s) => entry('/steamer', s)),
  ]
})
