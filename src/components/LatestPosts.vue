<template>
  <section class="posts">
    <div class="section-heading">
      <h2>{{ archive ? 'Inläggsarkiv' : 'Senaste inläggen' }}</h2>
      <p v-if="!archive">Nyheter och berättelser från Östersund Triathlon.</p>
    </div>

    <div v-if="posts.length" class="post-list">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <img v-if="post.image" :src="post.image" :alt="post.title" class="post-image" />
        <div class="post-content">
          <p class="post-date">{{ formatDate(post.date) }}</p>
          <h3>{{ post.title }}</h3>
          <p v-if="post.author" class="post-author">Av {{ post.author }}</p>
          <div class="post-body" v-html="post.body"></div>
        </div>
      </article>
    </div>

    <p v-else class="no-posts">{{ archive ? 'Inga äldre inlägg att visa.' : 'Inga inlägg publicerade ännu.' }}</p>
  </section>
</template>

<script setup>
import { marked } from 'marked'

const props = defineProps({
  archive: {
    type: Boolean,
    default: false
  }
})

const parseFrontMatter = (source) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = {}

  if (frontMatterMatch) {
    frontMatterMatch[1].split(/\r?\n/).forEach((line) => {
      const separator = line.indexOf(':')
      if (separator === -1) return

      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
      metadata[key] = value
    })
  }

  return { metadata, body: frontMatterMatch ? frontMatterMatch[2] : source }
}

const postFiles = import.meta.glob('../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const parsePost = (source, id) => {
  const { metadata, body } = parseFrontMatter(source)

  return {
    id,
    title: metadata.title || 'Namnlöst inlägg',
    date: metadata.date || '',
    author: metadata.author || '',
    image: metadata.image || '',
    body: marked.parse(body, { breaks: true })
  }
}

const allPosts = Object.entries(postFiles)
  .map(([id, source]) => parsePost(source, id))
  .sort((first, second) => new Date(second.date) - new Date(first.date))

const sixMonthsAgo = new Date()
const currentDay = sixMonthsAgo.getDate()
sixMonthsAgo.setDate(1)
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
sixMonthsAgo.setDate(Math.min(currentDay, new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + 1, 0).getDate()))

const recentPosts = allPosts.filter((post) => new Date(post.date) >= sixMonthsAgo)
const olderPosts = allPosts.filter((post) => new Date(post.date) < sixMonthsAgo)
const homePosts = [...recentPosts, ...olderPosts.slice(0, Math.max(0, 3 - recentPosts.length))]
const homePostIds = new Set(homePosts.map((post) => post.id))
const posts = props.archive ? allPosts.filter((post) => !homePostIds.has(post.id)) : homePosts

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.posts {
  max-width: 800px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.section-heading {
  margin-bottom: 2rem;
}

.section-heading h2 {
  margin-bottom: 0.5rem;
  color: var(--club-charcoal);
  border-left: 5px solid var(--club-lime);
  padding-left: 0.75rem;
}

.post-date,
.post-author,
.no-posts {
  color: var(--club-muted);
}

.section-heading p {
  max-width: 38rem;
  margin-left: 0.75rem;
  color: var(--club-ink);
  font-size: 1.05rem;
  line-height: 1.65;
}

.post-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.post-card {
  overflow: hidden;
  background: #ffffff;
  border-top: 4px solid var(--club-blue);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgb(32 37 42 / 10%);
}

.post-image {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
  color: var(--club-ink);
}

.post-date,
.post-author {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
}

.post-date {
  color: var(--club-blue);
  font-weight: 700;
  text-transform: uppercase;
}

.post-content h3 {
  margin: 0 0 0.75rem;
  color: var(--club-charcoal);
}

.post-body {
  color: var(--club-ink);
  font-size: 1.05rem;
  line-height: 1.75;
}

.post-body :deep(p),
.post-body :deep(ul),
.post-body :deep(ol),
.post-body :deep(blockquote),
.post-body :deep(pre),
.post-body :deep(table) {
  margin: 0 0 1.25rem;
}

.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3),
.post-body :deep(h4) {
  margin: 2rem 0 0.75rem;
  color: var(--club-charcoal);
  line-height: 1.25;
}

.post-body :deep(h1:first-child),
.post-body :deep(h2:first-child),
.post-body :deep(h3:first-child),
.post-body :deep(h4:first-child) {
  margin-top: 0;
}

.post-body :deep(ul),
.post-body :deep(ol) {
  padding-left: 1.5rem;
}

.post-body :deep(li + li) {
  margin-top: 0.4rem;
}

.post-body :deep(a) {
  color: #287b9f;
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.15em;
  overflow-wrap: anywhere;
}

.post-body :deep(a:hover) {
  color: var(--club-charcoal);
}

.post-body :deep(blockquote) {
  padding: 0.85rem 1.25rem;
  border-left: 4px solid var(--club-lime);
  background: rgb(139 203 63 / 12%);
  color: var(--club-muted);
  font-style: italic;
}

.post-body :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.post-body :deep(code) {
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  background: #f1f1f1;
  font-size: 0.9em;
}

.post-body :deep(pre) {
  overflow-x: auto;
  padding: 1rem;
  border-radius: 6px;
  background: #242424;
  color: #f5f5f5;
}

.post-body :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 0.9em;
}

.post-body :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.5rem auto;
  border-radius: 6px;
}

.post-body :deep(hr) {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid var(--club-border);
}

.post-body :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
}

.post-body :deep(th),
.post-body :deep(td) {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--club-border);
  text-align: left;
}

.post-body :deep(th) {
  background: rgb(85 182 220 / 14%);
  color: var(--club-charcoal);
}

.post-body :deep(p:last-child),
.post-body :deep(ul:last-child),
.post-body :deep(ol:last-child),
.post-body :deep(blockquote:last-child),
.post-body :deep(pre:last-child),
.post-body :deep(table:last-child) {
  margin-bottom: 0;
}

@media (max-width: 600px) {
  .post-content {
    padding: 1.25rem;
  }

  .post-body {
    font-size: 1rem;
  }
}
</style>
