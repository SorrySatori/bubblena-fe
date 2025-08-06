<template>
  <div>
    <main>
      <div class="hero-section">
        <div class="hero-content">
          <h1><span class="brand">Bubblena</span></h1>
          <p class="tagline">Váš oblíbený e-shop s bombami do koupele</p>
          <div class="cta-buttons">
            <NuxtLink to="/products" class="cta-primary">Prohlédnout produkty</NuxtLink>
            <a href="#" class="cta-secondary">Dozvědět se více</a>
          </div>
        </div>
        <div class="hero-image">
          <div class="bubble bubble-1"></div>
          <div class="bubble bubble-2"></div>
          <div class="bubble bubble-3"></div>
        </div>
      </div>
      
      <div class="features-section">
        <h2>Naše přednosti</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🛁</div>
            <h3>Přírodní ingredience</h3>
            <p>Všechny naše produkty jsou vyrobeny z přírodních surovin</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌿</div>
            <h3>Bez testů na zvířatech</h3>
            <p>Jsme hrdí na etický přístup k výrobě kosmetiky</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎁</div>
            <h3>Ideální dárek</h3>
            <p>Naše bomby do koupele potěší každého milovníka relaxace</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// You can add your component logic here
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #343a40;
}

:root {
  --primary-color: #41b883;
  --secondary-color: #35495e;
  --accent-color: #00c58e;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
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
/* Page-specific styles */

/* Hero Section */
.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 600px;
  z-index: 2;
}

.brand {
  color: var(--primary-color);
  font-weight: 700;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
  font-weight: 800;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--dark-color);
  opacity: 0.8;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cta-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-primary:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cta-secondary {
  background-color: transparent;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.cta-secondary:hover {
  background-color: var(--secondary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animated bubbles */
.hero-image {
  position: relative;
  width: 40%;
  height: 100%;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  opacity: 0.7;
  animation: float 8s ease-in-out infinite;
}

.bubble-1 {
  width: 150px;
  height: 150px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 30%;
  animation-delay: 2s;
}

.bubble-3 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

/* Features Section */
.features-section {
  padding: 5rem 5%;
  text-align: center;
  background-color: white;
}

.features-section h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--secondary-color);
  position: relative;
}

.features-section h2::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background-color: var(--light-color);
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.feature-card p {
  color: var(--dark-color);
  opacity: 0.8;
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
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  
  .hero-content {
    max-width: 100%;
    margin-bottom: 3rem;
  }
  
  .hero-image {
    width: 100%;
    height: 300px;
  }
  
  .cta-buttons {
    justify-content: center;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  .tagline {
    font-size: 1.2rem;
  }
  
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
