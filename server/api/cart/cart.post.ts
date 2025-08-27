export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiKey = config.apiKey || ''
    try {
      const response = await $fetch(`${config.public.apiBase}/cart`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey }
      })
      return response
    } catch (error: any) {
      console.error('Error creating cart:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to create cart'
      })
    }
  })
  