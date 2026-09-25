<template>
  <div class="partners-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" />
    <div class="page-content" v-html="page.body"></div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/partners.md']
const frontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

const page = {
  title: pageMetadata.title || 'Sponsorer och samarbeten',
  backdrop: pageMetadata.backdrop,
  body: marked.parse(frontMatterMatch?.[2] || '')
}
</script>

<style scoped>
.partners-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  line-height: 1.7;
}

.partners-page h1,
.page-content :deep(h2) {
  margin-bottom: 1rem;
}

.page-content :deep(p),
.page-content :deep(li) {
  margin-bottom: 0.75rem;
}

.page-content :deep(ul) {
  padding-left: 1.5rem;
  margin: 1rem 0 2rem;
}

.page-content :deep(a) {
  color: #6d4aff;
  text-decoration: none;
}

.page-content :deep(a:hover) {
  text-decoration: underline;
}
</style>