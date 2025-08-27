export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiKey = config.apiKey || ''
    const { sessionId } = getRouterParams(event)
  
    try {
      const response = await $fetch(`${config.public.apiBase}/cart/${sessionId}`, {
        headers: { 'x-api-key': apiKey }
      })
      return response
    } catch (error: any) {
      console.error(`Error fetching cart ${sessionId}:`, error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch cart'
      })
    }
  })
  