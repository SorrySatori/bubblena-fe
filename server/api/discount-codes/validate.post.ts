export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    return await $fetch(`${config.public.apiBase}/discount-codes/validate`, {
      method: 'POST',
      headers: { 'x-api-key': config.apiKey || '' },
      body,
    })
  } catch (error: any) {
    console.error('Error validating discount code:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.data?.error || 'Failed to validate discount code',
    })
  }
})
