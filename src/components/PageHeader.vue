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
  },
  backdropPosition: {
    type: String
  }
})

const resolveAssetUrl = (assetPath) => {
  if (!assetPath?.startsWith('/')) {
    return assetPath
  }

  return `${import.meta.env.BASE_URL}${assetPath.slice(1)}`
}

const headerStyle = computed(() => {
  const backdrop = props.backdrop || settings.backdrop || '/assets/images/20190820_203136-desktop.jpg'
  const backdropPosition = props.backdropPosition || settings.backdropPosition || 'center 33%'

  return {
    '--page-header-backdrop': `url("${resolveAssetUrl(backdrop)}")`,
    '--page-header-backdrop-position': backdropPosition
  }
})
</script>

<style scoped>
.page-header {
  width: 100vw;
  height: 200px;
  margin-left: calc(50% - 50vw);
  margin-bottom: 2rem;
  padding: 3rem 2rem;
  color: #ffffff;
  border-bottom: 6px solid var(--club-blue);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(rgb(0 0 0 / 42%), rgb(0 0 0 / 42%)), var(--page-header-backdrop);
  background-position: var(--page-header-backdrop-position);
  background-size: cover;
}

.page-header h1 {
  font-size: clamp(1.6rem, 4vw, 2.5rem);
}
</style>
