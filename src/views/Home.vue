<template>
  <div class="home-page">
    <PageHeader :title="page.title" :backdrop-desktop="page.backdropDesktop" :backdrop-mobile="page.backdropMobile" :backdrop-desktop-position="page.backdropDesktopPosition" :backdrop-mobile-position="page.backdropMobilePosition" />
    <div class="page-content" v-html="page.body"></div>
  </div>
  <NextEvent />
  <LatestPosts />
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
  backdropDesktop: pageMetadata.backdropDesktop,
  backdropMobile: pageMetadata.backdropMobile,
  backdropDesktopPosition: pageMetadata.backdropDesktopPosition,
  backdropMobilePosition: pageMetadata.backdropMobilePosition,
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
</style>
