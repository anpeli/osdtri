<template>
  <div class="about-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" />
    <div class="page-content" v-html="page.body"></div>
    <ContactForm />
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import ContactForm from '../components/ContactForm.vue'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/about.md']
const frontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

const page = {
  title: pageMetadata.title || 'Om oss',
  backdrop: pageMetadata.backdrop,
  body: marked.parse(frontMatterMatch?.[2] || '')
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  font-size: 1.05rem;
}

.page-content :deep(p) {
  margin: 0 0 1.25rem;
  line-height: 1.8;
}

.page-content :deep(h3) {
  margin: 1.25rem 0 0.25rem;
  font-size: 1.25rem;
  line-height: 1.3;
}

.page-content :deep(ul) {
  margin: 0 0 0.75rem;
  padding-left: 1.5rem;
}

section {
  margin-bottom: 3rem;
}
</style>
