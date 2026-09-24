<template>
  <div class="contact-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" />

    <div class="contact-card">
      <div class="contact-content" v-html="page.body"></div>
    </div>

    <ContactForm />
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { parse } from 'yaml'
import PageHeader from '../components/PageHeader.vue'
import ContactForm from '../components/ContactForm.vue'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const pageSource = pageFiles['../content/pages/contact.md']
const frontMatterMatch = pageSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const pageMetadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}

const page = {
  title: pageMetadata.title || 'Kontakt',
  backdrop: pageMetadata.backdrop,
  body: marked.parse(frontMatterMatch?.[2] || '')
}
</script>

<style scoped>
.contact-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.contact-card {
  background: white;
  padding: 1.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.contact-content :deep(h2),
.contact-content :deep(h3) {
  margin-top: 0;
}

.contact-content :deep(p) {
  margin: 0 0 0.9rem;
  line-height: 1.7;
}

.contact-content :deep(ul) {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
}

.contact-content :deep(li) {
  margin-bottom: 0.4rem;
}

.contact-content :deep(a) {
  color: #6d4aff;
  text-decoration: none;
}

.contact-content :deep(a:hover) {
  text-decoration: underline;
}
</style>
