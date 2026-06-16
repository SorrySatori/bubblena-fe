import { useHead, useRuntimeConfig } from '#imports'

/**
 * Loads the Smartform address autocomplete (našeptávač) script on the current
 * page only. Call from pages/components that have address fields (checkout,
 * účet) so the third-party script isn't pulled on every page of the site.
 *
 * The init snippet must run before the library so `setClientId` is registered
 * via Smartform's `beforeInit` hook; `tagPriority` keeps it ahead of the lib.
 */
export const useSmartform = () => {
  const clientId = useRuntimeConfig().public.smartformClientId || ''

  useHead({
    script: [
      {
        key: 'smartform-init',
        type: 'text/javascript',
        tagPriority: 'critical',
        innerHTML: `var smartform = smartform || {}; smartform.beforeInit = function() { smartform.setClientId('${clientId}'); };`,
      },
      {
        key: 'smartform-lib',
        src: 'https://client.smartform.cz/v2/smartform.js',
        type: 'text/javascript',
        async: true,
      },
    ],
  })
}
