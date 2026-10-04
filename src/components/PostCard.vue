<template>
  <article :id="`post-${post.slug}`" class="post-card" :class="{ 'post-card--single': single }">
    <img v-if="post.image" :src="post.image" :alt="post.title" class="post-image" />
    <div class="post-content">
      <p v-if="post.date" class="post-date">{{ formatDate(post.date) }}</p>
      <h3 v-if="showTitle" class="post-title">
        <router-link
          v-if="linkTitle"
          :to="{ name: 'post', params: { slug: post.slug } }"
        >
          {{ post.title }}
        </router-link>
        <template v-else>{{ post.title }}</template>
        <button
          class="post-link-button"
          type="button"
          aria-label="Kopiera länk till inlägget"
          title="Kopiera länk till inlägget"
          @click="copyPostLink"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71m2.72 6.36a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71" />
          </svg>
        </button>
      </h3>
      <p v-if="copyStatus" class="post-copy-status" aria-live="polite">{{ copyStatus }}</p>
      <p v-if="post.author" class="post-author">Av {{ post.author }}</p>
      <div class="post-body" v-html="post.body"></div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const copyStatus = ref('')

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  linkTitle: {
    type: Boolean,
    default: false
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  single: {
    type: Boolean,
    default: false
  }
})

const copyPostLink = async () => {
  const slug = props.post.slug || route.params.slug
  if (typeof slug !== 'string' || !slug) {
    copyStatus.value = 'Länken till inlägget kunde inte skapas.'
    return
  }

  const postUrl = new URL(
    router.resolve({ name: 'post', params: { slug } }).href,
    window.location.href
  ).href

  try {
    await navigator.clipboard.writeText(postUrl)
    copyStatus.value = 'Länken kopierades.'
  } catch {
    copyStatus.value = 'Kunde inte kopiera länken. Kontrollera webbläsarens behörigheter.'
  }
}

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

.post-card--single .post-image {
  height: auto;
  max-height: 420px;
}

.post-card--single .post-date {
  color: var(--club-muted);
  font-weight: 400;
  text-transform: none;
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

.post-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-link-button {
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

.post-link-button:hover {
  background: rgb(40 123 159 / 10%);
}

.post-link-button:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 2px;
}

.post-link-button svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.post-copy-status {
  margin: -0.5rem 0 0.75rem;
  color: var(--club-muted);
  font-size: 0.9rem;
}

.post-content h3 a {
  color: inherit;
  text-decoration: none;
}

.post-content h3 a:hover {
  text-decoration: underline;
  text-decoration-color: var(--club-lime);
  text-decoration-thickness: 0.15em;
  text-underline-offset: 0.15em;
}

.post-content h3 a:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 3px;
}

.post-body {
  color: var(--club-ink);
  font-size: 1.05rem;
  line-height: 1.75;
}

.post-card--single .post-body {
  margin-top: 1.5rem;
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
  cursor: zoom-in;
}

.post-body :deep(img:focus-visible) {
  outline: 3px solid var(--club-lime);
  outline-offset: 3px;
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
