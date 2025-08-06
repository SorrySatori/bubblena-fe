<template>
  <nav class="nav-links">
    <NuxtLink to="/" class="nav-link">Domů</NuxtLink>
    <NuxtLink to="/products" class="nav-link">Produkty</NuxtLink>
    <NuxtLink to="/features" class="nav-link">Vlastnosti</NuxtLink>
    <NuxtLink to="/about" class="nav-link">O nás</NuxtLink>
    <NuxtLink to="/contact" class="nav-link">Kontakt</NuxtLink>
  </nav>
</template>

<script setup>
// Navigation component
</script>

<style scoped>
.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--secondary-color);
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
