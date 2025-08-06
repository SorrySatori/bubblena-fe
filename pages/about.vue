<template>
  <div class="about-page">
    <div class="page-header">
      <h1>O Bubblena</h1>
      <p>Poznejte náš příběh a poslání</p>
    </div>
    
    <div class="about-container">
      <div class="about-section">
        <h2>Náš příběh</h2>
        <p>
          Bubblena začala jako malý rodinný podnik v roce 2020, kdy naše zakladatelka Barbora objevila své nadšení pro výrobu přírodní kosmetiky. Začala experimentovat s bombami do koupele ve své kuchyni a brzy si získala věrnou základnu zákazníků mezi přáteli a rodinou.
        </p>
        <p>
          Co začalo jako koníček, se rychle rozrostlo v prosperující podnik. Dnes máme vlastní výrobní prostory v Praze a naše produkty doručujeme zákazníkům po celé České republice. Naše cesta je definována neustálou inovací, pozorností k detailům a závazkem k výjimečnosti.
        </p>
      </div>
      
      <div class="team-section">
        <h2>Náš tým</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">BN</div>
            <h3>Barbora Nováková</h3>
            <p>Zakladatelka & hlavní vývojářka</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">JK</div>
            <h3>Jan Kovář</h3>
            <p>Kreativní ředitel</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">MH</div>
            <h3>Martina Horáková</h3>
            <p>Vedoucí výroby</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">PV</div>
            <h3>Petr Veselý</h3>
            <p>Marketingový specialista</p>
          </div>
        </div>
      </div>
      
      <div class="mission-section">
        <h2>Naše poslání</h2>
        <div class="mission-content">
          <div class="mission-text">
            <p>
              V Bubblena je naším posláním vytvářet vysoce kvalitní a přírodní bomby do koupele, které nabízejí výjimečný relaxační zážitek. Věříme, že péče o tělo by měla být příjemným ritualem, který prospívá tělu i mysli.
            </p>
            <p>
              Zavázali jsme se k:
            </p>
            <ul>
              <li>Používání výhradně přírodních a eticky získaných ingrediencí</li>
              <li>Udržitelné výrobě a ekologickému balení</li>
              <li>Podporování místních dodavatelů a řemeslníků</li>
              <li>Neustálému zlepšování našich receptů a výrobních postupů</li>
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
