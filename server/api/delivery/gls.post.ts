export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  try {
    const response = await $fetch(`${config.public.apiBase}/gls/create-shipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return response
  } catch (error: any) {
    console.error('Error creating GLS shipment:', error?.data || error?.message || error)
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.data?.message || error?.message || 'Failed to create GLS shipment'
    })
  }
})
