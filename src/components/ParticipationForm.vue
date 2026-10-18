<template>
  <section
    class="participation-form-wrapper"
    :aria-labelledby="showTitle ? 'participation-form-title' : undefined"
    :aria-label="showTitle ? undefined : title"
  >
    <h2 v-if="showTitle" id="participation-form-title">
      {{ title }}
      <button
        class="participation-link-button"
        type="button"
        aria-label="Kopiera länk till deltagarformuläret"
        title="Kopiera länk till deltagarformuläret"
        @click="copyParticipationLink"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71m2.72 6.36a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71" />
        </svg>
      </button>
    </h2>
    <p v-if="copyStatus" class="participation-copy-status" aria-live="polite">{{ copyStatus }}</p>
    <p class="participation-form-intro">
      Du kan även tipsa oss om evenemang som inte finns med i kalendern. Skriv gärna datum och plats om du vet.
    </p>

    <form class="participation-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="participation-name">Namn</label>
        <input
          id="participation-name"
          v-model="formData.name"
          type="text"
          autocomplete="name"
          required
        />
      </div>

      <div class="form-group">
        <label for="participation-email">E-post</label>
        <input
          id="participation-email"
          v-model="formData.email"
          type="email"
          autocomplete="email"
        />
        <p class="form-help">
          E-post är frivillig och visas inte på hemsidan. Den används bara om styrelsen behöver kontakta dig.
        </p>
      </div>

      <div class="form-group">
        <label for="participation-events">Evenemang du planerar att delta i</label>
        <textarea
          id="participation-events"
          v-model="formData.events"
          rows="5"
          required
        ></textarea>
      </div>

      <div class="consent-group">
        <input
          id="participation-consent"
          v-model="formData.consent"
          type="checkbox"
          required
        />
        <label for="participation-consent">
          Jag godkänner att Östersund Triathlon publicerar mitt namn och att jag planerar att delta på evenemangets sida på hemsidan.
        </label>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Skickar...' : 'Skicka' }}
      </button>

      <p v-if="statusMessage" class="form-status" :class="statusType" role="status">
        {{ statusMessage }}
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getPageSettings } from '../utils/pageSettings'

const title = 'Berätta vilka evenemang du planerar att delta i'
const router = useRouter()
const copyStatus = ref('')
const formSubmitEndpoint = getPageSettings('participation-form').formSubmitToken

const props = defineProps({
  showTitle: {
    type: Boolean,
    default: true
  }
})

const formData = ref({
  name: '',
  email: '',
  events: '',
  consent: false
})
const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref('')

const copyParticipationLink = async () => {
  const participationUrl = new URL(
    router.resolve({ name: 'participation' }).href,
    window.location.href
  )
  participationUrl.searchParams.set('share', '1')

  try {
    await navigator.clipboard.writeText(participationUrl.href)
    copyStatus.value = 'Länken kopierades.'
  } catch {
    copyStatus.value = 'Kunde inte kopiera länken. Kontrollera webbläsarens behörigheter.'
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  statusMessage.value = ''

  try {
    if (!formSubmitEndpoint) {
      throw new Error('FormSubmit token is not configured')
    }

    const response = await fetch(`https://formsubmit.co/ajax/${formSubmitEndpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        events: formData.value.events,
        consent: formData.value.consent ? 'Ja' : 'Nej',
        _subject: 'Nya deltagarplaner från osdtri.se',
        _replyto: formData.value.email,
        _captcha: 'false'
      })
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok || result.success === false || result.success === 'false') {
      throw new Error(result.message || 'The email service returned an error')
    }

    formData.value = { name: '', email: '', events: '', consent: false }
    statusType.value = 'success'
    statusMessage.value = 'Tack! Dina evenemangsplaner har skickats.'
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = 'Dina evenemangsplaner kunde inte skickas. Försök igen senare.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.participation-form-wrapper {
  margin-top: 2rem;
}

.participation-form-wrapper h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  padding: 0.75rem 1.25rem;
  color: var(--club-charcoal);
  border-left: 5px solid var(--club-lime);
}

.participation-link-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.35rem;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--club-blue);
  cursor: pointer;
}

.participation-link-button:hover {
  background: rgb(40 123 159 / 10%);
}

.participation-link-button:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 2px;
}

.participation-link-button svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.participation-copy-status {
  margin: -0.5rem 0 0.75rem;
  color: var(--club-muted);
  font-size: 0.9rem;
}

.participation-form-intro {
  margin: 0 0 1rem;
  line-height: 1.8;
}

.participation-form {
  background: #ffffff;
  border-top: 3px solid var(--club-blue);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgb(32 37 42 / 10%);
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
  border-color: var(--club-blue);
  box-shadow: 0 0 0 3px rgb(85 182 220 / 20%);
}

.form-help {
  margin-top: 0.35rem;
  color: var(--club-muted);
  font-size: 0.85rem;
}

.consent-group {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
}

.consent-group input {
  flex: 0 0 auto;
  width: 1rem;
  height: 1rem;
  margin-top: 0.3rem;
  accent-color: var(--club-lime);
}

.consent-group label {
  font-weight: 500;
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
