export default defineEventHandler(async (event) => {

  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()
  
  try {
    const res = await $fetch(`${config.public.apiBase}/damaged-products/${id}`, {
      headers: {
        'x-api-key': process.env.NUXT_API_KEY as string
      },
    })    
    return res
  } catch (error) {
    console.error(`Error fetching damaged product ${id} from external API:`, error)
    throw createError({
      statusCode: 500,
      message: `Failed to fetch damaged product ${id} from external API`
    })
  }
})
