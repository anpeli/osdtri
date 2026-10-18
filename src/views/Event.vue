<template>
  <div v-if="event" class="event-page" :class="{ 'event-page--share': isShareMode }">
    <PageHeader
      :title="event.title || page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
      :compact="isShareMode"
    />
    <EventItem :event="event" :show-title="!isShareMode" />
    <router-link v-if="!isShareMode" class="back-link" to="/kalender">Tillbaka till kalendern</router-link>
  </div>
  <section v-else class="event-not-found">
    <h1>Händelsen hittades inte</h1>
    <router-link to="/kalender">Tillbaka till kalendern</router-link>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { parse } from 'yaml'
import EventItem from '../components/EventItem.vue'
import PageHeader from '../components/PageHeader.vue'
import { getPageSettings } from '../utils/pageSettings'

const route = useRoute()
const isShareMode = computed(() => route.query.share === '1' || route.query.share === 'true')
const eventFiles = import.meta.glob('../content/events/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})
const page = getPageSettings('event')

const event = computed(() => {
  const source = eventFiles[`../content/events/${route.params.slug}.md`]
  if (!source) return null

  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  const descriptionSource = metadata.description || (frontMatterMatch ? frontMatterMatch[2] : source) || ''

  return {
    ...metadata,
    slug: route.params.slug,
    description: marked.parse(descriptionSource, { breaks: true })
  }
})
</script>

<style scoped>
.event-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.event-page--share {
  padding-top: 1.25rem;
}

.event-page--share :deep(.event-card) {
  border: 1px solid var(--club-border);
  border-top: 4px solid var(--club-blue);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgb(32 37 42 / 8%);
}

.event-page--share :deep(.event-content) {
  padding: 1.75rem 2rem;
}

.event-page--share :deep(.event-date) {
  margin-bottom: 0.85rem;
  color: var(--club-muted);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5;
  text-transform: none;
}

.event-page--share :deep(.event-type) {
  margin-bottom: 1rem;
  padding: 0.25rem 0.7rem;
  font-size: 0.8rem;
}

.event-page--share :deep(.event-description) {
  font-size: 1.08rem;
  line-height: 1.75;
}

.event-page--share :deep(.event-description p + p) {
  margin-top: 0.75rem;
}

.event-page--share :deep(.event-url-link) {
  margin-top: 1.25rem;
}

.back-link,
.event-not-found a {
  display: inline-block;
  margin-top: 1.5rem;
  color: #287b9f;
  font-weight: 600;
}

.event-not-found {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.event-not-found h1 {
  color: var(--club-charcoal);
}

@media (max-width: 480px) {
  .event-page {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .event-page--share {
    padding-top: 1rem;
  }

  .event-page--share :deep(.event-content) {
    padding: 1.35rem 1.25rem;
  }

  .event-page--share :deep(.event-description) {
    font-size: 1rem;
  }
}
</style>
