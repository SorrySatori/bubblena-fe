export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiKey = config.apiKey || ''
    const { sessionId } = getRouterParams(event)
    const body = await readBody(event)
  
    try {
      const response = await $fetch(`${config.public.apiBase}/cart/${sessionId}/items`, {
        method: 'PUT',
        headers: { 'x-api-key': apiKey },
        body
      })
      return response
    } catch (error: any) {
      console.error(`Error updating item in cart ${sessionId}:`, error)
      throw createError({
        statusCode: 500,
        message: 'Failed to update item in cart'
      })
    }
  })
  