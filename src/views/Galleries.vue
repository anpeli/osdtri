<template>
  <div class="galleries-page">
    <PageHeader
      :title="page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
    />
    <section class="galleries-list" aria-label="Bildgallerier">
      <p v-if="galleries.length === 0" class="empty-state">
        Inga bildgallerier har publicerats ännu.
      </p>
      <ul v-else>
        <li v-for="gallery in galleries" :key="gallery.slug">
          <router-link :to="`/galleri/${gallery.slug}`">
            {{ gallery.title }}
          </router-link>
          <time v-if="gallery.date" :datetime="gallery.date">{{ formatDate(gallery.date) }}</time>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import { getPageSettings } from '../utils/pageSettings'

const galleryFiles = import.meta.glob('../content/galleries/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const page = getPageSettings('galleries')

const galleries = Object.entries(galleryFiles)
  .map(([path, source]) => {
    const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
    const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
    const slug = path.split('/').pop().replace(/\.md$/, '')

    return {
      slug,
      title: typeof metadata.title === 'string' ? metadata.title : slug,
      date: typeof metadata.date === 'string' ? metadata.date : ''
    }
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title, 'sv'))

const formatDate = (date) => {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''

  return parsedDate.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.galleries-page {
  padding-bottom: 2rem;
}

.galleries-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.galleries-list ul {
  list-style: none;
  border-top: 1px solid var(--club-border);
}

.galleries-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--club-border);
}

.galleries-list a {
  color: var(--club-charcoal);
  font-weight: 700;
  text-decoration: none;
}

.galleries-list a:hover {
  color: var(--club-blue);
}

.galleries-list time,
.empty-state {
  color: var(--club-muted);
}

@media (max-width: 560px) {
  .galleries-list li {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
