<template>
  <div class="about-page">
    <h1>{{ page.title }}</h1>
    <div class="page-content" v-html="page.body"></div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'

const pageFiles = import.meta.glob('../content/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/about.md']
const frontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

const page = {
  title: pageMetadata.title || 'Om oss',
  body: marked.parse(frontMatterMatch?.[2] || '')
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-size: 1.05rem;
}

.page-content :deep(p) {
  margin: 0 0 1.25rem;
  line-height: 1.8;
}

section {
  margin-bottom: 3rem;
}
</style>
