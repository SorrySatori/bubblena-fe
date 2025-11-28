export default defineEventHandler(async (): Promise<any> => {
  const config = useRuntimeConfig();

  try {
    // Fetch steamers from backend API
    const apiKey = config.apiKey || ''
    const response: any = await $fetch(`${config.public.apiBase}/steamers`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      },
    });

    return response;
  } catch (error: any) {
    console.error('Error fetching steamers from backend:', error);
    
    // Return a more user-friendly error
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Failed to fetch steamers',
    });
  }
});
