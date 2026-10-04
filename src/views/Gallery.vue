<template>
  <div v-if="gallery" class="gallery-page">
    <PageHeader
      :title="gallery.title || page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
    />
    <div v-if="page.body" class="page-content" v-html="page.body"></div>
    <article class="gallery-card">
      <p v-if="gallery.date" class="gallery-date">{{ formatDate(gallery.date) }}</p>
      <h3 class="gallery-title">{{ gallery.title || page.title }}</h3>
      <div v-if="gallery.body" class="gallery-description page-content" v-html="gallery.body"></div>
      <p v-if="gallery.photographer" class="gallery-photographer">Fotograf: {{ gallery.photographer }}</p>
      <div v-if="gallery.images.length" class="gallery-grid" :aria-label="gallery.title">
        <figure v-for="(image, index) in gallery.images" :key="`${image}-${index}`" class="gallery-image">
          <ImageDialog
            :src="resolveImageUrl(image)"
            :alt="`Fotografi ${index + 1} från ${gallery.title}`"
            :images="galleryImages"
            :index="index"
          >
            <img :src="resolveImageUrl(image)" :alt="`Fotografi ${index + 1} från ${gallery.title}`" />
          </ImageDialog>
        </figure>
      </div>
    </article>
  </div>
  <section v-else class="gallery-not-found">
    <h1>Galleri hittades inte</h1>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import ImageDialog from '../components/ImageDialog.vue'

const route = useRoute()
const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})
const galleryFiles = import.meta.glob('../content/galleries/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/gallery.md']
const pageFrontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = pageFrontMatterMatch ? parse(pageFrontMatterMatch[1]) || {} : {}
const page = {
  title: pageMetadata.title || 'Galleri',
  backdrop: pageMetadata.backdrop,
  backdropSmall: pageMetadata.backdropSmall,
  backdropPosition: pageMetadata.backdropPosition,
  backdropSmallPosition: pageMetadata.backdropSmallPosition,
  body: marked.parse(pageFrontMatterMatch?.[2] || '')
}

const gallery = computed(() => {
  const source = galleryFiles[`../content/galleries/${route.params.slug}.md`]
  if (!source) return null

  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

  return {
    ...metadata,
    date: typeof metadata.date === 'string' ? metadata.date : '',
    body: marked.parse(frontMatterMatch?.[2] || ''),
    images: Array.isArray(metadata.images) ? metadata.images.filter((image) => typeof image === 'string') : []
  }
})

const formatDate = (date) => {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''

  return parsedDate.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const resolveImageUrl = (imagePath) => imagePath.startsWith('/')
  ? `${import.meta.env.BASE_URL}${imagePath.slice(1)}`
  : imagePath

const galleryImages = computed(() => gallery.value
  ? gallery.value.images.map((image, index) => ({
      src: resolveImageUrl(image),
      alt: `Fotografi ${index + 1} från ${gallery.value.title}`
    }))
  : [])
</script>

<style scoped>
.gallery-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.gallery-date,
.gallery-photographer {
  margin: 0 0 0.5rem;
  color: var(--club-muted);
  font-size: 0.95rem;
}

.gallery-title {
  margin: 0 0 0.75rem;
  color: var(--club-charcoal);
}

.gallery-date {
  color: var(--club-blue);
  font-weight: 700;
}

.gallery-description {
  margin-bottom: 1.5rem;
}

.gallery-description :deep(p) {
  margin: 0 0 1rem;
}

.gallery-card {
  overflow: hidden;
  padding: 1.5rem;
  background: #ffffff;
  border-top: 6px solid var(--club-blue);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgb(32 37 42 / 10%);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.gallery-image {
  min-width: 0;
}

.gallery-image img {
  display: block;
  width: 100%;
  height: auto;
}

.gallery-not-found {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.gallery-not-found h1 {
  color: var(--club-charcoal);
  font-size: 1.75rem;
}

@media (max-width: 760px) {
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .gallery-page {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>