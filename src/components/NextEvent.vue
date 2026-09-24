<template>
  <section class="upcoming-event">
    <div class="section-heading">
      <h2>Nästa händelse</h2>
      <p>
        Kom och träna tillsammans med Östersund Triathlon,
        <router-link to="/kalender">se alla händelser här.</router-link>
      </p>
    </div>

    <article class="event-card">
      <div class="event-content">
        <p class="event-date">{{ formatDate(event.date) }}</p>
        <h3>{{ event.title }}</h3>
        <p v-if="event.location || event.facebookUrl" class="event-location">
          <span v-if="event.location">{{ event.location }}</span>
          <span v-if="event.location && event.facebookUrl"> - </span>
          <a v-if="event.facebookUrl" :href="event.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Se händelsen på Facebook (öppnas i en ny flik)">
            Se händelsen på Facebook <span aria-hidden="true">↗</span>
          </a>
        </p>
        <div class="event-description" v-html="event.description"></div>
      </div>
    </article>
  </section>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.upcoming-event {
  max-width: 800px;
  margin: 4rem auto 0;
  padding: 0 2rem;
}

.event-card {
  overflow: hidden;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-content {
  padding: 1.5rem;
}

.event-date,
.event-location {
  margin: 0 0 0.5rem;
  color: #666;
}

.event-content h3 {
  margin: 0 0 0.75rem;
}

.event-description {
  color: #454545;
  line-height: 1.6;
}

.event-description :deep(p:last-child) {
  margin-bottom: 0;
}

.section-heading {
  margin-bottom: 2rem;
}

.section-heading h2 {
  margin-bottom: 0.5rem;
}

.section-heading p {
  color: #666;
}
</style>