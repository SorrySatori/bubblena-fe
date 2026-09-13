import { backendBase, backendHeaders, rethrowBackendError } from '../../utils/authProxy'
import { assertRateLimit } from '../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, { name: 'order-create', limit: 10, windowMs: 10 * 60 * 1000 })

  const body = await readBody(event)
  try {
    return await $fetch(`${backendBase()}/order/create`, {
      method: 'POST',
      headers: backendHeaders(),
      body,
    })
  } catch (error: any) {
    console.error('Error creating order:', error?.data || error?.message)
    rethrowBackendError(error)
  }
})
