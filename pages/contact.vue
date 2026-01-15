<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const status = ref("")

const handleSubmit = async () => {
  try {
    const response = await $fetch('/api/contact', {
      method: "POST",
      body: { 
        name: form.value.name, 
        email: form.value.email, 
        subject: form.value.subject, 
        message: form.value.message 
      }
    })
    if (response.success) {
      status.value = "Zpráva byla úspěšně odeslána."
      // Reset form after successful submission
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  } catch (err) {
    console.error('Error sending message:', err)
    status.value = "Došlo k chybě při odesílání."
  }
}
  

</script>


<template>
  <div class="contact-page">
    <div class="page-header">
      <h1>Kontaktujte nás</h1>
      <p>Spojte se s týmem Bubblena</p>
    </div>
    
    <div class="contact-container">
      <div class="contact-form-section">
        <h2>Pošlete nám zprávu</h2>
        <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Jméno</label>
            <input type="text" id="name" v-model="form.name" placeholder="Vaše jméno" required />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" placeholder="Váš email" required />
          </div>
          
          <div class="form-group">
            <label for="subject">Předmět</label>
            <input type="text" id="subject" v-model="form.subject" placeholder="Předmět zprávy" required />
          </div>
          
          <div class="form-group">
            <label for="message">Zpráva</label>
            <textarea id="message" v-model="form.message" placeholder="Vaše zpráva" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-button">Odeslat zprávu</button>
          <div v-if="status" class="status-message" :class="{ 'success': status.includes('úspěšně'), 'error': status.includes('chybě') }">
            {{ status }}
          </div>
        </form>
      </div>
      
      <div class="contact-info-section">
        <h2>Kontaktní informace</h2>
        <div class="info-item">
          <div class="info-icon">📍</div>
          <div>
            <h3>Adresa</h3>
            <p>Pobialova 23</p>
            <p>70200 Ostrava</p>
          </div>
        </div>
        
        <!-- <div class="info-item">
          <div class="info-icon">📞</div>
          <div>
            <h3>Telefon</h3>
            <p>+420 123 456 789</p>
          </div>
        </div> -->
        <div class="info-item">
          <div class="info-icon">✉️</div>
          <div>
            <h3>Email</h3>
            <p>info@bubblena.cz</p>
            <p>objednavky@bubblena.cz</p>
          </div>
        </div>
        
        <div class="social-links">
          <h3>Sledujte nás</h3>
          <div class="social-icons">
            <a href="https://www.facebook.com/profile.php?id=61580744706557" target="_blank" class="social-icon">
              <span>Facebook</span>
            </a>
            <a href="https://www.instagram.com/bubblena.cz/" target="_blank" class="social-icon">
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
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

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-form-section h2,
.contact-info-section h2 {
  font-size: 1.8rem;
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  position: relative;
}

.contact-form-section h2::after,
.contact-info-section h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

/* Form styles */
.contact-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-color);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  outline: none;
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: var(--accent-color);
}

/* Contact info styles */
.info-item {
  display: flex;
  margin-bottom: 1.5rem;
}

.info-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.info-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.info-item p {
  margin: 0;
  line-height: 1.5;
  color: var(--dark-color);
}

/* Social links */
.social-links {
  margin-top: 2rem;
}

.social-links h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  padding: 0.5rem 1rem;
  background-color: var(--light-color);
  border-radius: 4px;
  color: var(--secondary-color);
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.social-icon:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-3px);
}

/* Status message styles */
.status-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style>
