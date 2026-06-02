<template>
  <div class="flex items-center gap-1.5">
    <template v-if="loggedIn">
      <NuxtLink to="/ucet"
        class="bg-transparent text-secondary border border-secondary px-3 py-1.5 rounded text-sm hover:bg-secondary hover:text-white transition-all whitespace-nowrap">
        Můj účet
      </NuxtLink>
      <button @click="onLogout"
        class="bg-primary text-white border-none px-3 py-1.5 rounded text-sm hover:bg-accent transition-all whitespace-nowrap">
        Odhlásit
      </button>
    </template>
    <template v-else>
      <NuxtLink to="/prihlaseni"
        class="bg-transparent text-secondary border border-secondary px-3 py-1.5 rounded text-sm hover:bg-secondary hover:text-white transition-all whitespace-nowrap">
        Přihlásit
      </NuxtLink>
      <NuxtLink to="/registrace"
        class="bg-primary text-white border-none px-3 py-1.5 rounded text-sm hover:bg-accent transition-all hover:-translate-y-0.5 whitespace-nowrap">
        Registrovat
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, logout } = useAuth()

async function onLogout() {
  await logout()
  await navigateTo('/')
}
</script>
