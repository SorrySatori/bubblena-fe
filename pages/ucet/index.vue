<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold text-secondary">Můj účet</h1>
      <NuxtLink to="/ucet/objednavky"
        class="text-primary hover:underline text-sm">Moje objednávky →</NuxtLink>
    </div>

    <p class="text-gray-600 mb-8">Přihlášen jako <b>{{ user?.email }}</b></p>

    <h2 class="text-lg font-medium text-secondary mb-4">Profil a doručovací adresa</h2>
    <form @submit.prevent="onSave" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">Jméno</label>
          <input v-model="form.firstName" type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">Příjmení</label>
          <input v-model="form.lastName" type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-secondary mb-1">Telefon</label>
        <input v-model="form.phone" type="tel"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label class="block text-sm font-medium text-secondary mb-1">Ulice a č.p.</label>
        <input v-model="form.address.street" type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-secondary mb-1">Město</label>
          <input v-model="form.address.city" type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">PSČ</label>
          <input v-model="form.address.postalCode" type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit" :disabled="saving"
          class="bg-primary text-white px-5 py-2.5 rounded hover:bg-accent transition-all disabled:opacity-60">
          {{ saving ? 'Ukládám…' : 'Uložit změny' }}
        </button>
        <span v-if="saved" class="text-green-600 text-sm">Uloženo ✓</span>
        <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, updateProfile } = useAuth()

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  address: { street: '', city: '', postalCode: '', country: 'CZ' },
})

const saving = ref(false)
const saved = ref(false)
const error = ref('')

function hydrate() {
  if (!user.value) return
  form.firstName = user.value.firstName || ''
  form.lastName = user.value.lastName || ''
  form.phone = user.value.phone || ''
  form.address.street = user.value.address?.street || ''
  form.address.city = user.value.address?.city || ''
  form.address.postalCode = user.value.address?.postalCode || ''
  form.address.country = user.value.address?.country || 'CZ'
}

watch(user, hydrate, { immediate: true })

async function onSave() {
  error.value = ''
  saved.value = false
  saving.value = true
  try {
    await updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      address: { ...form.address },
    })
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch (e: any) {
    error.value = e?.data?.message || 'Uložení se nezdařilo.'
  } finally {
    saving.value = false
  }
}
</script>
