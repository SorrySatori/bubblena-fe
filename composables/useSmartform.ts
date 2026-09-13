import { onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

/**
 * Loads the Smartform address autocomplete (našeptávač) on the current page
 * only. Call from pages/components that have address fields (checkout, účet).
 *
 * The client id must be registered through `smartform.beforeInit` BEFORE the
 * library executes. We set that hook from this module code and then append the
 * library script element – no inline <script>, so it works under the CSP
 * (nonce + strict-dynamic) without needing a nonce on client-side navigation.
 */
const SMARTFORM_SRC = 'https://client.smartform.cz/v2/smartform.js'

export const useSmartform = () => {
  const clientId = (useRuntimeConfig().public.smartformClientId as string) || ''

  onMounted(() => {
    if (!clientId) return
    const w = window as any

    w.smartform = w.smartform || {}
    w.smartform.beforeInit = function () {
      w.smartform.setClientId(clientId)
    }

    // Already on the page (client-side navigation back to a form) → just rebind.
    if (document.querySelector(`script[src="${SMARTFORM_SRC}"]`)) {
      w.smartform.rebindAllForms?.()
      return
    }

    const script = document.createElement('script')
    script.src = SMARTFORM_SRC
    script.async = true
    document.head.appendChild(script)
  })
}
