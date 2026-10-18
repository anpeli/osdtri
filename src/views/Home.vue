<template>
  <div class="home-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" :backdrop-small="page.backdropSmall" :backdrop-position="page.backdropPosition" :backdrop-small-position="page.backdropSmallPosition" />
  </div>
  <NextEvent />
  <PostList />
  <router-link class="home-archive-link" to="/arkiv">Visa fler inlägg</router-link>
</template>

<script setup>
import PageHeader from '../components/PageHeader.vue'
import NextEvent from '../components/NextEvent.vue'
import PostList from '../components/PostList.vue'
import { getPageSettings } from '../utils/pageSettings'

const page = getPageSettings('home')

</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  font-size: 1.05rem;
}

.home-archive-link {
  display: block;
  width: fit-content;
  margin: -2rem auto 4rem;
  padding: 0.75rem 1.5rem;
  background: var(--club-lime);
  border-radius: 4px;
  color: var(--club-charcoal);
  font-weight: 700;
  text-decoration: none;
}

.home-archive-link:hover {
  opacity: 0.9;
}
</style>
