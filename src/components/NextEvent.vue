<template>
  <section v-if="event" class="upcoming-event">
    <div class="section-heading">
      <h2>Nästa händelse</h2>
      <p>
        Kom och träna tillsammans med Östersund Triathlon.
      </p>
    </div>

    <EventItem :event="event" link-title />
    <router-link class="upcoming-events-link" to="/kalender">
      Visa alla kommande händelser
    </router-link>
  </section>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'
import EventItem from './EventItem.vue'

const parseEvent = (source, filePath) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  const descriptionSource = metadata.description || (frontMatterMatch ? frontMatterMatch[2] : source) || ''

  return {
    ...metadata,
    id: filePath,
    slug: filePath.split('/').pop().replace(/\.md$/, ''),
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

const event = Object.entries(eventFiles)
  .map(([filePath, source]) => parseEvent(source, filePath))
  .filter((entry) => {
    if (!entry.title || !entry.date || entry.eventType === 'external') return false

    const dateKey = getDateKey(entry.date)
    return dateKey >= todayKey
  })
  .sort((first, second) => getDateKey(first.date).localeCompare(getDateKey(second.date)) || (first.time || '').localeCompare(second.time || ''))[0]

</script>

<style scoped>
.upcoming-event {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
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

.section-heading {
  margin-bottom: 2rem;
}

</style>