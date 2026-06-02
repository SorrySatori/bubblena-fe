<template>
  <div v-if="enabled" ref="btnEl" class="flex justify-center"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{ credential: [string] }>()

const config = useRuntimeConfig()
const clientId = config.public.googleClientId as string
// Gated: when no client id is configured, the button simply doesn't render.
const enabled = !!clientId
const btnEl = ref<HTMLElement | null>(null)

const GSI_SRC = 'https://accounts.google.com/gsi/client'

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts?.id) return resolve()
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('GSI load failed')))
      return
    }
    const s = document.createElement('script')
    s.src = GSI_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('GSI load failed'))
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  if (!enabled) return
  try {
    await loadScript()
    const google = (window as any).google
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential: string }) => {
        if (response?.credential) emit('credential', response.credential)
      },
    })
    if (btnEl.value) {
      google.accounts.id.renderButton(btnEl.value, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        locale: 'cs',
        width: 320,
      })
    }
  } catch (err) {
    console.error('Google Sign-In init error:', err)
  }
})
</script>
