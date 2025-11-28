export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig();
  const backendUrl = config.public.backendUrl;
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Steamer ID is required',
    });
  }

  try {
    // Fetch single steamer from backend API
    const response: any = await $fetch(`${config.public.apiBase}/steamers/${id}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.NUXT_API_KEY as string
      },
    });

    return response;
  } catch (error: any) {
    console.error(`Error fetching steamer ${id} from backend:`, error);
    
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Failed to fetch steamer',
    });
  }
});
