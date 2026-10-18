<template>
  <div class="partners-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" :backdrop-small="page.backdropSmall" :backdrop-position="page.backdropPosition" :backdrop-small-position="page.backdropSmallPosition" />
    <div class="page-content" v-html="page.body"></div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import PageHeader from '../components/PageHeader.vue'
import { getPageSettings } from '../utils/pageSettings'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/partners.md'] || ''
const page = {
  ...getPageSettings('partners'),
  body: marked.parse(pageSource).replace(
    /src="\/assets\//g,
    `src="${import.meta.env.BASE_URL}assets/`
  )
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

.page-content :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
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