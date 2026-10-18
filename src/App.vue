<template>
  <Header :compact="isSharePage" />
  <main class="content">
    <router-view />
  </main>
  <Footer :contact-settings="contactSettings" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { getPageSettings } from './utils/pageSettings'

const route = useRoute()
const isSharePage = computed(() => route.query.share === '1' || route.query.share === 'true')
const contactSettings = getPageSettings('about')
</script>
