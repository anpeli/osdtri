<template>
  <div class="about-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" :backdrop-small="page.backdropSmall" :backdrop-position="page.backdropPosition" :backdrop-small-position="page.backdropSmallPosition" />
    <div class="page-content" v-html="page.body"></div>
    <ContactForm :form-submit-endpoint="contactFormSettings.formSubmitToken || footerSettings.email || ''" />
  </div>
</template>

<script setup>
import { marked } from 'marked'
import PageHeader from '../components/PageHeader.vue'
import ContactForm from '../components/ContactForm.vue'
import { getPageSettings } from '../utils/pageSettings'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const footerSettings = getPageSettings('footer')
const contactFormSettings = getPageSettings('contact-form')
const pageSource = pageFiles['../content/pages/about.md'] || ''
const page = {
  ...getPageSettings('about'),
  body: marked.parse(pageSource)
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  font-size: 1.05rem;
}

.page-content :deep(p) {
  margin: 0 0 1.25rem;
  line-height: 1.8;
}

.page-content :deep(h3) {
  margin: 1.25rem 0 0.25rem;
  font-size: 1.25rem;
  line-height: 1.3;
}

.page-content :deep(ul) {
  margin: 0 0 0.75rem;
  padding-left: 1.5rem;
}

section {
  margin-bottom: 3rem;
}
</style>
