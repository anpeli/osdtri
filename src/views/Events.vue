<template>
  <div class="events-page">
    <PageHeader :title="page.title" :backdrop-desktop="page.backdropDesktop" :backdrop-mobile="page.backdropMobile" :backdrop-desktop-position="page.backdropDesktopPosition" :backdrop-mobile-position="page.backdropMobilePosition" />
    <div class="page-content" v-html="page.body"></div>

    <div v-if="events.length === 0" class="no-events">
      <p>Inga evenemang schemalagda just nu.</p>
    </div>

    <div v-else class="calendar-layout">
      <section class="calendar" aria-labelledby="calendar-title">
        <div class="calendar-toolbar">
          <button class="month-button" type="button" aria-label="Föregående månad" @click="changeMonth(-1)">
            <span aria-hidden="true">&lt;</span>
          </button>
          <h2 id="calendar-title">{{ monthLabel }}</h2>
          <button class="month-button" type="button" aria-label="Nästa månad" @click="changeMonth(1)">
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>

        <div class="weekday-row" aria-hidden="true">
          <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
        </div>

        <div class="calendar-grid">
          <div
            v-for="day in calendarDays"
            :key="day.key"
            class="calendar-day"
            :class="{ 'calendar-day--outside': !day.inMonth, 'calendar-day--today': day.isToday }"
          >
            <time class="day-number" :datetime="day.key">{{ day.number }}</time>
            <div class="day-events">
              <button
                v-for="event in eventsByDate[day.key] || []"
                :key="event.id"
                class="calendar-event"
                type="button"
                @click="selectedEvent = event"
              >
                {{ event.title }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="event-details" aria-labelledby="events-title">
        <div class="section-heading">
          <h2 id="events-title">Kommande händelser</h2>
          <p>{{ monthEventCount }} {{ monthEventCount === 1 ? 'händelse' : 'händelser' }} denna månad</p>
        </div>

        <article
          v-for="event in displayedEvents"
          :key="event.id"
          class="event-card"
          :class="{ 'event-card--selected': selectedEvent && selectedEvent.id === event.id }"
        >
          <img v-if="event.image" :src="event.image" :alt="event.title" class="event-image" />
          <div class="event-info">
            <p class="event-date">
              {{ formatDate(event.date) }}
              <span v-if="event.time">, {{ event.time }}</span>
              <span v-if="event.duration">, {{ event.duration }}</span>
              <span v-if="event.location">, {{ event.location }}</span>
            </p>
            <h3>{{ event.title }}</h3>
            <p v-if="event.author" class="event-author">Av {{ event.author }}</p>
            <div v-html="event.description"></div>
            <a v-if="event.facebookUrl" class="event-facebook-link" :href="event.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Läs mer (öppnas i en ny flik)">
              Läs mer... <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>

        <p v-if="displayedEvents.length === 0" class="empty-month">Inga händelser denna månad.</p>
      </section>
    </div>
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
  backdropDesktop: pageMetadata.backdropDesktop,
  backdropMobile: pageMetadata.backdropMobile,
  backdropDesktopPosition: pageMetadata.backdropDesktopPosition,
  backdropMobilePosition: pageMetadata.backdropMobilePosition,
  body: marked.parse(pageFrontMatterMatch?.[2] || '')
}

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

const getDateKey = (date) => {
  if (typeof date === 'string') return date.slice(0, 10)

  const parsedDate = new Date(date)
  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const getLocalDate = (date) => {
  const [year, month, day] = getDateKey(date).split('-').map(Number)
  return new Date(year, month - 1, day)
}

const events = Object.entries(eventFiles)
  .map(([filePath, source]) => parseEvent(source, filePath))
  .filter((event) => {
    if (!event.title || !event.date) return false

    const dateKey = getDateKey(event.date)
    const now = new Date()
    const todayKey = getDateKey(now)
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    return dateKey > todayKey || (dateKey === todayKey && (!event.time || event.time >= currentTime))
  })
  .sort((first, second) => getDateKey(first.date).localeCompare(getDateKey(second.date)) || (first.time || '').localeCompare(second.time || ''))

const weekdays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
const firstEventDate = events.length ? getLocalDate(events[0].date) : new Date()
const displayedMonth = ref(new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1))
const selectedEvent = ref(null)

const monthKey = computed(() => `${displayedMonth.value.getFullYear()}-${String(displayedMonth.value.getMonth() + 1).padStart(2, '0')}`)
const monthLabel = computed(() => displayedMonth.value.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' }))
const eventsByDate = computed(() => events.reduce((groupedEvents, event) => {
  const dateKey = getDateKey(event.date)
  groupedEvents[dateKey] = groupedEvents[dateKey] || []
  groupedEvents[dateKey].push(event)
  return groupedEvents
}, {}))
const calendarDays = computed(() => {
  const year = displayedMonth.value.getFullYear()
  const month = displayedMonth.value.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPreviousMonth = new Date(year, month, 0).getDate()
  const todayKey = getDateKey(new Date())

  return Array.from({ length: 42 }, (_, index) => {
    const dayOffset = index - firstWeekday + 1
    const date = new Date(year, month, dayOffset)
    const inMonth = dayOffset > 0 && dayOffset <= daysInMonth
    const number = inMonth ? dayOffset : (dayOffset <= 0 ? daysInPreviousMonth + dayOffset : dayOffset - daysInMonth)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    return { key, number, inMonth, isToday: key === todayKey }
  })
})
const displayedEvents = computed(() => events.filter((event) => getDateKey(event.date).startsWith(monthKey.value)))
const monthEventCount = computed(() => displayedEvents.value.length)

const changeMonth = (offset) => {
  displayedMonth.value = new Date(displayedMonth.value.getFullYear(), displayedMonth.value.getMonth() + offset, 1)
  selectedEvent.value = null
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('sv-SE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC'
})

</script>

<style scoped>
.events-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.calendar-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.8fr);
  gap: 2rem;
  align-items: start;
}

.calendar,
.event-details {
  background: white;
  border: 1px solid var(--club-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(32, 37, 42, 0.06);
}

.calendar {
  overflow: hidden;
}

.calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: var(--club-charcoal);
  color: white;
}

.calendar-toolbar h2 {
  margin: 0;
  color: white;
  font-size: 1.35rem;
  text-transform: capitalize;
}

.month-button {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: white;
  font-size: 1.25rem;
}

.month-button:hover {
  background: rgba(255, 255, 255, 0.12);
  opacity: 1;
}

.weekday-row,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.weekday-row {
  padding: 0.75rem 0.5rem 0.5rem;
  color: var(--club-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.calendar-day {
  min-height: 7.5rem;
  padding: 0.5rem;
  border-top: 1px solid var(--club-border);
  border-right: 1px solid var(--club-border);
  background: white;
}

.calendar-day:nth-child(7n) {
  border-right: 0;
}

.calendar-day--outside {
  background: #f7f9f7;
  color: #aab3ae;
}

.calendar-day--today .day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--club-lime);
  color: var(--club-charcoal);
}

.day-number {
  display: block;
  width: fit-content;
  padding: 0.15rem 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.day-events {
  display: grid;
  gap: 0.3rem;
  margin-top: 0.4rem;
}

.calendar-event {
  width: 100%;
  overflow: hidden;
  padding: 0.3rem 0.4rem;
  border-radius: 3px;
  background: var(--club-blue);
  color: var(--club-charcoal);
  font-size: 0.75rem;
  line-height: 1.25;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-event:hover {
  background: var(--club-lime);
  opacity: 1;
}

.event-details {
  padding: 1.5rem;
}

.section-heading {
  margin-bottom: 1.25rem;
}

.section-heading h2 {
  margin-bottom: 0.25rem;
  padding-left: 0.75rem;
  color: var(--club-charcoal);
  border-left: 5px solid var(--club-lime);
}

.section-heading p,
.event-date,
.event-location,
.event-author {
  color: var(--club-muted);
  font-size: 0.9rem;
}

.event-card {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--club-border);
}

.event-card:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.event-card--selected {
  padding-left: 0.75rem;
  border-left: 4px solid var(--club-lime);
}

.event-image {
  width: 100%;
  max-height: 180px;
  margin-bottom: 0.75rem;
  object-fit: cover;
}

.event-info h3 {
  margin: 0.15rem 0 0.4rem;
  color: var(--club-charcoal);
  font-size: 1.15rem;
}

.event-location {
  margin-bottom: 0.75rem;
}

.event-author {
  margin: 0 0 0.5rem;
}

.event-facebook-link {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--club-ink);
  font-weight: 700;
}

.no-events {
  padding: 3rem;
  color: var(--club-muted);
  text-align: center;
}

.empty-month {
  color: var(--club-muted);
}

@media (max-width: 768px) {
  .events-page {
    padding: 0 1rem 1.5rem;
  }

  .calendar-layout {
    grid-template-columns: 1fr;
  }

  .calendar-day {
    min-height: 5.25rem;
    padding: 0.3rem;
  }

  .calendar-event {
    font-size: 0.65rem;
  }

  .event-details {
    padding: 1.25rem;
  }
}
</style>
