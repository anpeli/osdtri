<template>
  <PageHeader :title="home.title" :backdrop="home.backdrop" />
  <div class="home-content" v-html="home.body"></div>

  <NextEvent v-if="nextEvent" :event="nextEvent" />

  <LatestPosts />
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import NextEvent from '../components/NextEvent.vue'
import LatestPosts from '../components/LatestPosts.vue'

const pageFiles = import.meta.glob('../content/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const homeSource = pageFiles['../content/home.md'] || ''
const homeFrontMatterMatch = homeSource.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const homeMetadata = homeFrontMatterMatch ? parse(homeFrontMatterMatch[1]) || {} : {}
const home = {
  title: homeMetadata.title || 'Välkommen till Östersund Triathlon',
  backdrop: homeMetadata.backdrop || '/assets/images/img_2480.jpg',
  body: marked.parse(homeFrontMatterMatch?.[2] || '')
}

const eventFiles = import.meta.glob('../content/events/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const parseEvents = (source, filePath) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  const descriptionSource = metadata.description || (frontMatterMatch ? frontMatterMatch[2] : source) || ''

  return {
    ...metadata,
    id: filePath,
    description: marked.parse(descriptionSource, { breaks: true })
  }
}

const nextEvent = Object.entries(eventFiles)
  .map(([filePath, source]) => parseEvents(source, filePath))
  .filter((event) => event.title && event.date && new Date(event.date) >= new Date())
  .sort((first, second) => new Date(first.date) - new Date(second.date))[0]

</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.home-content {
  max-width: 800px;
  margin: 2rem auto 0;
  padding: 0 2rem;
}

</style>
