<template>
  <div class="about-page">
    <div class="page-header">
      <h1>About Bubblena</h1>
      <p>Learn more about our story and mission</p>
    </div>
    
    <div class="about-container">
      <div class="about-section">
        <h2>Our Story</h2>
        <p>
          Bubblena started as a passion project in 2025, born from the desire to create a modern, efficient, and user-friendly web application platform. Built on Vue3 and Nuxt4, Bubblena combines cutting-edge technology with intuitive design to deliver exceptional user experiences.
        </p>
        <p>
          What began as a simple idea has evolved into a comprehensive solution used by developers and businesses worldwide. Our journey is defined by continuous innovation, attention to detail, and a commitment to excellence.
        </p>
      </div>
      
      <div class="team-section">
        <h2>Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">JD</div>
            <h3>Jane Doe</h3>
            <p>Founder & Lead Developer</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">JS</div>
            <h3>John Smith</h3>
            <p>UX Designer</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">AS</div>
            <h3>Alice Smith</h3>
            <p>Backend Engineer</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">RJ</div>
            <h3>Robert Johnson</h3>
            <p>DevOps Specialist</p>
          </div>
        </div>
      </div>
      
      <div class="mission-section">
        <h2>Our Mission</h2>
        <div class="mission-content">
          <div class="mission-text">
            <p>
              At Bubblena, our mission is to simplify web development without compromising on performance or flexibility. We believe that creating beautiful, functional web applications should be accessible to developers of all skill levels.
            </p>
            <p>
              We are committed to:
            </p>
            <ul>
              <li>Maintaining a lightweight and efficient codebase</li>
              <li>Providing comprehensive documentation and support</li>
              <li>Fostering an inclusive community of developers</li>
              <li>Continuously improving and evolving with emerging technologies</li>
            </ul>
          </div>
          <div class="mission-image">
            <div class="image-placeholder">
              <div class="bubble bubble-1"></div>
              <div class="bubble bubble-2"></div>
              <div class="bubble bubble-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// About page script
</script>

<style scoped>
.about-page {
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

.about-container {
  max-width: 1000px;
  margin: 0 auto;
}

.about-section, .team-section, .mission-section {
  margin-bottom: 4rem;
}

.about-section h2, .team-section h2, .mission-section h2 {
  font-size: 2rem;
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  position: relative;
}

.about-section h2::after, .team-section h2::after, .mission-section h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.about-section p {
  margin-bottom: 1rem;
  line-height: 1.8;
  color: var(--dark-color);
}

/* Team section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.team-member {
  text-align: center;
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
}

.member-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.team-member h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.team-member p {
  font-size: 0.9rem;
  color: var(--dark-color);
  opacity: 0.7;
}

/* Mission section */
.mission-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.mission-text p {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.mission-text ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 1rem;
}

.mission-text li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.image-placeholder {
  width: 100%;
  height: 300px;
  background-color: var(--light-color);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

/* Animated bubbles */
.bubble {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  opacity: 0.7;
  animation: float 8s ease-in-out infinite;
}

.bubble-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 70px;
  height: 70px;
  top: 50%;
  right: 30%;
  animation-delay: 2s;
}

.bubble-3 {
  width: 50px;
  height: 50px;
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

@media (max-width: 768px) {
  .mission-content {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
