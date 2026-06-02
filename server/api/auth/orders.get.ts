import {
  backendBase,
  backendHeaders,
  getSessionToken,
  rethrowBackendError,
} from '../../utils/authProxy'

export default defineEventHandler(async (event) => {
  const token = getSessionToken(event)
  if (!token) throw createError({ statusCode: 401, message: 'Přihlášení vyžadováno' })

  try {
    return await $fetch<{ success: boolean; orders: any[] }>(`${backendBase()}/auth/orders`, {
      method: 'GET',
      headers: backendHeaders(token),
    })
  } catch (error: any) {
    rethrowBackendError(error)
  }
})
