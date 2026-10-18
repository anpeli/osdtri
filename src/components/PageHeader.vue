<template>
  <section class="page-header" :class="{ 'page-header--compact': compact }" :style="headerStyle">
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
  compact: {
    type: Boolean,
    default: false
  },
  backdrop: {
    type: String
  },
  backdropSmall: {
    type: String
  },
  backdropPosition: {
    type: String
  },
  backdropSmallPosition: {
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
  const backdropSmall = props.backdropSmall || props.backdrop
  const backdropPositionMobile = props.backdropSmallPosition || props.backdropPosition

  return {
    '--page-header-backdrop': `url("${resolveAssetUrl(props.backdrop)}")`,
    '--page-header-backdrop-small': `url("${resolveAssetUrl(backdropSmall)}")`,
    '--page-header-backdrop-position-desktop': props.backdropPosition,
    '--page-header-backdrop-position-mobile': backdropPositionMobile
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
  background-position: var(--page-header-backdrop-position-desktop);
  background-size: cover;
}

.page-header h1 {
  font-size: clamp(1.6rem, 4vw, 2.5rem);
}

.page-header--compact {
  width: auto;
  height: auto;
  margin: 0 0 0.75rem;
  padding: 0;
  color: var(--club-charcoal);
  border: 0;
  text-align: left;
  justify-content: flex-start;
  background: none;
}

.page-header--compact h1 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  line-height: 1.25;
}

@media (max-width: 640px) {
  .page-header {
    background-image: linear-gradient(rgb(0 0 0 / 42%), rgb(0 0 0 / 42%)), var(--page-header-backdrop-small);
    background-position: var(--page-header-backdrop-position-mobile);
  }

  .page-header--compact {
    background-image: none;
  }
}
</style>
