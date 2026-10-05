<template>
  <div class="events-page">
    <PageHeader
      :title="page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
    />
    <div class="page-content" v-html="page.body"></div>

    <section class="calendar" aria-labelledby="calendar-title">
      <div class="calendar-toolbar">
        <div>
          <h2 id="calendar-title">Kommande evenemang</h2>
          <p>{{ eventCountLabel }}</p>
        </div>
        <div class="year-controls" :aria-label="`Valt år ${selectedYear}`">
          <button
            class="year-button"
            type="button"
            :disabled="selectedYear <= currentYear"
            aria-label="Föregående år"
            @click="changeYear(-1)"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <strong>{{ selectedYear }}</strong>
          <button class="year-button" type="button" aria-label="Nästa år" @click="changeYear(1)">
            <span aria-hidden="true">›</span>
          </button>
          <button v-if="selectedYear !== currentYear" class="today-button" type="button" @click="goToCurrentYear">
            I dag
          </button>
        </div>
      </div>

      <div class="calendar-content">
        <div class="calendar-filters" role="group" aria-label="Filtrera evenemang">
          <span>Visa:</span>
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            class="filter-button"
            :class="{ 'filter-button--active': selectedType === filter.value }"
            :aria-pressed="selectedType === filter.value"
            @click="selectedType = filter.value"
          >
            <span v-if="filter.value !== 'all'" class="filter-dot" :class="`filter-dot--${filter.value}`" aria-hidden="true"></span>
            {{ filter.label }}
          </button>
        </div>

        <div v-if="monthGroups.length" class="year-overview" aria-label="Kommande månader">
          <div class="year-summary">
            <strong>{{ eventCountLabel }}</strong>
            <span>{{ yearRangeLabel }} · välj en månad eller händelse</span>
          </div>
          <nav class="month-shortcuts" aria-label="Hoppa till månad">
            <a v-for="group in monthGroups" :key="group.key" :href="`#${group.key}`">
              {{ group.shortLabel }} · {{ group.events.length }}
            </a>
          </nav>
        </div>

        <div v-if="monthGroups.length" class="year-agenda">
          <section
            v-for="group in monthGroups"
            :id="group.key"
            :key="group.key"
            class="month-group"
            :aria-labelledby="`${group.key}-title`"
          >
            <h3 :id="`${group.key}-title`" class="month-title">
              {{ group.label }}
              <span>{{ group.events.length }} evenemang</span>
            </h3>
            <div class="month-events">
              <article
                v-for="event in group.events"
                :key="event.slug"
                class="year-event"
                :class="`year-event--${event.eventType}`"
              >
                <time class="event-date" :datetime="getDateKey(event.date)">
                  <strong>{{ getLocalDate(event.date).getDate() }}</strong>
                  <span>{{ weekdayLabel(event.date) }}</span>
                </time>
                <div class="event-content">
                  <router-link class="event-title" :to="{ name: 'event', params: { slug: event.slug } }">
                    {{ event.title }}
                  </router-link>
                  <p class="event-meta">
                    <span v-if="event.time">{{ event.time }}</span>
                    <span v-if="event.location">{{ event.location }}</span>
                    <span class="event-type" :class="`event-type--${event.eventType}`">
                      {{ event.eventType === 'external' ? 'Externt' : 'Internt' }}
                    </span>
                  </p>
                  <p v-if="event.participants.length" class="participant-count">
                    {{ event.participants.length }} deltagare
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>

        <p v-else class="empty-year">
          {{ events.length ? 'Inga kommande evenemang matchar filtret för det här året.' : 'Inga evenemang schemalagda just nu.' }}
        </p>
      </div>

      <p class="calendar-subscription">
        Lägg till evenemangen i
        <a class="google-calendar-link" :href="googleCalendarUrl.href" target="_blank" rel="noopener noreferrer">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2v4m8-4v4M4 9h16M5 4h14a1 1 0 0 1 1 1v15H4V5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 12v6m-2.5-2.5L12 18l2.5-2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Google Kalender
        </a>
        eller <a href="/events.ics" download>ladda ner kalenderfilen (.ics)</a>.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'

const eventFiles = import.meta.glob('../content/events/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/events.md']
const pageFrontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = pageFrontMatterMatch ? parse(pageFrontMatterMatch[1]) || {} : {}
const page = {
  title: pageMetadata.title || 'Kalender',
  backdrop: pageMetadata.backdrop,
  backdropSmall: pageMetadata.backdropSmall,
  backdropPosition: pageMetadata.backdropPosition,
  backdropSmallPosition: pageMetadata.backdropSmallPosition,
  body: marked.parse(pageFrontMatterMatch?.[2] || '')
}

const parseEvent = ([filePath, source]) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  const slug = filePath.split('/').pop().replace(/\.md$/, '')

  return {
    ...metadata,
    slug,
    eventType: metadata.eventType === 'external' ? 'external' : 'internal',
    participants: Array.isArray(metadata.participants)
      ? metadata.participants.filter((participant) => typeof participant === 'string' && participant.trim())
      : []
  }
}

const getDateKey = (date) => typeof date === 'string'
  ? date.slice(0, 10)
  : new Date(date).toISOString().slice(0, 10)

const getLocalDate = (date) => {
  const [year, month, day] = getDateKey(date).split('-').map(Number)
  return new Date(year, month - 1, day)
}

const weekdayLabel = (date) => getLocalDate(date).toLocaleDateString('sv-SE', { weekday: 'short' })
const todayKey = getDateKey(new Date())
const currentYear = new Date().getFullYear()
const events = Object.entries(eventFiles)
  .map(parseEvent)
  .filter((event) => event.title && event.date && getDateKey(event.date) >= todayKey)
  .sort((first, second) =>
    getDateKey(first.date).localeCompare(getDateKey(second.date))
    || (first.time || '').localeCompare(second.time || '')
  )

const filters = [
  { label: 'Alla', value: 'all' },
  { label: 'Internt', value: 'internal' },
  { label: 'Externt', value: 'external' }
]
const selectedYear = ref(currentYear)
const selectedType = ref('all')
const googleCalendarUrl = new URL('https://calendar.google.com/calendar/r')
googleCalendarUrl.searchParams.set('cid', new URL('/events.ics', window.location.origin).href)

const yearEvents = computed(() => events.filter((event) => {
  const eventYear = Number(getDateKey(event.date).slice(0, 4))
  return eventYear === selectedYear.value
    && (selectedType.value === 'all' || event.eventType === selectedType.value)
}))
const monthGroups = computed(() => {
  const grouped = new Map()
  yearEvents.value.forEach((event) => {
    const date = getLocalDate(event.date)
    const month = date.getMonth()
    if (!grouped.has(month)) {
      grouped.set(month, {
        key: `month-${selectedYear.value}-${String(month + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('sv-SE', { month: 'long' }),
        shortLabel: date.toLocaleDateString('sv-SE', { month: 'short' }),
        events: []
      })
    }
    grouped.get(month).events.push(event)
  })
  return [...grouped.values()]
})
const eventCountLabel = computed(() => {
  const count = yearEvents.value.length
  return `${count} kommande evenemang`
})
const yearRangeLabel = computed(() => selectedYear.value === currentYear
  ? `Resten av ${selectedYear.value}`
  : `År ${selectedYear.value}`
)

const changeYear = (offset) => {
  selectedYear.value = Math.max(currentYear, selectedYear.value + offset)
}
const goToCurrentYear = () => {
  selectedYear.value = currentYear
}
</script>

<style scoped>
.events-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  overflow-x: clip;
}

.calendar {
  overflow: hidden;
  background: white;
  border: 1px solid var(--club-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgb(32 37 42 / 6%);
}

.calendar-subscription {
  margin: 0;
  padding: 0.75rem 1.5rem;
  background: #f7f9f7;
  border-top: 1px solid var(--club-border);
  color: var(--club-muted);
  font-size: 0.9rem;
}

.google-calendar-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0 0.15rem;
  color: var(--club-ink);
  font-weight: 700;
  vertical-align: middle;
}

.google-calendar-link svg {
  width: 1.1rem;
  height: 1.1rem;
}

.calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--club-charcoal);
  color: white;
}

.calendar-toolbar h2 {
  margin: 0;
  color: white;
  font-size: 1.2rem;
}

.calendar-toolbar p {
  margin: 0.15rem 0 0;
  color: rgb(255 255 255 / 75%);
  font-size: 0.82rem;
}

.year-controls {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.year-controls strong {
  min-width: 3rem;
  text-align: center;
}

.year-button,
.today-button {
  display: inline-grid;
  place-items: center;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.55rem;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 4px;
  background: transparent;
  color: white;
}

.year-button {
  font-size: 1.4rem;
  line-height: 1;
}

.year-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.today-button {
  font-size: 0.85rem;
}

.year-button:not(:disabled):hover,
.today-button:hover {
  background: rgb(255 255 255 / 12%);
  opacity: 1;
}

.year-overview {
  padding: 1.1rem 1.5rem 0;
}

.year-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.year-summary strong {
  color: var(--club-charcoal);
  font-size: 0.95rem;
}

.year-summary > span {
  color: var(--club-muted);
  font-size: 0.82rem;
}

.month-shortcuts {
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding: 0.8rem 0 0.1rem;
}

.month-shortcuts a {
  flex: 0 0 auto;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--club-border);
  border-radius: 999px;
  color: var(--club-ink);
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
}

.month-shortcuts a:hover {
  border-color: var(--club-lime);
  background: #f4faec;
}

.year-agenda {
  padding: 0.4rem 1.5rem 1rem;
}

.month-group {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 1.1rem;
  padding: 1.15rem 0;
  border-top: 1px solid var(--club-border);
  scroll-margin-top: 1rem;
}

.month-title {
  margin: 0;
  color: var(--club-charcoal);
  font-size: 1rem;
  text-transform: capitalize;
}

.month-title span {
  display: block;
  margin-top: 0.2rem;
  color: var(--club-muted);
  font-size: 0.76rem;
  font-weight: 400;
  text-transform: none;
}

.month-events {
  min-width: 0;
}

.year-event {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 0.6rem;
  border-radius: 6px;
}

.year-event + .year-event {
  border-top: 1px solid #eef1ee;
}

.year-event--internal {
  border-left: 3px solid #3c8d36;
}

.year-event--external {
  border-left: 3px solid #8b5bb5;
}

.event-date {
  display: block;
  padding: 0.3rem;
  border-radius: 6px;
  background: #f2f5f0;
  color: var(--club-charcoal);
  text-align: center;
  text-transform: capitalize;
}

.event-date strong {
  display: block;
  font-size: 1.15rem;
  line-height: 1.1;
}

.event-date span {
  color: var(--club-muted);
  font-size: 0.66rem;
  font-weight: 700;
}

.event-title {
  color: var(--club-charcoal);
  font-size: 0.96rem;
  font-weight: 800;
  text-decoration: none;
}

.event-title:hover {
  text-decoration: underline;
  text-decoration-color: var(--club-lime);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.event-title:focus-visible,
.month-shortcuts a:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 3px;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.6rem;
  margin: 0.2rem 0 0;
  color: var(--club-muted);
  font-size: 0.78rem;
}

.event-type {
  display: inline-block;
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
}

.event-type--internal {
  background: #edf7e7;
  color: #2c6228;
}

.event-type--external {
  background: #f2edf7;
  color: #68428b;
}

.participant-count {
  margin: 0.2rem 0 0;
  color: var(--club-muted);
  font-size: 0.74rem;
}

.calendar-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--club-border);
  color: var(--club-muted);
  font-size: 0.82rem;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--club-border);
  border-radius: 999px;
  background: white;
  color: var(--club-ink);
  font-size: 0.75rem;
}

.filter-button--active {
  border-color: var(--club-charcoal);
  background: #f2f5f0;
}

.filter-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3c8d36;
}

.filter-dot--external {
  background: #8b5bb5;
}

.empty-year {
  margin: 0;
  padding: 2.5rem 1.5rem;
  color: var(--club-muted);
  text-align: center;
}

@media (max-width: 768px) {
  .events-page {
    padding: 0 1rem 1.5rem;
  }

  .calendar-subscription {
    padding: 0.75rem 1rem;
  }

  .calendar-toolbar {
    padding: 1rem;
  }

  .calendar-toolbar h2 {
    font-size: 1.05rem;
  }

  .calendar-toolbar p {
    font-size: 0.74rem;
  }

  .year-overview {
    padding: 1rem 1rem 0;
  }

  .year-agenda {
    padding: 0.35rem 1rem 0.75rem;
  }

  .month-group {
    grid-template-columns: 1fr;
    gap: 0.35rem;
    padding: 1rem 0;
  }

  .month-title span {
    display: inline;
    margin-left: 0.35rem;
  }

  .year-event {
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 0.65rem;
    padding: 0.65rem 0.35rem;
  }

  .event-date strong {
    font-size: 1.05rem;
  }

  .calendar-filters {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 420px) {
  .events-page {
    padding-right: 0.75rem;
    padding-left: 0.75rem;
  }

  .calendar-toolbar {
    align-items: flex-start;
    gap: 0.5rem;
  }

  .year-controls {
    gap: 0.3rem;
  }

  .year-button {
    min-width: 1.9rem;
    height: 1.9rem;
  }

  .year-controls strong {
    min-width: 2.6rem;
    font-size: 0.9rem;
  }

  .today-button {
    height: 1.9rem;
    padding: 0 0.4rem;
    font-size: 0.75rem;
  }

  .year-summary > span {
    font-size: 0.75rem;
  }

}
</style>
