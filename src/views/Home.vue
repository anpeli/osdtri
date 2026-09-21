<template>
  <section class="hero">
    <h1>Välkommen till OSD Tri</h1>
    <p>Östersunds triathlonklubb</p>
    <button @click="$router.push('/events')">Se Kommande Event</button>
  </section>

  <section class="features">
    <div class="feature-card">
      <h3>Träning</h3>
      <p>Regelbunden träning för alla nivåer</p>
    </div>
    <div class="feature-card">
      <h3>Tävlingar</h3>
      <p>Deltagande i nationella evenemang</p>
    </div>
    <div class="feature-card">
      <h3>Gemenskap</h3>
      <p>Möt andra entusiaster</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.feature-card {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
