export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiKey = config.apiKey || ''

    const body = await readBody(event)
    
    try {
      const response = await $fetch(`${config.public.apiBase}/cart/${body.sessionId}/add`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey },
        body
      })
      return response
    } catch (error: any) {
      console.error(`Error adding item to cart ${body.sessionId}:`, error)
      throw createError({
        statusCode: 500,
        message: 'Failed to add item to cart'
      })
    }
  })
  