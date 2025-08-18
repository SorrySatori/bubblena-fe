<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-md sticky top-0 z-40">
      <div class="container flex justify-between items-center p-4">
        <div>
          <NuxtLink to="/" class="flex items-center transition-opacity hover:opacity-90">
            <img src="~/assets/bubblena_logo_green.png" alt="Bubblena Logo" class="h-10 w-auto" />
          </NuxtLink>
        </div>
        <AppNavigation />
        <div class="flex gap-4">
          <button class="bg-transparent text-secondary border border-secondary px-4 py-2 rounded hover:bg-secondary hover:text-white transition-all">Přihlásit</button>
          <button class="bg-primary text-white border-none px-4 py-2 rounded hover:bg-accent transition-all hover:-translate-y-0.5">Registrovat</button>
        </div>
      </div>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="bg-secondary text-white py-12 pb-4">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-lg mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary">Bubblena</h3>
            <p class="mb-4 opacity-80">Váš oblíbený e-shop s bombami do koupele.</p>
          </div>
          
          <div>
            <h3 class="text-lg mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary">Odkazy</h3>
            <ul>
              <li class="mb-2"><NuxtLink to="/" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Domů</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/products" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Produkty</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/features" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Vlastnosti</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/about" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">O nás</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/contact" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Kontakt</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary">Sledujte nás</h3>
            <div class="flex gap-4">
              <a href="#" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Facebook</a>
              <a href="#" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Instagram</a>
              <a href="#" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">TikTok</a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-white/10 pt-4 text-center text-sm opacity-70">
          <p>&copy; {{ new Date().getFullYear() }} Bubblena. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout script
</script>

<style>
/* Global styles */
:root {
  --primary-color: #41b883;
  --secondary-color: #35495e;
  --accent-color: #00c58e;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: var(--dark-color);
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header styles */
.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.logo a {
  display: flex;
  align-items: center;
  transition: opacity 0.3s ease;
}

.logo a:hover {
  opacity: 0.9;
}

.logo-img {
  height: 40px;
  width: auto;
}

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

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.login-btn {
  background-color: transparent;
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: var(--secondary-color);
  color: white;
}

.signup-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.signup-btn:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
}

/* Main content */
.main {
  flex: 1;
}

/* Footer styles */
.footer {
  background-color: var(--secondary-color);
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  position: relative;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: var(--primary-color);
}

.footer-section p {
  margin-bottom: 1rem;
  opacity: 0.8;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.footer-section ul li a:hover {
  opacity: 1;
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.social-link:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .auth-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>
