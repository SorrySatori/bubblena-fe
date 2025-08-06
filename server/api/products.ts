export default defineEventHandler(async (event) => {
    console.log('Server endpoint /api/products called!')
    
    // Get request headers to check if API key is present
    const headers = getHeaders(event)
    console.log('Request headers:', headers)
    
    const config = useRuntimeConfig()
    console.log('Using API base:', config.public.apiBase)
    
    try {
      const res = await $fetch(`${config.public.apiBase}/products`, {
        headers: {
          'x-api-key': process.env.NUXT_API_KEY as string
        },
      })
      
      console.log('API response received successfully')
      return res
    } catch (error) {
      console.error('Error fetching products from external API:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch products from external API'
      })
    }
  })