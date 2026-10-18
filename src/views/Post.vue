<template>
  <div v-if="post" class="post-page" :class="{ 'post-page--share': isShareMode }">
    <PageHeader
      :title="post.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
      :compact="isShareMode"
    />
    <PostItem :post="post" :single="true" :show-title="!isShareMode" />
    <router-link v-if="!isShareMode" class="back-link" :to="returnLocation">
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
import { getPageSettings } from '../utils/pageSettings'

const route = useRoute()
const isShareMode = computed(() => route.query.share === '1' || route.query.share === 'true')
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

const page = getPageSettings('post')

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

.post-page--share {
  padding-top: 1.25rem;
}

.post-page--share :deep(.post-card) {
  border: 1px solid var(--club-border);
  border-top: 4px solid var(--club-blue);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgb(32 37 42 / 8%);
}

.post-page--share :deep(.post-content) {
  padding: 1.75rem 2rem;
}

.post-page--share :deep(.post-date) {
  margin-bottom: 1rem;
  font-size: 0.95rem;
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

@media (max-width: 480px) {
  .post-page--share {
    padding-top: 1rem;
  }

  .post-page--share :deep(.post-content) {
    padding: 1.35rem 1.25rem;
  }
}
</style>
