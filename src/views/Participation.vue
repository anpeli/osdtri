<template>
  <div class="participation-page" :class="{ 'participation-page--share': isShareMode }">
    <PageHeader
      :title="title"
      :backdrop="page.backdrop"
      :backdrop-small="page.backdropSmall"
      :backdrop-position="page.backdropPosition"
      :backdrop-small-position="page.backdropSmallPosition"
      :compact="isShareMode"
    />
    <ParticipationForm
      :show-title="!isShareMode"
    />
    <router-link v-if="!isShareMode" class="back-link" to="/om-oss">Tillbaka till Om oss</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import ParticipationForm from '../components/ParticipationForm.vue'
import { getPageSettings } from '../utils/pageSettings'

const route = useRoute()
const isShareMode = computed(() => route.query.share === '1' || route.query.share === 'true')
const title = 'Berätta vilka evenemang du planerar att delta i'
const page = getPageSettings('participation')
</script>

<style scoped>
.participation-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.participation-page--share {
  padding-top: 1.25rem;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #287b9f;
  font-weight: 600;
}

@media (max-width: 480px) {
  .participation-page {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .participation-page--share {
    padding-top: 1rem;
  }
}
</style>
