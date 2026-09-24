<template>
  <div class="events-page">
    <h1>Kalender</h1>

    <div v-if="events.length === 0" class="no-events">
      <p>Inga evenemang schemalagda just nu.</p>
    </div>

    <div v-else class="event-list">
      <div
        v-for="event in events"
        :key="event.id"
        class="event-card"
        :class="{ 'event-card--no-image': !event.image }"
      >
        <img
          v-if="event.image"
          :src="event.image"
          :alt="event.title"
          class="event-image"
        />
        <div class="event-info">
          <h2>{{ event.title }}</h2>
          <p class="event-date">{{ formatDate(event.date) }}</p>
          <p class="event-location">{{ event.location }}</p>
          <div v-html="event.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'

const eventFiles = import.meta.glob('../content/pages/events.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const eventSource = eventFiles['../content/pages/events.md']
const frontMatterMatch = eventSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

const events = (metadata.events || []).map((event, index) => ({
  ...event,
  id: `events-${index}`,
  description: marked.parse(event.description || '', { breaks: true })
}))
  .filter((event) => event.date && new Date(event.date) >= new Date())
  .sort((first, second) => new Date(first.date) - new Date(second.date))

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('sv-SE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>

<style scoped>
.events-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.event-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.event-card--no-image {
  grid-template-columns: 1fr;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-info {
  padding: 1.5rem;
}

.event-date, .event-location {
  color: #666;
  margin-bottom: 0.5rem;
}

.no-events {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .event-card {
    grid-template-columns: 1fr;
  }

  .event-image {
    height: 200px;
  }
}
</style>
