<template>
  <div class="contact-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" />
    <h2 class="contact-title">Kontakt</h2>
    
    <div class="contact-info">
      <div class="info-item">
        <h3>Styrelse</h3>
        <div class="info-content" v-html="page.styrelse"></div>
      </div>
      
      <div class="info-item">
        <h3>Email/Facebook/Instagram</h3>
        <div class="info-content" v-html="page.social"></div>
      </div>
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
  styrelse: marked.parse(pageMetadata.styrelse || ''),
  social: marked.parse(pageMetadata.social || '')
}

</script>

<style scoped>
.contact-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.contact-title {
  margin: 0;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.info-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-content :deep(p) {
  margin: 0 0 0.75rem;
}

.info-content :deep(p:last-child) {
  margin-bottom: 0;
}

.info-content :deep(ul) {
  margin: 0;
  padding-left: 1.25rem;
}

.info-content :deep(a) {
  color: #6d4aff;
  text-decoration: none;
}

.info-content :deep(a:hover) {
  text-decoration: underline;
}
</style>
