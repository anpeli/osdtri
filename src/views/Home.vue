<template>
  <PageHeader :title="home.title" :backdrop="home.backdrop" />
  <div class="home-content" v-html="home.body"></div>
  <NextEvent />
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

</script>

<style scoped>
.home-content {
  max-width: 800px;
  margin: 2rem auto 0;
  padding: 0 2rem;
}
</style>
