<template>
  <div class="max-w-md mx-auto px-4 py-12">
    <h1 class="text-2xl font-semibold text-secondary mb-6 text-center">Přihlášení</h1>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-secondary mb-1">E-mail</label>
        <input v-model="email" type="email" required autocomplete="email"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label class="block text-sm font-medium text-secondary mb-1">Heslo</label>
        <input v-model="password" type="password" required autocomplete="current-password"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <button type="submit" :disabled="loading"
        class="w-full bg-primary text-white py-2.5 rounded hover:bg-accent transition-all disabled:opacity-60">
        {{ loading ? 'Přihlašuji…' : 'Přihlásit' }}
      </button>
    </form>

    <div class="my-6 flex items-center gap-3 text-gray-400 text-sm">
      <span class="flex-1 h-px bg-gray-200"></span>nebo<span class="flex-1 h-px bg-gray-200"></span>
    </div>

    <GoogleSignInButton @credential="onGoogle" />
    <p class="text-center text-xs text-gray-500 mt-2">
      Přihlášením přes Google a případným vytvořením účtu souhlasíte s
      <NuxtLink to="/obchodni-podminky" target="_blank" class="text-primary hover:underline">podmínkami</NuxtLink>
      a berete na vědomí
      <NuxtLink to="/obchodni-podminky#gdpr" target="_blank" class="text-primary hover:underline">zásady ochrany osobních údajů</NuxtLink>.
    </p>

    <p class="text-center text-sm text-gray-600 mt-6">
      Nemáte účet?
      <NuxtLink to="/registrace" class="text-primary hover:underline">Zaregistrujte se</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const { login, loginWithGoogle, loggedIn } = useAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const redirectTo = computed(() => (route.query.redirect as string) || '/ucet')

onMounted(() => {
  if (loggedIn.value) navigateTo(redirectTo.value)
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo(redirectTo.value)
  } catch (e: any) {
    error.value = e?.data?.message || 'Přihlášení se nezdařilo.'
  } finally {
    loading.value = false
  }
}

async function onGoogle(credential: string) {
  error.value = ''
  try {
    await loginWithGoogle(credential)
    await navigateTo(redirectTo.value)
  } catch (e: any) {
    error.value = e?.data?.message || 'Přihlášení přes Google se nezdařilo.'
  }
}
</script>
