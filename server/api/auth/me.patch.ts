import {
  backendBase,
  backendHeaders,
  getSessionToken,
  rethrowBackendError,
} from '../../utils/authProxy'

export default defineEventHandler(async (event) => {
  const token = getSessionToken(event)
  if (!token) throw createError({ statusCode: 401, message: 'Přihlášení vyžadováno' })

  const body = await readBody(event)
  try {
    const res = await $fetch<{ user: any }>(`${backendBase()}/auth/me`, {
      method: 'PATCH',
      headers: backendHeaders(token),
      body: {
        firstName: body?.firstName,
        lastName: body?.lastName,
        phone: body?.phone,
        address: body?.address,
      },
    })
    return { user: res.user }
  } catch (error: any) {
    rethrowBackendError(error)
  }
})
