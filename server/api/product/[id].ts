import { bombToProduct } from '../../utils/bombToProduct'

// Single storefront product = a `Bomb` (resolved by _id), mapped to the flat
// product shape the detail page expects. See server/utils/bombToProduct.ts.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()

  try {
    const bomb = await $fetch(`${config.public.apiBase}/bombs/${id}`, {
      headers: { 'x-api-key': (config.apiKey as string) || '' },
    })
    return bombToProduct(bomb)
  } catch (error: any) {
    if (error?.statusCode === 404 || error?.response?.status === 404) {
      throw createError({ statusCode: 404, message: 'Produkt nenalezen' })
    }
    console.error(`Error fetching bomb ${id} from external API:`, error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch product ${id} from external API`,
    })
  }
})
