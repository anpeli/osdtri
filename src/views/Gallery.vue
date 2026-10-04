<template>
  <div v-if="gallery" class="gallery-page">
    <PageHeader :title="gallery.title || 'Galleri'" />
    <article class="gallery-card">
      <p v-if="gallery.photographer" class="gallery-photographer">Fotograf: {{ gallery.photographer }}</p>
      <div v-if="gallery.images.length" class="gallery-grid" :aria-label="gallery.title">
        <figure v-for="(image, index) in gallery.images" :key="`${image}-${index}`" class="gallery-image">
          <img :src="resolveImageUrl(image)" :alt="`Fotografi ${index + 1} från ${gallery.title}`" />
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
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'

const route = useRoute()
const galleryFiles = import.meta.glob('../content/galleries/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const gallery = computed(() => {
  const source = galleryFiles[`../content/galleries/${route.params.slug}.md`]
  if (!source) return null

  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

  return {
    ...metadata,
    images: Array.isArray(metadata.images) ? metadata.images.filter((image) => typeof image === 'string') : []
  }
})

const resolveImageUrl = (imagePath) => imagePath.startsWith('/')
  ? `${import.meta.env.BASE_URL}${imagePath.slice(1)}`
  : imagePath
</script>

<style scoped>
.gallery-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.gallery-photographer {
  margin: 0 0 1.5rem;
  color: var(--club-muted);
  font-size: 0.95rem;
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