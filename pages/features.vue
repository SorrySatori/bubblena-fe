<template>
  <div class="features-page">
    <div class="page-header">
      <h1>Vlastnosti</h1>
      <p>Objevte, co dělá Bubblena výjimečnou</p>
    </div>
    
    <div class="features-container">
      <div class="feature-item">
        <div class="feature-icon">🌿</div>
        <div class="feature-content">
          <h2>Přírodní ingredience</h2>
          <p>Naše bomby do koupele jsou vyrobené výhradně z přírodních surovin. Používáme jen to nejlepší, aby vaše pokožka dostala tu nejkvalitnější péči bez zbytečných chemikálií.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🛁</div>
        <div class="feature-content">
          <h2>Dlouhotrvající aroma</h2>
          <p>Naše bomby do koupele jsou navržené tak, aby uvolňovaly své aroma postupně. Díky tomu si můžete užít relaxační koupel s vůní, která vydrží po celou dobu vašeho odpočinku.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🌈</div>
        <div class="feature-content">
          <h2>Pestrobarevné efekty</h2>
          <p>Koupel s našimi bombami je zážitek i pro oči. Sledujte, jak se ve vodě rozpouští a vytvářejí okouzlující barevné vzory, které promění vaši koupel v umělecké dílo.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">💕</div>
        <div class="feature-content">
          <h2>Péče o pokožku</h2>
          <p>Naše bomby do koupele obsahují vysoce kvalitní oleje a másla, která pečují o vaši pokožku. Po koupeli bude vaše kůže jemná, hydratovaná a výživně ošetřená.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🎁</div>
        <div class="feature-content">
          <h2>Luxusní dárkové balení</h2>
          <p>Hledáte originální dárek? Naše bomby do koupele nabízíme v elegantním dárkovém balení, které potěší každého milovníka relaxace a péče o tělo.</p>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">💚</div>
        <div class="feature-content">
          <h2>Ekologické balení</h2>
          <p>Záleží nám na životním prostředí, proto jsou všechny naše obaly recyklovatelné nebo biologicky rozložitelné. Užijte si své bomby do koupele s čistým svědomím.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Naše přednosti',
  description: 'Proč Bubblena: přírodní ingredience, výroba bez testů na zvířatech a bomby do koupele, které potěší. Zjistěte, čím se lišíme.'
})
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
