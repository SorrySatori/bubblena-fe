export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
      try {
        const response = await $fetch(`${config.public.apiBase}/order/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': config.apiKey || '' },
            body: JSON.stringify(body),
          })
          
        return response;
      } catch (error: any) {
        console.error('Error creating order:', error)
        throw createError({
          statusCode: error?.statusCode || 500,
          message: error?.data?.error || error?.data?.message || 'Failed to create order'
        });
      }

  })
  