import { onMounted, onUnmounted } from 'vue';

interface Particle {
  element: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  radius: number;
  floatPhase: number;
  floatSpeed: number;
  isHit: boolean;
  hitTime: number;
}

export function useBubblePhysics(containerSelector: string, particleSelector: string) {
  let particleElements: HTMLElement[] = [];
  let particles: Particle[] = [];
  let animationFrameId: number | null = null;
  let mouseX: number | null = null;
  let mouseY: number | null = null;
  let footerRect: DOMRect | null = null;

  onMounted(() => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && particles.length === 0) {
          initializeParticles();
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(container);

    function initializeParticles() {
      particleElements = Array.from(document.querySelectorAll(particleSelector));
      console.log('Found particles:', particleElements.length);

      if (particleElements.length > 0) {
        footerRect = container.getBoundingClientRect();

        particleElements.forEach((particle) => {
          const particleRect = particle.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          const relativeX = particleRect.left - containerRect.left + particleRect.width / 2;
          const relativeY = particleRect.top - containerRect.top + particleRect.height / 2;
          
          const initialFloatY = -20 - Math.random() * 30;
          const initialFloatX = (Math.random() - 0.5) * 20;
          
          const floatOffset = 30 + Math.random() * 20;
          
          particles.push({
            element: particle,
            x: initialFloatX,
            y: initialFloatY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            originalX: relativeX,
            originalY: relativeY - floatOffset,
            radius: particleRect.width / 2,
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: 0.005 + Math.random() * 0.005,
            isHit: false,
            hitTime: 0
          });
          particle.style.animation = 'none';
          particle.style.transform = `translate(${initialFloatX}px, ${initialFloatY}px)`;
          particle.style.opacity = '0.2';
        });
        container.addEventListener('mousemove', (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        });

        container.addEventListener('mouseleave', () => {
          mouseX = null;
          mouseY = null;
        });

        // Start physics simulation
        animate();

        console.log('Physics simulation started');
      }
    }
  });

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  function animate() {
    if (footerRect) {
      const container = document.querySelector(containerSelector) as HTMLElement;
      if (container) {
        footerRect = container.getBoundingClientRect();
      }
    }

    particles.forEach((particle) => {
      // Calculate current position relative to footer (not viewport)
      const particleRect = particle.element.getBoundingClientRect();
      const currentX = particleRect.left - (footerRect?.left || 0) + particleRect.width / 2;
      const currentY = particleRect.top - (footerRect?.top || 0) + particleRect.height / 2;

      // Physics constants
      const damping = 0.98;
      const springStrength = 0.002;
      const repulsionForce = 5;
      const bounceRestitution = 0.8;
      const ambientForce = 0.15;

      // Only apply ambient floating and spring force if particle is not flying from a hit
      if (!particle.isHit) {
        // Ambient floating motion
        particle.floatPhase += particle.floatSpeed;
        const floatX = Math.sin(particle.floatPhase) * ambientForce;
        const floatY = Math.cos(particle.floatPhase * 1.3) * ambientForce;

        particle.vx += floatX;
        particle.vy += floatY;

        // Very weak spring force
        const springX = (particle.originalX - currentX) * springStrength;
        const springY = (particle.originalY - currentY) * springStrength;

        particle.vx += springX;
        particle.vy += springY;
      }

      // Mouse repulsion (only when directly over particle)
      if (mouseX !== null && mouseY !== null && footerRect) {
        // Convert mouse position to footer-relative coordinates
        const mouseXRelative = mouseX - footerRect.left;
        const mouseYRelative = mouseY - footerRect.top;
        
        const deltaX = currentX - mouseXRelative;
        const deltaY = currentY - mouseYRelative;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < particle.radius) {
          const force = repulsionForce * (1 - distance / particle.radius);
          particle.vx += (deltaX / distance) * force * 2;
          particle.vy += (deltaY / distance) * force * 2;
          particle.isHit = true;
          particle.hitTime = Date.now();
        }
      }

      // Apply damping
      particle.vx *= damping;
      particle.vy *= damping;

      particle.x += particle.vx * 0.5;
      particle.y += particle.vy * 0.5;

      if (footerRect) {
        const futureX = particle.originalX + particle.x;
        const futureY = particle.originalY + particle.y;

        let bounced = false;

        if (futureX - particle.radius < 0) {
          particle.x = 0 - particle.originalX + particle.radius;
          particle.vx *= -bounceRestitution;
          bounced = true;
        } else if (futureX + particle.radius > footerRect.width) {
          particle.x = footerRect.width - particle.originalX - particle.radius;
          particle.vx *= -bounceRestitution;
          bounced = true;
        }

        if (futureY - particle.radius < 0) {
          particle.y = 0 - particle.originalY + particle.radius;
          particle.vy *= -bounceRestitution;
          bounced = true;
        } else if (futureY + particle.radius > footerRect.height) {
          particle.y = footerRect.height - particle.originalY - particle.radius;
          particle.vy *= -bounceRestitution;
          bounced = true;
        }

        if (bounced && particle.isHit) {
          particle.isHit = false;
        }
      }

      particles.forEach((otherParticle) => {
        if (otherParticle === particle) return;

        const otherRect = otherParticle.element.getBoundingClientRect();
        const otherX = otherRect.left - (footerRect?.left || 0) + otherRect.width / 2;
        const otherY = otherRect.top - (footerRect?.top || 0) + otherRect.height / 2;

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

  return {
    particles
  };
}
