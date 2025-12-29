<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-md sticky top-0 z-40 py-1">
      <div class="container flex flex-wrap justify-between items-center p-4">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center transition-opacity hover:opacity-90">
            <img src="~/assets/bubblena_logo_green.png" alt="Bubblena Logo" class="h-10 w-auto" />
          </NuxtLink>
        </div>
        
        <div class="order-3 lg:order-2 w-full lg:w-auto lg:flex-1 px-0 lg:px-8 mt-4 lg:mt-0">
          <AppNavigation />
        </div>
        
        <div class="order-2 lg:order-3 flex items-center gap-4">
          <ShoppingCart />
          <div class="hidden lg:flex gap-2">
            <button class="bg-transparent text-secondary border border-secondary px-4 py-2 rounded hover:bg-secondary hover:text-white transition-all">Přihlásit</button>
            <button class="bg-primary text-white border-none px-4 py-2 rounded hover:bg-accent transition-all hover:-translate-y-0.5">Registrovat</button>
          </div>
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
              <li class="mb-2"><NuxtLink to="/features" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Vlastnosti</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/about" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">O nás</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/contact" class="opacity-80 hover:opacity-100 hover:underline transition-opacity">Kontakt</NuxtLink></li>
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
      <div class="absolute inset-0 z-20 pointer-events-none">
        <div class="particle absolute rounded-full bg-gradient-to-br from-pink-400 to-purple-400 opacity-20 w-[60px] h-[60px] pointer-events-auto" style="left: 10%; top: 20%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 w-[50px] h-[50px] pointer-events-auto" style="left: 85%; top: 30%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 opacity-20 w-[55px] h-[55px] pointer-events-auto" style="left: 70%; top: 70%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 w-[65px] h-[65px] pointer-events-auto" style="left: 15%; top: 60%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 opacity-20 w-[45px] h-[45px] pointer-events-auto" style="left: 40%; top: 80%;"></div>
        <div class="particle absolute rounded-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-20 w-[58px] h-[58px] pointer-events-auto" style="left: 55%; top: 40%;"></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import ShoppingCart from '~/components/ShoppingCart.vue';
import { onMounted, nextTick, onUnmounted } from 'vue';

let particleElements = [];
let particles = []; // Physics data for each particle
let animationFrameId = null;
let mouseX = null;
let mouseY = null;
let footerRect = null;

onMounted(async () => {
  await nextTick();
  
  setTimeout(() => {
    const footer = document.querySelector('footer');
    particleElements = Array.from(document.querySelectorAll('.particle'));
    console.log('Found particles:', particleElements.length);
    
    if (footer && particleElements.length > 0) {
      footerRect = footer.getBoundingClientRect();
      
      // Initialize physics data for each particle
      particleElements.forEach((particle, index) => {
        const rect = particle.getBoundingClientRect();
        particles.push({
          element: particle,
          x: 0, // Current offset from original position
          y: 0,
          vx: (Math.random() - 0.5) * 2, // Random initial velocity for visible floating
          vy: (Math.random() - 0.5) * 2,
          originalX: rect.left + rect.width / 2,
          originalY: rect.top + rect.height / 2,
          radius: rect.width / 2,
          floatPhase: Math.random() * Math.PI * 2, // Random phase for floating
          floatSpeed: 0.005 + Math.random() * 0.005, // Random float speed (increased)
          isHit: false, // Track if particle was recently hit by mouse
          hitTime: 0 // Time when particle was hit
        });
        // Disable CSS animation
        particle.style.animation = 'none';
      });
      
      // Mouse tracking
      footer.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
      
      footer.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
      });
      
      // Start physics simulation
      animate();
      
      console.log('Physics simulation started');
    }
  }, 500);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});

function animate() {
  particles.forEach((particle) => {
    const rect = particle.element.getBoundingClientRect();
    const currentX = rect.left + rect.width / 2;
    const currentY = rect.top + rect.height / 2;
    
    // Physics constants - adjusted for slow zero-gravity feel
    const damping = 0.98; // Less friction for smoother floating
    const springStrength = 0.002; // Very weak pull for gentle drift
    const repulsionForce = 5; // Slower repulsion
    const bounceRestitution = 0.8; // More bouncy
    const ambientForce = 0.15; // Stronger ambient floating force for visible movement
    
    // Only apply ambient floating and spring force if particle is not flying from a hit
    if (!particle.isHit) {
      // Ambient floating motion (like zero gravity drift)
      particle.floatPhase += particle.floatSpeed;
      const floatX = Math.sin(particle.floatPhase) * ambientForce;
      const floatY = Math.cos(particle.floatPhase * 1.3) * ambientForce;
      
      particle.vx += floatX;
      particle.vy += floatY;
      
      // Very weak spring force (gentle drift back)
      const springX = (particle.originalX - currentX) * springStrength;
      const springY = (particle.originalY - currentY) * springStrength;
      
      particle.vx += springX;
      particle.vy += springY;
    }
    
    // Mouse repulsion (only when directly over particle)
    if (mouseX !== null && mouseY !== null) {
      const deltaX = currentX - mouseX;
      const deltaY = currentY - mouseY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Only apply force if mouse is directly over the particle
      if (distance < particle.radius) {
        const force = repulsionForce * (1 - distance / particle.radius);
        // Apply strong impulse when hit
        particle.vx += (deltaX / distance) * force * 2;
        particle.vy += (deltaY / distance) * force * 2;
        particle.isHit = true;
        particle.hitTime = Date.now();
      }
    }
    
    // Apply damping
    particle.vx *= damping;
    particle.vy *= damping;
    
    // Update position with slower movement (slo-mo effect)
    particle.x += particle.vx * 0.5;
    particle.y += particle.vy * 0.5;
    
    // Bounce off footer boundaries
    if (footerRect) {
      const futureX = particle.originalX + particle.x;
      const futureY = particle.originalY + particle.y;
      
      let bounced = false;
      
      // Left/Right boundaries
      if (futureX - particle.radius < footerRect.left) {
        particle.x = footerRect.left - particle.originalX + particle.radius;
        particle.vx *= -bounceRestitution;
        bounced = true;
      } else if (futureX + particle.radius > footerRect.right) {
        particle.x = footerRect.right - particle.originalX - particle.radius;
        particle.vx *= -bounceRestitution;
        bounced = true;
      }
      
      // Top/Bottom boundaries
      if (futureY - particle.radius < footerRect.top) {
        particle.y = footerRect.top - particle.originalY + particle.radius;
        particle.vy *= -bounceRestitution;
        bounced = true;
      } else if (futureY + particle.radius > footerRect.bottom) {
        particle.y = footerRect.bottom - particle.originalY - particle.radius;
        particle.vy *= -bounceRestitution;
        bounced = true;
      }
      
      // Reset hit state after bouncing off wall
      if (bounced && particle.isHit) {
        particle.isHit = false;
      }
    }
    
    // Check collisions with other particles
    particles.forEach((otherParticle, otherIndex) => {
      if (otherParticle === particle) return;
      
      const otherRect = otherParticle.element.getBoundingClientRect();
      const otherX = otherRect.left + otherRect.width / 2;
      const otherY = otherRect.top + otherRect.height / 2;
      
      const dx = currentX - otherX;
      const dy = currentY - otherY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = particle.radius + otherParticle.radius;
      
      if (distance < minDistance && distance > 0) {
        const nx = dx / distance;
        const ny = dy / distance;
        
        const overlap = minDistance - distance;
        const separationX = nx * overlap * 0.5;
        const separationY = ny * overlap * 0.5;
        
        particle.x += separationX;
        particle.y += separationY;
        otherParticle.x -= separationX;
        otherParticle.y -= separationY;
        
        const dvx = particle.vx - otherParticle.vx;
        const dvy = particle.vy - otherParticle.vy;
        
        const dvn = dvx * nx + dvy * ny;
        
        if (dvn < 0) {
          const impulse = (2 * dvn) / 2;
          
          particle.vx -= impulse * nx * bounceRestitution;
          particle.vy -= impulse * ny * bounceRestitution;
          otherParticle.vx += impulse * nx * bounceRestitution;
          otherParticle.vy += impulse * ny * bounceRestitution;
          
          if (particle.isHit) {
            particle.isHit = false;
          }
          if (otherParticle.isHit) {
            otherParticle.isHit = false;
          }
        }
      }
    });
    
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    const scale = 1 + Math.min(speed * 0.02, 0.3);
    particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${scale})`;
    particle.element.style.opacity = `${0.2 + Math.min(speed * 0.05, 0.3)}`;
  });
  
  animationFrameId = requestAnimationFrame(animate);
}
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
