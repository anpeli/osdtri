<template>
  <article class="event-card">
    <div class="event-content">
      <p class="event-date">{{ formatDate(event.date) }}<span v-if="event.time">, {{ event.time }}</span><span v-if="event.duration">, {{ event.duration }}</span><span v-if="event.location">, {{ event.location }}</span></p>
      <h3 class="event-title">
        <router-link
          v-if="linkTitle"
          :to="{ name: 'event', params: { slug: event.slug } }"
        >
          {{ event.title }}
        </router-link>
        <template v-else>{{ event.title }}</template>
        <button
          class="event-link-button"
          type="button"
          aria-label="Kopiera länk till händelsen"
          title="Kopiera länk till händelsen"
          @click="copyEventLink"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71m2.72 6.36a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71" />
          </svg>
        </button>
      </h3>
      <p v-if="copyStatus" class="event-copy-status" aria-live="polite">{{ copyStatus }}</p>
      <p v-if="event.author" class="event-author">Av {{ event.author }}</p>
      <div class="event-description" v-html="event.description"></div>
      <a v-if="event.facebookUrl" class="event-facebook-link" :href="event.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Läs mer (öppnas i en ny flik)">
        Läs mer... <span aria-hidden="true">↗</span>
      </a>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const copyStatus = ref('')

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  linkTitle: {
    type: Boolean,
    default: false
  }
})

const copyEventLink = async () => {
  const slug = props.event.slug || route.params.slug
  if (typeof slug !== 'string' || !slug) {
    copyStatus.value = 'Länken till händelsen kunde inte skapas.'
    return
  }

  const eventUrl = new URL(
    router.resolve({ name: 'event', params: { slug } }).href,
    window.location.href
  ).href

  try {
    await navigator.clipboard.writeText(eventUrl)
    copyStatus.value = 'Länken kopierades.'
  } catch {
    copyStatus.value = 'Kunde inte kopiera länken. Kontrollera webbläsarens behörigheter.'
  }
}

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}
</script>

<style scoped>
.event-card {
  overflow: hidden;
  background: #ffffff;
  border-top: 6px solid var(--club-blue);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgb(32 37 42 / 10%);
}

.event-content {
  padding: 1.5rem;
}

.event-date,
.event-author {
  margin: 0 0 0.5rem;
  color: var(--club-muted);
}

.event-date {
  color: var(--club-blue);
  font-weight: 700;
  text-transform: uppercase;
}

.event-content h3 {
  margin: 0 0 0.75rem;
  color: var(--club-charcoal);
}

.event-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-content h3 a {
  color: inherit;
  text-decoration: none;
}

.event-content h3 a:hover {
  text-decoration: underline;
  text-decoration-color: var(--club-lime);
  text-decoration-thickness: 0.15em;
  text-underline-offset: 0.15em;
}

.event-content h3 a:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 3px;
}

.event-link-button {
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

.event-link-button:hover {
  background: rgb(40 123 159 / 10%);
}

.event-link-button:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 2px;
}

.event-link-button svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.event-copy-status {
  margin: -0.5rem 0 0.75rem;
  color: var(--club-muted);
  font-size: 0.9rem;
}

.event-description {
  color: var(--club-ink);
  line-height: 1.6;
}

.event-facebook-link,
.event-description :deep(a) {
  display: inline-block;
  margin-top: 0.75rem;
  color: #287b9f;
  font-weight: 700;
}

.event-description :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
