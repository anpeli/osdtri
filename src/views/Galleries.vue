<template>
  <div class="galleries-page" :class="{ 'galleries-page--share': isShareMode }">
    <PageHeader
      :title="page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
      :compact="isShareMode"
    />
    <div class="section-heading galleries-heading">
      <h2>Bildgallerier</h2>
    </div>
    <section class="galleries-list" aria-label="Bildgallerier">
      <p v-if="galleries.length === 0" class="empty-state">
        Inga bildgallerier har publicerats ännu.
      </p>
      <ul v-else>
        <li v-for="gallery in galleries" :key="gallery.slug">
          <div class="galleries-item-main">
            <div class="galleries-item-title">
              <router-link :to="`/galleri/${gallery.slug}`">
                {{ gallery.title }}
              </router-link>
              <button
                class="galleries-share-button"
                type="button"
                :aria-label="`Kopiera länk till ${gallery.title}`"
                :title="`Kopiera länk till ${gallery.title}`"
                @click="copyGalleryLink(gallery.slug)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71m2.72 6.36a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71" />
                </svg>
              </button>
            </div>
            <p v-if="copyStatuses[gallery.slug]" class="galleries-copy-status" aria-live="polite">
              {{ copyStatuses[gallery.slug] }}
            </p>
          </div>
          <time v-if="gallery.date" :datetime="gallery.date">{{ formatDate(gallery.date) }}</time>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import { getPageSettings } from '../utils/pageSettings'

const route = useRoute()
const router = useRouter()
const isShareMode = computed(() => route.query.share === '1' || route.query.share === 'true')
const copyStatuses = ref({})

const galleryFiles = import.meta.glob('../content/galleries/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const page = getPageSettings('galleries')
const copyGalleryLink = async (slug) => {
  const galleryUrl = new URL(
    router.resolve({ name: 'gallery', params: { slug } }).href,
    window.location.href
  )
  galleryUrl.searchParams.set('share', '1')

  try {
    await navigator.clipboard.writeText(galleryUrl.href)
    copyStatuses.value[slug] = 'Länken till galleriet kopierades.'
  } catch {
    copyStatuses.value[slug] = 'Kunde inte kopiera länken till galleriet. Kontrollera webbläsarens behörigheter.'
  }
}

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

.galleries-page--share {
  padding-top: 1.25rem;
}

.galleries-heading {
  max-width: 800px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
}

.galleries-copy-status {
  margin-top: 0.25rem;
  color: var(--club-muted);
  font-size: 0.9rem;
}

.galleries-item-main {
  min-width: 0;
}

.galleries-item-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.galleries-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.galleries-share-button {
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

.galleries-share-button:hover {
  background: rgb(40 123 159 / 10%);
}

.galleries-share-button:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 2px;
}

.galleries-share-button svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
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

@media (max-width: 480px) {
  .galleries-page--share {
    padding-top: 1rem;
  }
}
</style>
