export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.apiKey || ''
  const body = await readBody(event)

  if (body.paymentMethod === 'card') {
    try {
      const response = await $fetch(`${config.public.apiBase}/checkout/create-session`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey },
        body,
        timeout: 10000,
        retry: 3
      });
      return response;
    } catch (error: any) {
      console.error('Error creating order:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to create order'
      });
    }
  }
  else {
    console.log('tu implementovat platbu prevodem')
  }
})
