<template>
  <div class="layout">
    <header class="header">
      <div class="container">
        <div class="logo">
          <NuxtLink to="/">
            <img src="~/assets/bubblena_logo_green.png" alt="Bubblena Logo" class="logo-img" />
          </NuxtLink>
        </div>
        <AppNavigation />
        <div class="auth-buttons">
          <button class="login-btn">Přihlásit</button>
          <button class="signup-btn">Registrovat</button>
        </div>
      </div>
    </header>
    
    <main class="main">
      <slot />
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Bubblena</h3>
            <p>Váš oblíbený e-shop s bombami do koupele.</p>
          </div>
          
          <div class="footer-section">
            <h3>Odkazy</h3>
            <ul>
              <li><NuxtLink to="/">Domů</NuxtLink></li>
              <li><NuxtLink to="/products">Produkty</NuxtLink></li>
              <li><NuxtLink to="/features">Vlastnosti</NuxtLink></li>
              <li><NuxtLink to="/about">O nás</NuxtLink></li>
              <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Sledujte nás</h3>
            <div class="social-links">
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">Instagram</a>
              <a href="#" class="social-link">TikTok</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
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
