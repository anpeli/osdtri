<template>
  <div class="archive-page">
    <PageHeader title="Inläggsarkiv" />
    <LatestPosts :archive="true" />
  </div>
</template>

<script setup>
import LatestPosts from '../components/LatestPosts.vue'
import PageHeader from '../components/PageHeader.vue'
</script>

<style scoped>
.archive-page {
  padding-bottom: 2rem;
}
</style>
