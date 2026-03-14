export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  // Mock data for fallback
  const mockProducts = [
    {
      id: '1',
      name: 'Bubblena Basic',
      description: 'Our entry-level bubble tea with classic flavors',
      price: 19.99,
      imageUrl: '',
      category: 'classic',
      inStock: true,
      quantity: 100
    },
    {
      id: '2',
      name: 'Bubblena Premium',
      description: 'Premium bubble tea with exotic flavors and special toppings',
      price: 29.99,
      imageUrl: '',
      category: 'premium',
      inStock: true,
      quantity: 50
    },
    {
      id: '3',
      name: 'Bubblena Seasonal',
      description: 'Limited edition seasonal flavors',
      price: 24.99,
      imageUrl: '',
      category: 'seasonal',
      inStock: false,
      quantity: 0
    }
  ]

  try {
    const apiKey = config.apiKey || ''

    if (!apiKey) {
      console.warn('API key is not set in runtime config. Using mock data.')
      return mockProducts
    }

    const response = await $fetch(`${config.public.apiBase}/products`, {
      headers: {
        'x-api-key': apiKey
      },
      timeout: 5000,
      retry: 1
    })

    return response
  } catch (error: any) {
    console.error('Error fetching products from external API:', error)

    // Check if it's a 401 error
    if (error.statusCode === 401) {
      console.warn('Authentication failed with the external API. Check your API key.')
    }

    // For development, return mock data instead of throwing an error
    if (import.meta.dev) {
      return mockProducts
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products from external API'
    })
  }
})