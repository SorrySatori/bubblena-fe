export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.apiKey || '';
  
  try {
    // Get order data from request body
    const body = await readBody(event);
    
    // Send order to backend API
    const response = await $fetch(`${config.public.apiBase}/orders`, {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
      body
    });
    
    return response;
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create order'
    });
  }
});
