<template>
  <div class="documents-page">
    <PageHeader
      :title="page.title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
    />
    <section class="documents-list" aria-label="Dokument">
      <p v-if="documents.length === 0" class="empty-state">
        Inga dokument har publicerats ännu.
      </p>
      <ul v-else>
        <li v-for="document in documents" :key="document.document">
          <div class="document-details">
            <span class="document-title">{{ document.title }}</span>
          </div>
          <a
            class="download-link"
            :href="resolveDocumentUrl(document.document)"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visa dokument
            <span class="document-format">({{ getFileExtension(document.document) }})</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import { getPageSettings } from '../utils/pageSettings'
const documentFiles = import.meta.glob('../content/documents/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const parseFrontMatter = (source) => {
  const match = source?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  return match
    ? { metadata: parse(match[1]) || {}, body: match[2] || '' }
    : { metadata: {}, body: '' }
}

const page = getPageSettings('dokument')

const documents = Object.values(documentFiles)
  .map((source) => parseFrontMatter(source).metadata)
  .filter((document) =>
    typeof document.title === 'string' && typeof document.document === 'string'
  )

const resolveDocumentUrl = (path) => {
  if (/^(https?:)?\/\//i.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

const getFileExtension = (path) => path.split('.').pop()?.toUpperCase() || 'DOKUMENT'
</script>

<style scoped>
.documents-page {
  padding-bottom: 2rem;
}

.documents-list {
  max-width: 800px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
}

.documents-list ul {
  list-style: none;
  border-top: 1px solid var(--club-border);
}

.documents-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--club-border);
}

.document-details {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.document-title {
  font-weight: 700;
}

.download-link {
  flex-shrink: 0;
  padding: 0.6rem 1rem;
  color: var(--club-charcoal);
  background: var(--club-lime);
  border-radius: 4px;
  font-weight: 700;
  text-decoration: none;
}

.download-link:hover {
  opacity: 0.9;
}

.document-format {
  font-size: 0.85em;
}

.empty-state {
  padding: 1rem 0;
  color: var(--club-muted);
}

@media (max-width: 560px) {
  .documents-list li {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }

  .document-details {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
