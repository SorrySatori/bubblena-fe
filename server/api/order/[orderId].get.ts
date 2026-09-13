import { backendBase, backendHeaders, rethrowBackendError } from '../../utils/authProxy'

export default defineEventHandler(async (event) => {
  const orderId = getRouterParam(event, 'orderId') || ''
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
    throw createError({ statusCode: 400, message: 'Neplatné číslo objednávky.' })
  }

  try {
    return await $fetch(`${backendBase()}/order/${encodeURIComponent(orderId)}`, {
      headers: backendHeaders(),
    })
  } catch (error: any) {
    console.error('Error fetching order:', error?.data || error?.message)
    rethrowBackendError(error)
  }
})
