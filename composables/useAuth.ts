export interface AuthAddress {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address: AuthAddress
  emailVerified: boolean
  authProvider: 'local' | 'google'
}

export interface RegisterPayload {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

/**
 * Customer auth state + actions. The JWT lives in an httpOnly cookie on the
 * Nuxt origin; this composable only ever sees the public user object.
 */
export const useAuth = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const loggedIn = computed(() => !!user.value)

  async function fetchMe() {
    const { user: u } = await $fetch<{ user: AuthUser | null }>('/api/auth/me')
    user.value = u
    return u
  }

  async function login(email: string, password: string) {
    const { user: u } = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = u
    return u
  }

  async function register(payload: RegisterPayload) {
    return await $fetch<{ success: boolean; email: string }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
  }

  async function verify(email: string, token: string) {
    const { user: u } = await $fetch<{ user: AuthUser }>('/api/auth/verify', {
      method: 'POST',
      body: { email, token },
    })
    user.value = u
    return u
  }

  async function loginWithGoogle(credential: string) {
    const { user: u } = await $fetch<{ user: AuthUser }>('/api/auth/google', {
      method: 'POST',
      body: { credential },
    })
    user.value = u
    return u
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  async function updateProfile(payload: Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'phone' | 'address'>>) {
    const { user: u } = await $fetch<{ user: AuthUser }>('/api/auth/me', {
      method: 'PATCH',
      body: payload,
    })
    user.value = u
    return u
  }

  return { user, loggedIn, fetchMe, login, register, verify, loginWithGoogle, logout, updateProfile }
}
