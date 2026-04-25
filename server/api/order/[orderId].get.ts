export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const orderId = getRouterParam(event, 'orderId')

  try {
    const response = await $fetch(`${config.public.apiBase}/order/${orderId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching order:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.data?.message || 'Failed to fetch order'
    })
  }
})
