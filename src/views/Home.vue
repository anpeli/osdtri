<template>
  <section class="hero">
    <h1>Välkommen till OSD Tri</h1>
    <p>Östersunds triathlonklubb</p>
    <button @click="$router.push('/events')">Se Kommande Event</button>
  </section>

  <section class="features">
    <div class="feature-card">
      <h3>Träning</h3>
      <p>Regelbunden träning för alla nivåer</p>
    </div>
    <div class="feature-card">
      <h3>Tävlingar</h3>
      <p>Deltagande i nationella evenemang</p>
    </div>
    <div class="feature-card">
      <h3>Gemenskap</h3>
      <p>Möt andra entusiaster</p>
    </div>
  </section>

  <section class="posts">
    <div class="section-heading">
      <h2>Senaste inläggen</h2>
      <p>Nyheter och berättelser från Östersund Triathlon</p>
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

    <p v-else class="no-posts">Inga inlägg publicerade ännu.</p>
  </section>
</template>

<script setup>
import { marked } from 'marked'

const postFiles = import.meta.glob('../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const parsePost = (source, id) => {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = {}
  const bodySource = frontMatterMatch ? frontMatterMatch[2] : source

  if (frontMatterMatch) {
    frontMatterMatch[1].split(/\r?\n/).forEach((line) => {
      const separator = line.indexOf(':')
      if (separator === -1) return
      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
      metadata[key] = value
    })
  }

  return {
    id,
    title: metadata.title || 'Namnlöst inlägg',
    date: metadata.date || '',
    author: metadata.author || '',
    image: metadata.image || '',
    body: marked.parse(bodySource)
  }
}

const posts = Object.entries(postFiles)
  .map(([id, source]) => parsePost(source, id))
  .sort((first, second) => new Date(second.date) - new Date(first.date))

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
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.feature-card {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.posts {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.section-heading {
  margin-bottom: 2rem;
}

.section-heading h2 {
  margin-bottom: 0.5rem;
}

.section-heading p,
.post-date,
.post-author,
.no-posts {
  color: #666;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.post-card {
  overflow: hidden;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-image {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-date,
.post-author {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
}

.post-content h3 {
  margin: 0 0 0.75rem;
}

.post-body :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
