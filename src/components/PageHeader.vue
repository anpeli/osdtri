<template>
  <section class="page-header" :style="headerStyle">
    <h1>{{ title }}</h1>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  backdrop: {
    type: String,
    default: '/assets/images/img_2480.jpg'
  }
})

const headerStyle = computed(() => ({
  backgroundImage: `linear-gradient(rgb(0 0 0 / 42%), rgb(0 0 0 / 42%)), url("${props.backdrop}")`
}))
</script>

<style scoped>
.page-header {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding: 4rem 2rem;
  color: #ffffff;
  text-align: center;
  background-position: center;
  background-size: cover;
}
</style>
