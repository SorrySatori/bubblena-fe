import { bombToProduct } from '../utils/bombToProduct'

// Storefront catalog. Reads the `Bomb` model (single source of truth for stock,
// managed by admin + production) and maps it to the flat product shape the
// storefront expects. See server/utils/bombToProduct.ts.
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiKey = (config.apiKey as string) || ''

  if (!apiKey) {
    console.warn('API key is not set in runtime config. Returning empty catalog.')
    return []
  }

  try {
    const bombs = await $fetch<any[]>(`${config.public.apiBase}/bombs`, {
      headers: { 'x-api-key': apiKey },
      timeout: 5000,
      retry: 1,
    })
    return (Array.isArray(bombs) ? bombs : []).map(bombToProduct)
  } catch (error: any) {
    console.error('Error fetching bombs from external API:', error)
    if (import.meta.dev) return []
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products from external API',
    })
  }
})
