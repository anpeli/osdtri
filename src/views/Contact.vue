<template>
  <div class="contact-page">
    <h1>Kontakt</h1>
    
    <div class="contact-info">
      <div class="info-item">
        <h3>Email</h3>
        <p><a href="mailto:info@osdtri.se">info@osdtri.se</a></p>
      </div>
      
      <div class="info-item">
        <h3>Besöksadress</h3>
        <p>Östersund, Sverige</p>
      </div>
    </div>

    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Namn</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required
        />
      </div>

      <div class="form-group">
        <label for="message">Meddelande</label>
        <textarea 
          id="message" 
          v-model="formData.message" 
          rows="5"
          required
        ></textarea>
      </div>

      <button type="submit">Skicka Meddelande</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = async () => {
  // Handle form submission (connect to backend/email service)
  console.log('Form submitted:', formData.value)
  alert('Tack för ditt meddelande!')
  formData.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
.contact-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.info-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6d4aff;
}
</style>
