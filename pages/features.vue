<template>
  <div class="features-page">
    <div class="page-header">
      <h1>Features</h1>
      <p>Discover what makes Bubblena special</p>
    </div>
    
    <div class="features-container">
      <div class="feature-item">
        <div class="feature-icon">🚀</div>
        <div class="feature-content">
          <h2>Lightning Fast Performance</h2>
          <p>Built with Vue3 and Nuxt4, Bubblena delivers exceptional speed and responsiveness. The optimized build process ensures minimal load times and smooth user experiences across all devices.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🛠️</div>
        <div class="feature-content">
          <h2>Easy Customization</h2>
          <p>Bubblena's modular architecture makes it simple to customize and extend. With clean component separation and intuitive styling options, you can adapt the platform to your specific needs without hassle.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">📱</div>
        <div class="feature-content">
          <h2>Responsive Design</h2>
          <p>Every element of Bubblena is designed to work flawlessly across all screen sizes and devices. From mobile phones to large desktop monitors, your content will always look its best.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🔒</div>
        <div class="feature-content">
          <h2>Built-in Security</h2>
          <p>Security is a priority with Bubblena. The platform includes robust authentication systems, data encryption, and protection against common web vulnerabilities.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">📊</div>
        <div class="feature-content">
          <h2>Advanced Analytics</h2>
          <p>Gain valuable insights with Bubblena's integrated analytics. Track user behavior, monitor performance metrics, and make data-driven decisions to optimize your application.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🔄</div>
        <div class="feature-content">
          <h2>Seamless Integration</h2>
          <p>Connect Bubblena with your favorite tools and services. The platform offers straightforward integration with popular APIs, databases, and third-party services.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Features page script
</script>

<style scoped>
.features-page {
  padding: 2rem 5%;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.2rem;
  color: var(--dark-color);
  opacity: 0.7;
}

.features-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  background-color: var(--light-color);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
}

.feature-content h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--secondary-color);
}

.feature-content p {
  color: var(--dark-color);
  opacity: 0.8;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-container {
    grid-template-columns: 1fr;
  }
  
  .feature-item {
    flex-direction: column;
  }
  
  .feature-icon {
    margin-right: 0;
    margin-bottom: 1rem;
    justify-content: center;
  }
}
</style>
