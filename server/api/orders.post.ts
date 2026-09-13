import { backendBase, backendHeaders, rethrowBackendError } from '../utils/authProxy'
import { assertRateLimit } from '../utils/rateLimit'

/**
 * POST /api/orders  { orderId }
 * Creates the Stripe Checkout session for an existing (pending, card) order.
 * The backend builds the session from the stored order; no amounts travel here.
 */
export default defineEventHandler(async (event) => {
  assertRateLimit(event, { name: 'stripe-session', limit: 10, windowMs: 10 * 60 * 1000 })

  const body = await readBody(event)
  const orderId = typeof body?.orderId === 'string' ? body.orderId : ''
  if (!orderId) {
    throw createError({ statusCode: 400, message: 'Chybí číslo objednávky.' })
  }

  try {
    // No retry: creating a checkout session is not idempotent.
    return await $fetch<{ url: string }>(`${backendBase()}/checkout/create-session`, {
      method: 'POST',
      headers: backendHeaders(),
      body: { orderId },
      timeout: 15000,
    })
  } catch (error: any) {
    console.error('Error creating Stripe session:', error?.data || error?.message)
    rethrowBackendError(error)
  }
})
