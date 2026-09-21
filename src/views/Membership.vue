<template>
  <div class="membership-page">
    <h1>Bli medlem</h1>

    <p>Som medlem i Östersund Triathlon får du:</p>

    <ul class="benefits-list">
      <li>Tillgång till medlemsforum</li>
      <li>Gemensamma träningsmöjligheter</li>
      <li>Delta i träningsstävlingar</li>
      <li>Köpa klubbkläder</li>
      <li>Tävla för klubben</li>
      <li>Rabatter och förmåner hos samarbetspartner</li>
      <li>Billigare att ta med cykel när du reser med SAS</li>
      <li>Möjlighet att delta i gemensamma träningsläger/resor när sådana anordnas</li>
    </ul>

    <p>
      Medlemsavgiften är 300 kr per kalenderår och vi är anslutna till Svenska Triathlonförbundet.
    </p>

    <p>
      <strong>Avgiften inkluderar <em>inte</em> licensavgift till förbundet.</strong>
      Tävlingslicenser tecknas på egen hand av den enskilde medlemmen.
    </p>

    <p>Medlemskap tecknas på följande vis:</p>

    <ol class="steps-list">
      <li>Betala in 300 kr på bankgironummer 159-8408</li>
      <li>Skicka ett e-mail till <a href="mailto:kassor.osdtri@hotmail.se">kassor.osdtri@hotmail.se</a> med ditt namn och mobilnummer.</li>
    </ol>

    <h2>Klart du också ska bli medlem i Östersund Triathlon!</h2>
  </div>
</template>

<style scoped>
.membership-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.7;
}

.membership-page h1,
.membership-page h2 {
  margin-bottom: 1rem;
}

.membership-page p,
.membership-page li {
  margin-bottom: 0.75rem;
}

.benefits-list,
.steps-list {
  padding-left: 1.5rem;
  margin: 1rem 0 2rem;
}

.membership-page a {
  color: #6d4aff;
  text-decoration: none;
}

.membership-page a:hover {
  text-decoration: underline;
}
</style>
