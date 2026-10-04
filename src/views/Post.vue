<template>
  <div v-if="post" class="post-page">
    <PageHeader
      :title="post.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
    />
    <PostItem :post="post" :single="true" />
    <router-link class="back-link" :to="returnLocation">
      {{ isFromArchive ? 'Tillbaka till inläggsarkivet' : 'Tillbaka till senaste inläggen' }}
    </router-link>
  </div>
  <section v-else class="post-not-found">
    <h1>Inlägg hittades inte</h1>
    <router-link to="/arkiv">Tillbaka till inläggsarkivet</router-link>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import PostItem from '../components/PostItem.vue'
import { getPostGroups } from '../utils/postGroups'

const route = useRoute()
const postFiles = import.meta.glob('../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})
const postGroups = getPostGroups(Object.entries(postFiles).map(([id, source]) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

  return {
    id,
    date: typeof metadata.date === 'string' ? metadata.date : ''
  }
}))

const isFromArchive = computed(() =>
  postGroups.archivePosts.some((item) => item.id === `../content/posts/${route.params.slug}.md`)
)
const returnLocation = computed(() => ({
  path: isFromArchive.value ? '/arkiv' : '/',
  hash: `#post-${route.params.slug}`
}))

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})
const pageSource = pageFiles['../content/pages/post.md']
const pageFrontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
const pageMetadata = pageFrontMatterMatch ? parse(pageFrontMatterMatch[1]) || {} : {}
const page = {
  backdrop: pageMetadata.backdrop,
  backdropSmall: pageMetadata.backdropSmall,
  backdropPosition: pageMetadata.backdropPosition,
  backdropSmallPosition: pageMetadata.backdropSmallPosition
}

const post = computed(() => {
  const source = postFiles[`../content/posts/${route.params.slug}.md`]
  if (!source) return null

  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  const body = frontMatterMatch ? frontMatterMatch[2] : source

  return {
    title: typeof metadata.title === 'string' && metadata.title.trim()
      ? metadata.title
      : 'Namnlöst inlägg',
    date: typeof metadata.date === 'string' ? metadata.date : '',
    author: typeof metadata.author === 'string' ? metadata.author : '',
    body: marked.parse(body, { breaks: true })
  }
})

</script>

<style scoped>
.post-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.back-link,
.post-not-found a {
  display: inline-block;
  margin-top: 1.5rem;
  color: #287b9f;
  font-weight: 600;
}

.post-not-found {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.post-not-found h1 {
  color: var(--club-charcoal);
}
</style>
