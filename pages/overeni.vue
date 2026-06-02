<template>
  <div class="max-w-md mx-auto px-4 py-16 text-center">
    <div v-if="state === 'pending'">
      <p class="text-secondary">Ověřuji e-mail…</p>
    </div>
    <div v-else-if="state === 'ok'" class="bg-green-50 border border-green-200 text-green-800 rounded p-6">
      <p class="font-medium mb-1">E-mail ověřen ✅</p>
      <p class="text-sm">Přihlašuji vás a přesměrovávám do účtu…</p>
    </div>
    <div v-else class="bg-red-50 border border-red-200 text-red-800 rounded p-6">
      <p class="font-medium mb-1">Ověření se nezdařilo</p>
      <p class="text-sm mb-4">{{ error }}</p>
      <NuxtLink to="/registrace" class="text-primary hover:underline">Zpět na registraci</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { verify } = useAuth()
const route = useRoute()

const state = ref<'pending' | 'ok' | 'error'>('pending')
const error = ref('')

onMounted(async () => {
  const email = route.query.email as string
  const token = route.query.token as string
  if (!email || !token) {
    state.value = 'error'
    error.value = 'Neplatný ověřovací odkaz.'
    return
  }
  try {
    await verify(email, token)
    state.value = 'ok'
    setTimeout(() => navigateTo('/ucet'), 1200)
  } catch (e: any) {
    state.value = 'error'
    error.value = e?.data?.message || 'Ověřovací odkaz je neplatný nebo vypršel.'
  }
})
</script>
