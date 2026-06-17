<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-md sticky top-0 z-40 py-1">
      <div class="flex flex-wrap justify-between items-center p-4">
        <div class="flex items-center shrink-0">
          <NuxtLink to="/" class="flex items-center transition-opacity hover:opacity-90">
            <img src="~/assets/bubblena_logo_green.png" alt="Bubblena Logo" class="h-10 w-auto" />
          </NuxtLink>
        </div>
        
        <div class="order-3 lg:order-2 w-full lg:w-auto lg:flex-1 px-0 lg:px-2 mt-4 lg:mt-0">
          <AppNavigation />
        </div>
        
        <div class="order-2 lg:order-3 flex items-center gap-2 shrink-0">
          <ShoppingCart />
          <AuthMenu />
        </div>
      </div>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="bg-secondary text-white py-12 pb-4 relative overflow-hidden">
      <div class="container relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-lg mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary">Bubblena</h3>
            <p class="mb-4 opacity-80">Váš oblíbený e-shop s bombami do koupele.</p>
          </div>
          
          <div>
            <h3 class="text-lg mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary">Odkazy</h3>
            <ul>
              <li class="mb-2"><NuxtLink to="/" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Domů</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/bath-bombs" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Produkty</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/steamers" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Steamery</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/zachran-kouli" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Zachraň kouli</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/features" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Vlastnosti</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/about" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">O nás</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/contact" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Kontakt</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/obchodni-podminky" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Obchodní podmínky</NuxtLink></li>
              <li class="mb-2"><button type="button" @click="reopen" class="opacity-80 hover:opacity-100 hover:underline transition-opacity text-left">Nastavení cookies</button></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary">Sledujte nás</h3>
            <div class="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61580744706557" target="_blank" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Facebook</a>
              <a href="https://www.instagram.com/bubblena.cz/" target="_blank" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Instagram</a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-white/10 pt-4 text-center text-sm opacity-70">
          <p>&copy; {{ new Date().getFullYear() }} Bubblena. Všechna práva vyhrazena.</p>
        </div>
        
        <img src="~/assets/bubblena_logo_green.png" alt="Bubblena Logo" class="footer-logo-corner" />
      </div>
      
      <!-- Floating Particles in Footer - Above content -->
      <div class="particles-container absolute inset-0 z-20 pointer-events-none">
        <div class="particle absolute rounded-full bg-gradient-to-br from-pink-400 to-purple-400 opacity-20 w-[60px] h-[60px] pointer-events-auto" style="left: 10%; top: 10%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 w-[50px] h-[50px] pointer-events-auto" style="left: 85%; top: 15%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 opacity-20 w-[55px] h-[55px] pointer-events-auto" style="left: 70%; top: 55%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 w-[65px] h-[65px] pointer-events-auto" style="left: 15%; top: 40%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 opacity-20 w-[45px] h-[45px] pointer-events-auto" style="left: 40%; top: 65%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-20 w-[58px] h-[58px] pointer-events-auto" style="left: 55%; top: 25%;"></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import ShoppingCart from '~/components/ShoppingCart.vue';

// Initialize bubble physics animation
useBubblePhysics('footer', '.particle');

// Let users re-open the cookie banner to change their choice.
const { reopen } = useConsent();
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

.footer-logo-corner {
  position: absolute;
  bottom: 40px;
  right: 40px;
  height: 75px;
  width: auto;
  opacity: 0.8;
  z-index: 10;
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

/* Floating animation for particles */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Particle hover effects */
.particle {
  cursor: default;
  pointer-events: auto;
  will-change: transform, opacity;
  /* Initial floating state - bubbles start elevated */
  transform: translateY(-30px);
  opacity: 0.2;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

/* Hide particles on mobile devices */
@media (max-width: 768px) {
  .particles-container {
    display: none;
  }
}

/* Animation delays */
.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-4000 {
  animation-delay: 4s;
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
  
  .footer-logo-corner {
    position: static;
    height: 80px;
    margin: 2rem auto 0;
    display: block;
    opacity: 0.8;
  }
}
</style>
