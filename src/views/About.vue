<template>
  <div class="about-page">
    <h1>Om OSD Tri</h1>
    
    <section class="about-intro">
      <p>
        OSD Triathlonklubb grundades med visionen att skapa en inkluderande 
        gemenskap för alla som älskar triathlon i Östersunds region.
      </p>
    </section>

    <section class="mission">
      <h2>Vår Mission</h2>
      <p>Att främja triathlon som sport genom träning, tävling och kamratskap.</p>
    </section>

    <section class="team">
      <h2>Styrelsen</h2>
      <div class="team-grid">
        <div class="team-member">
          <h3>Ordförande</h3>
          <p>[Namn]</p>
        </div>
        <div class="team-member">
          <h3>Näringssansvarig</h3>
          <p>[Namn]</p>
        </div>
        <div class="team-member">
          <h3>Teknikansvarig</h3>
          <p>[Namn]</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin-bottom: 3rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.team-member {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
