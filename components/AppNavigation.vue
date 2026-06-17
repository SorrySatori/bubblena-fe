<template>
  <div class="relative w-full">
    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex gap-8 w-full justify-center">
      <NuxtLink v-for="(item, index) in navItems" :key="index" :to="item.path"
        class="nav-link text-secondary font-medium text-lg px-4 py-2 relative transition-all duration-300 hover:text-primary">
        {{ item.name }}
      </NuxtLink>
    </nav>

    <!-- Mobile Navigation Button -->
    <div class="lg:hidden flex justify-end w-full">
      <button @click="toggleMobileNav"
        :aria-label="mobileNavOpen ? 'Zavřít menu' : 'Otevřít menu'" :aria-expanded="mobileNavOpen"
        class="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors z-50 relative">
        <div class="w-6 flex flex-col gap-1 items-center" :class="{ 'hamburger-active': mobileNavOpen }">
          <span class="hamburger-line" aria-hidden="true"></span>
          <span class="hamburger-line" aria-hidden="true"></span>
          <span class="hamburger-line" aria-hidden="true"></span>
        </div>
      </button>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-if="mobileNavOpen" 
      class="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col items-center gap-8 w-full px-6">
        <NuxtLink v-for="(item, index) in navItems" :key="index" :to="item.path"
          @click="closeMobileNav"
          class="text-secondary text-xl font-medium w-full text-center py-4 border-b border-gray-100 transition-colors hover:text-primary">
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const mobileNavOpen = ref(false);

const navItems = [
  { name: 'Domů', path: '/' },
  { name: 'Bomby do koupele', path: '/bath-bombs' },
  { name: 'Steamery', path: '/steamers' },
  { name: 'Zachraň kouli', path: '/zachran-kouli' },
  { name: 'O nás', path: '/about' },
  { name: 'Kontakt', path: '/contact' }
];

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
  // Prevent scrolling when mobile nav is open
  if (mobileNavOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileNav = () => {
  mobileNavOpen.value = false;
  document.body.style.overflow = '';
};
</script>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: var(--color-primary, #41b883);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover::after {
  width: 80%;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #35495e;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.hamburger-active .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.hamburger-active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.hamburger-active .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
