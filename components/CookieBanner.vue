<template>
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-4 z-50"
    >
      <div class="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p class="text-gray-800 text-sm leading-snug">
          Bubbleně stačí ke svačině pouze obyčejné, nezbytně nutné sušenky, které zajišťují 
          správné fungování webu a udržují všechny bubliny na správných místech.
          Nepoužívá žádné analytické, marketingové ani sledovací cookies, takže žádný stress.  
          Pokračováním můžete přijmout nebo odmítnout jejich použití.
        </p>
  
        <div class="flex gap-3">
          <button
            @click="acceptCookies"
            class="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            Přijmout
          </button>
  
          <button
            @click="rejectCookies"
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm"
          >
            Odmítnout
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue"
  
  const showBanner = ref(false)
  
  onMounted(() => {
    const stored = localStorage.getItem("cookiesConsent")
    showBanner.value = !stored
  })
  
  const acceptCookies = () => {
    localStorage.setItem("cookiesConsent", "accepted")
    showBanner.value = false
  }
  
  const rejectCookies = () => {
    localStorage.setItem("cookiesConsent", "rejected")
    showBanner.value = false
  }
  </script>
  