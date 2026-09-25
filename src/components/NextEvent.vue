<template>
  <section v-if="event" class="upcoming-event">
    <div class="section-heading">
      <h2>Nästa händelse</h2>
      <p>
        Kom och träna tillsammans med Östersund Triathlon.
      </p>
    </div>

    <article class="event-card">
      <div class="event-content">
        <p class="event-date">
          {{ formatDate(event.date) }}
          <span v-if="event.time">, {{ event.time }}</span>
          <span v-if="event.duration">, {{ event.duration }}</span>
          <span v-if="event.location">, {{ event.location }}</span>
        </p>
        <h3>{{ event.title }}</h3>
        <p v-if="event.author" class="event-author">Av {{ event.author }}</p>
        <div class="event-description" v-html="event.description"></div>
        <a v-if="event.facebookUrl" class="event-facebook-link" :href="event.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Läs mer (öppnas i en ny flik)">
          Läs mer... <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
    <router-link class="upcoming-events-link" to="/kalender">
      Visa alla kommande händelser
    </router-link>
  </section>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'

const parseEvent = (source, filePath) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  const descriptionSource = metadata.description || (frontMatterMatch ? frontMatterMatch[2] : source) || ''

  return {
    ...metadata,
    id: filePath,
    description: marked.parse(descriptionSource, { breaks: true })
  }
}

const eventFiles = import.meta.glob('../content/events/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const getDateKey = (date) => {
  if (typeof date === 'string') return date.slice(0, 10)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const now = new Date()
const todayKey = getDateKey(now)
const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

const event = Object.entries(eventFiles)
  .map(([filePath, source]) => parseEvent(source, filePath))
  .filter((entry) => {
    if (!entry.title || !entry.date) return false

    const dateKey = getDateKey(entry.date)
    return dateKey > todayKey || (dateKey === todayKey && (!entry.time || entry.time >= currentTime))
  })
  .sort((first, second) => getDateKey(first.date).localeCompare(getDateKey(second.date)) || (first.time || '').localeCompare(second.time || ''))[0]

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
.upcoming-event {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.event-card {
  overflow: hidden;
  background: #ffffff;
  border-top: 6px solid var(--club-blue);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgb(32 37 42 / 10%);
}

.upcoming-events-link {
  display: flex;
  width: fit-content;
  margin: 1rem auto 0;
  padding: 0.75rem 1.5rem;
  background-color: var(--club-lime);
  border-radius: 4px;
  color: var(--club-charcoal);
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
}

.upcoming-events-link:hover {
  opacity: 0.9;
}

.event-content {
  padding: 1.5rem;
}

.event-date,
.event-location,
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
  font-size: 1.8rem;
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

.section-heading {
  margin-bottom: 2rem;
}

.section-heading h2 {
  margin-bottom: 0.5rem;
  color: var(--club-charcoal);
  border-left: 5px solid var(--club-lime);
  padding-left: 0.75rem;
}

.section-heading p {
  max-width: 38rem;
  margin-left: 0.75rem;
  color: var(--club-ink);
  font-size: 1.05rem;
  line-height: 1.65;
}
</style>