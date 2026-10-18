<template>
  <div class="archive-page">
    <PageHeader :title="page.title" :backdrop="page.backdrop" :backdrop-small="page.backdropSmall" :backdrop-position="page.backdropPosition" :backdrop-small-position="page.backdropSmallPosition" />
    <PostList :archive="true" />
  </div>
</template>

<script setup>
import PostList from '../components/PostList.vue'
import PageHeader from '../components/PageHeader.vue'
import { getPageSettings } from '../utils/pageSettings'

const page = getPageSettings('archive')
</script>

<style scoped>
.archive-page {
  padding-bottom: 2rem;
}

</style>
