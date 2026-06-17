<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <h1 class="text-2xl font-semibold text-secondary mb-2">Můj účet</h1>
    <p class="text-gray-600 mb-8">Přihlášen jako <b>{{ user?.email }}</b></p>

    <!-- Profil: přehled vs. editace -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-secondary">Profil a doručovací adresa</h2>
        <button v-if="!editing" @click="startEdit"
          class="text-primary hover:underline text-sm">Upravit</button>
      </div>

      <!-- Přehledový režim -->
      <dl v-if="!editing" class="text-sm text-gray-700 space-y-2 border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between gap-4">
          <dt class="text-gray-500">Jméno</dt>
          <dd class="text-right">{{ fullName || '—' }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-gray-500">Telefon</dt>
          <dd class="text-right">{{ user?.phone || '—' }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-gray-500">Adresa</dt>
          <dd class="text-right">{{ formattedAddress || '—' }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-gray-500">Odběr novinek</dt>
          <dd class="text-right">{{ user?.marketingConsent ? 'Ano' : 'Ne' }}</dd>
        </div>
      </dl>

      <!-- Editační režim -->
      <form v-else @submit.prevent="onSave" class="space-y-4">
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
          <input id="acc-street" v-model="form.address.street" type="text" autocomplete="off"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary smartform-instance-account smartform-address-street-and-number" />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-secondary mb-1">Město</label>
            <input id="acc-city" v-model="form.address.city" type="text" autocomplete="off"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary smartform-instance-account smartform-address-city" />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary mb-1">PSČ</label>
            <input id="acc-postalCode" v-model="form.address.postalCode" type="text" autocomplete="off"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary smartform-instance-account smartform-address-zip" />
          </div>
        </div>

        <label class="flex items-start gap-2 text-sm text-gray-700 pt-1">
          <input v-model="form.marketingConsent" type="checkbox" class="mt-1 accent-primary" />
          <span>Chci e-mailem dostávat novinky a akční nabídky (lze kdykoli odvolat).</span>
        </label>

        <div class="flex items-center gap-3 pt-2">
          <button type="submit" :disabled="saving"
            class="bg-primary text-white px-5 py-2.5 rounded hover:bg-accent transition-all disabled:opacity-60">
            {{ saving ? 'Ukládám…' : 'Uložit změny' }}
          </button>
          <button type="button" @click="cancelEdit" :disabled="saving"
            class="text-secondary px-4 py-2.5 rounded border border-gray-300 hover:bg-gray-50 transition-all">
            Zrušit
          </button>
          <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
        </div>
      </form>
    </section>

    <!-- Minulé objednávky -->
    <section>
      <h2 class="text-lg font-medium text-secondary mb-4">Minulé objednávky</h2>
      <OrderHistory />
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({ title: 'Můj účet', robots: 'noindex, follow' })

// Address autocomplete is only needed on this page's address form.
useSmartform()

const { user, updateProfile } = useAuth()

const editing = ref(false)
const saving = ref(false)
const error = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  address: { street: '', city: '', postalCode: '', country: 'CZ' },
  marketingConsent: false,
})

const fullName = computed(() =>
  [user.value?.firstName, user.value?.lastName].filter(Boolean).join(' ')
)
const formattedAddress = computed(() => {
  const a = user.value?.address
  if (!a) return ''
  const line = [a.street, [a.postalCode, a.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  return line
})

function hydrate() {
  if (!user.value) return
  form.firstName = user.value.firstName || ''
  form.lastName = user.value.lastName || ''
  form.phone = user.value.phone || ''
  form.address.street = user.value.address?.street || ''
  form.address.city = user.value.address?.city || ''
  form.address.postalCode = user.value.address?.postalCode || ''
  form.address.country = user.value.address?.country || 'CZ'
  form.marketingConsent = !!user.value.marketingConsent
}

watch(user, hydrate, { immediate: true })

// --- SmartForm address autocomplete (instance "account") ---
const SF_FIELD_IDS = ['acc-street', 'acc-city', 'acc-postalCode']

// SmartForm writes the chosen address straight into the DOM inputs, bypassing
// v-model — so we read the DOM back into the reactive form.
const syncSmartform = () => {
  const s = document.getElementById('acc-street') as HTMLInputElement | null
  const c = document.getElementById('acc-city') as HTMLInputElement | null
  const z = document.getElementById('acc-postalCode') as HTMLInputElement | null
  if (s && s.value !== form.address.street) form.address.street = s.value
  if (c && c.value !== form.address.city) form.address.city = c.value
  if (z && z.value !== form.address.postalCode) form.address.postalCode = z.value
}

const initSmartform = () => {
  const sf = (window as any).smartform
  if (!sf) return
  sf.rebindAllForms()
  try {
    const instance = sf.getInstance('account')
    if (instance?.addressControl) {
      instance.addressControl.addValidationCallback(() => nextTick(syncSmartform))
    }
  } catch {
    // ignore
  }
}

const bindSmartform = () => {
  if (!import.meta.client) return
  const wait = () => {
    if ((window as any).smartform) initSmartform()
    else setTimeout(wait, 200)
  }
  wait()
  SF_FIELD_IDS.forEach((id) => document.getElementById(id)?.addEventListener('change', syncSmartform))
}

const unbindSmartform = () => {
  if (!import.meta.client) return
  SF_FIELD_IDS.forEach((id) => document.getElementById(id)?.removeEventListener('change', syncSmartform))
}

// Inputs only exist while editing (v-if); (re)bind once they're in the DOM.
watch(editing, (on) => {
  if (on) nextTick(bindSmartform)
  else unbindSmartform()
})

onBeforeUnmount(unbindSmartform)

function startEdit() {
  hydrate()
  error.value = ''
  editing.value = true
}

function cancelEdit() {
  hydrate()
  error.value = ''
  editing.value = false
}

async function onSave() {
  error.value = ''
  syncSmartform() // capture a value picked from the autocomplete but not yet in the model
  saving.value = true
  try {
    await updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      address: { street: form.address.street, city: form.address.city, postalCode: form.address.postalCode, country: form.address.country },
      marketingConsent: form.marketingConsent,
    })
    editing.value = false
  } catch (e: any) {
    error.value = e?.data?.message || 'Uložení se nezdařilo.'
  } finally {
    saving.value = false
  }
}
</script>
