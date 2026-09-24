<template>
  <section class="page-header" :style="headerStyle">
    <h1>{{ title }}</h1>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { parse } from 'yaml'

const settingsFiles = import.meta.glob('../content/settings/site.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const settingsSource = settingsFiles['../content/settings/site.md']
const settingsFrontMatterMatch = settingsSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const settings = settingsFrontMatterMatch ? parse(settingsFrontMatterMatch[1]) || {} : {}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  backdrop: {
    type: String
  }
})

const headerStyle = computed(() => ({
  backgroundImage: `linear-gradient(rgb(0 0 0 / 42%), rgb(0 0 0 / 42%)), url("${props.backdrop || settings.backdrop || '/assets/images/20190820_203136.jpg'}")`
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
