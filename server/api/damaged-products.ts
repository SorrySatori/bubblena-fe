export default defineEventHandler(async (): Promise<any> => {
  const config = useRuntimeConfig();

  try {
    const apiKey = config.apiKey || ''
    const response: any = await $fetch(`${config.public.apiBase}/damaged-products`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      },
    });

    return response;
  } catch (error: any) {
    console.error('Error fetching damaged products from backend:', error);
    
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Failed to fetch damaged products',
    });
  }
});
