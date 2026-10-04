<template>
  <div v-if="event" class="event-page">
    <PageHeader
      :title="event.title || page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
    />
    <div v-if="page.body" class="page-content" v-html="page.body"></div>
    <EventItem :event="event" />
    <router-link class="back-link" to="/kalender">Tillbaka till kalendern</router-link>
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

const route = useRoute()
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

const pageSource = pageFiles['../content/pages/event.md']
const pageFrontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = pageFrontMatterMatch ? parse(pageFrontMatterMatch[1]) || {} : {}
const page = {
  title: pageMetadata.title || 'Händelse',
  backdrop: pageMetadata.backdrop,
  backdropSmall: pageMetadata.backdropSmall,
  backdropPosition: pageMetadata.backdropPosition,
  backdropSmallPosition: pageMetadata.backdropSmallPosition,
  body: marked.parse(pageFrontMatterMatch?.[2] || '')
}

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
}
</style>
