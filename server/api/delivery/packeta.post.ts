export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
      try {
        const response = await $fetch(`${config.public.apiBase}/packeta/create-shipment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          
        return response;
      } catch (error: any) {
        console.error('Error creating order:', error)
        throw createError({
          statusCode: 500,
          message: 'Failed to create order'
        });
      }

  })
  