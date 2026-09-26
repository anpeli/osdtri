<template>
  <div class="archive-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" :backdrop-position="page.backdropPosition" />
    <div v-if="page.body" class="page-content" v-html="page.body"></div>
    <LatestPosts :archive="true" />
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'
import LatestPosts from '../components/LatestPosts.vue'
import PageHeader from '../components/PageHeader.vue'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/archive.md']
const frontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

const page = {
  title: pageMetadata.title || 'Inläggsarkiv',
  backdrop: pageMetadata.backdrop,
  backdropPosition: pageMetadata.backdropPosition,
  body: marked.parse(frontMatterMatch?.[2] || '')
}
</script>

<style scoped>
.archive-page {
  padding-bottom: 2rem;
}

.page-content {
  max-width: 800px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
}

.page-content :deep(p) {
  margin: 0 0 1.25rem;
  line-height: 1.8;
}
</style>
