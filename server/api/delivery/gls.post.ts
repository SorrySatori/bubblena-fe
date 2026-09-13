import { backendBase, backendHeaders, rethrowBackendError } from '../../utils/authProxy'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    return await $fetch(`${backendBase()}/gls/create-shipment`, {
      method: 'POST',
      headers: backendHeaders(),
      body,
    })
  } catch (error: any) {
    console.error('Error creating GLS shipment:', error?.data || error?.message)
    rethrowBackendError(error)
  }
})
