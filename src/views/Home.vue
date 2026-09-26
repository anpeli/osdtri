<template>
  <div class="home-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" :backdrop-position="page.backdropPosition" />
    <div class="page-content" v-html="page.body"></div>
  </div>
  <NextEvent />
  <LatestPosts />
  <router-link class="home-archive-link" to="/arkiv">Fler inlägg</router-link>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import NextEvent from '../components/NextEvent.vue'
import LatestPosts from '../components/LatestPosts.vue'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/home.md']
const frontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

const page = {
  title: pageMetadata.title || 'Välkommen till Östersund Triathlon',
  backdrop: pageMetadata.backdrop,
  backdropPosition: pageMetadata.backdropPosition,
  body: marked.parse(frontMatterMatch?.[2] || '')
}
</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  font-size: 1.05rem;
}

.page-content :deep(p) {
  margin: 0 0 1.25rem;
  line-height: 1.8;
}

.page-content :deep(h2) {
  margin: 0 0 1rem;
}

.home-archive-link {
  display: block;
  width: fit-content;
  margin: -2rem auto 4rem;
  padding: 0.75rem 1.5rem;
  background: var(--club-lime);
  border-radius: 4px;
  color: var(--club-charcoal);
  font-weight: 700;
  text-decoration: none;
}

.home-archive-link:hover {
  opacity: 0.9;
}
</style>
