<template>
  <div class="max-w-md mx-auto px-4 py-12">
    <h1 class="text-2xl font-semibold text-secondary mb-6 text-center">Registrace</h1>

    <div v-if="done" class="bg-green-50 border border-green-200 text-green-800 rounded p-4 text-center">
      <p class="font-medium mb-1">Hotovo! 🎉</p>
      <p class="text-sm">Na <b>{{ email }}</b> jsme poslali ověřovací odkaz. Klikněte na něj pro dokončení registrace.</p>
    </div>

    <template v-else>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-secondary mb-1">Jméno</label>
            <input v-model="firstName" type="text" autocomplete="given-name"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary mb-1">Příjmení</label>
            <input v-model="lastName" type="text" autocomplete="family-name"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">E-mail</label>
          <input v-model="email" type="email" required autocomplete="email"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">Heslo</label>
          <input v-model="password" type="password" required autocomplete="new-password" minlength="8"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          <p class="text-xs text-gray-500 mt-1">Min. 8 znaků.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">Heslo znovu</label>
          <input v-model="passwordConfirm" type="password" required autocomplete="new-password"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div class="space-y-2 pt-1">
          <label class="flex items-start gap-2 text-sm text-gray-700">
            <input v-model="acceptTerms" type="checkbox" class="mt-1 accent-primary" />
            <span>
              Souhlasím s
              <NuxtLink to="/obchodni-podminky" target="_blank" class="text-primary hover:underline">obchodními podmínkami</NuxtLink>
              a beru na vědomí
              <NuxtLink to="/obchodni-podminky#gdpr" target="_blank" class="text-primary hover:underline">zásady ochrany osobních údajů</NuxtLink>.
            </span>
          </label>
          <label class="flex items-start gap-2 text-sm text-gray-700">
            <input v-model="marketing" type="checkbox" class="mt-1 accent-primary" />
            <span>Chci e-mailem dostávat novinky a akční nabídky (nepovinné, lze kdykoli odvolat).</span>
          </label>
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full bg-primary text-white py-2.5 rounded hover:bg-accent transition-all disabled:opacity-60">
          {{ loading ? 'Registruji…' : 'Registrovat' }}
        </button>
      </form>

      <div class="my-6 flex items-center gap-3 text-gray-400 text-sm">
        <span class="flex-1 h-px bg-gray-200"></span>nebo<span class="flex-1 h-px bg-gray-200"></span>
      </div>

      <GoogleSignInButton @credential="onGoogle" />
      <p class="text-center text-xs text-gray-500 mt-2">
        Registrací (i přes Google) souhlasíte s
        <NuxtLink to="/obchodni-podminky" target="_blank" class="text-primary hover:underline">podmínkami</NuxtLink>
        a berete na vědomí
        <NuxtLink to="/obchodni-podminky#gdpr" target="_blank" class="text-primary hover:underline">zásady ochrany osobních údajů</NuxtLink>.
      </p>

      <p class="text-center text-sm text-gray-600 mt-6">
        Už máte účet?
        <NuxtLink to="/prihlaseni" class="text-primary hover:underline">Přihlaste se</NuxtLink>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
const { register, loginWithGoogle, loggedIn } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const acceptTerms = ref(false)
const marketing = ref(false)
const loading = ref(false)
const error = ref('')
const done = ref(false)

onMounted(() => {
  if (loggedIn.value) navigateTo('/ucet')
})

async function onSubmit() {
  error.value = ''
  if (password.value.length < 8) {
    error.value = 'Heslo musí mít alespoň 8 znaků.'
    return
  }
  if (password.value !== passwordConfirm.value) {
    error.value = 'Hesla se neshodují.'
    return
  }
  if (!acceptTerms.value) {
    error.value = 'Pro registraci je nutný souhlas s obchodními podmínkami a zásadami ochrany osobních údajů.'
    return
  }
  loading.value = true
  try {
    await register({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      acceptTerms: acceptTerms.value,
      marketing: marketing.value,
    })
    done.value = true
  } catch (e: any) {
    error.value = e?.data?.message || 'Registrace se nezdařila.'
  } finally {
    loading.value = false
  }
}

async function onGoogle(credential: string) {
  error.value = ''
  if (!acceptTerms.value) {
    error.value = 'Před registrací přes Google prosím potvrďte souhlas s podmínkami níže.'
    return
  }
  try {
    await loginWithGoogle(credential, marketing.value)
    await navigateTo('/ucet')
  } catch (e: any) {
    error.value = e?.data?.message || 'Přihlášení přes Google se nezdařilo.'
  }
}
</script>
