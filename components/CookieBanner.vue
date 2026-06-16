<template>
    <div
      v-if="ready && !hasDecided"
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-4 z-50"
    >
      <div class="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p class="text-gray-800 text-sm leading-snug">
          Bubbleně stačí ke svačině obyčejné, nezbytně nutné sušenky, které zajišťují
          správné fungování webu a udržují bubliny na svých místech — ty běží vždy.
          Navíc si s vaším svolením může zapamatovat <strong>naposledy prohlížené produkty</strong>,
          ať je příště rychle najdete. Žádná analytika, marketing ani sledování. Volba je na vás.
        </p>

        <div class="flex gap-3">
          <button
            @click="accept"
            class="bg-black text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
          >
            Přijmout
          </button>

          <button
            @click="reject"
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm whitespace-nowrap"
          >
            Odmítnout
          </button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from "vue"
  import { useConsent } from "~/composables/useConsent"
  import { useRecentlyViewed } from "~/composables/useRecentlyViewed"

  const { hasDecided, acceptAll, rejectAll } = useConsent()
  const { load, clear } = useRecentlyViewed()

  // Render only after mount so the banner's visibility matches the
  // client-hydrated consent value (avoids SSR hydration mismatch).
  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })

  const accept = () => {
    acceptAll()
    load()
  }

  const reject = () => {
    rejectAll()
    clear()
  }
  </script>
