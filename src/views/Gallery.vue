<template>
  <div v-if="gallery" class="gallery-page" :class="{ 'gallery-page--share': isShareMode }">
    <PageHeader
      :title="gallery.title || page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
      :compact="isShareMode"
    />
    <article class="gallery-card">
      <p v-if="gallery.date" class="gallery-date">{{ formatDate(gallery.date) }}</p>
      <h3 v-if="!isShareMode" class="gallery-title">
        {{ gallery.title || page.title }}
        <button
          class="gallery-share-button"
          type="button"
          aria-label="Kopiera länk till galleriet"
          title="Kopiera länk till galleriet"
          @click="copyGalleryLink"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71m2.72 6.36a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71" />
          </svg>
        </button>
      </h3>
      <p v-if="copyStatus" class="gallery-copy-status" aria-live="polite">{{ copyStatus }}</p>
      <div v-if="gallery.body" class="gallery-description page-content" v-html="gallery.body"></div>
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import ImageDialog from '../components/ImageDialog.vue'
import { getPageSettings } from '../utils/pageSettings'

const route = useRoute()
const router = useRouter()
const isShareMode = computed(() => route.query.share === '1' || route.query.share === 'true')
const copyStatus = ref('')
const galleryFiles = import.meta.glob('../content/galleries/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const page = getPageSettings('gallery')

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

const copyGalleryLink = async () => {
  const slug = route.params.slug
  if (typeof slug !== 'string' || !slug) {
    copyStatus.value = 'Länken till galleriet kunde inte skapas.'
    return
  }

  const galleryUrl = new URL(
    router.resolve({ name: 'gallery', params: { slug } }).href,
    window.location.href
  )
  galleryUrl.searchParams.set('share', '1')

  try {
    await navigator.clipboard.writeText(galleryUrl.href)
    copyStatus.value = 'Länken till galleriet kopierades.'
  } catch {
    copyStatus.value = 'Kunde inte kopiera länken till galleriet. Kontrollera webbläsarens behörigheter.'
  }
}
</script>

<style scoped>
.gallery-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.gallery-page--share {
  padding-top: 1.25rem;
}

.gallery-copy-status {
  margin: -0.5rem 0 0.75rem;
  color: var(--club-muted);
  font-size: 0.9rem;
}

.gallery-date {
  margin: 0 0 0.5rem;
  color: var(--club-muted);
  font-size: 0.95rem;
}

.gallery-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  color: var(--club-charcoal);
}

.gallery-share-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.35rem;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--club-blue);
  cursor: pointer;
}

.gallery-share-button:hover {
  background: rgb(40 123 159 / 10%);
}

.gallery-share-button:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 2px;
}

.gallery-share-button svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
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

  .gallery-page--share {
    padding-top: 1rem;
  }
}
</style>