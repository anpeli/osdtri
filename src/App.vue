<template>
  <Header :compact="isSharePage" />
  <main class="content">
    <router-view />
  </main>
  <Footer />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isSharePage = computed(() => route.query.share === '1' || route.query.share === 'true')
</script>
