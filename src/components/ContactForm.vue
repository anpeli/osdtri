<template>
  <form class="contact-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="name">Namn</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
      />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
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

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Skickar...' : 'Skicka Meddelande' }}
    </button>

    <p v-if="statusMessage" class="form-status" :class="statusType" role="status">
      {{ statusMessage }}
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  message: ''
})
const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  statusMessage.value = ''

  try {
    const response = await fetch('https://formsubmit.co/ajax/andreas.lindstrom@gmail.com', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        message: formData.value.message,
        _subject: 'Nytt meddelande från osdtri.se',
        _replyto: formData.value.email,
        _captcha: 'false'
      })
    })

    if (!response.ok) {
      throw new Error('The email service returned an error')
    }

    formData.value = { name: '', email: '', message: '' }
    statusType.value = 'success'
    statusMessage.value = 'Tack för ditt meddelande!'
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = 'Meddelandet kunde inte skickas. Försök igen senare.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.form-status {
  margin-top: 1rem;
}

.form-status.success {
  color: #247a45;
}

.form-status.error {
  color: #b42318;
}
</style>
