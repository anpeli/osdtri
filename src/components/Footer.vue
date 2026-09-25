<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Östersund Triathlon</h3>
        <p>Gemenskapen för triathleter i Östersund</p>
      </div>

      <div class="footer-section">
        <h4>Länkar</h4>
        <ul>
          <li><router-link to="/">Hem</router-link></li>
          <li><router-link to="/kalender">Kalender</router-link></li>
          <li><router-link to="/om-oss">Om oss</router-link></li>
          <li><router-link to="/bli-medlem">Bli medlem</router-link></li>
          <li><router-link to="/kontakt">Kontakt</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Kontakt</h4>
        <address>
          <p><a :href="`mailto:${settings.email}`">Email: {{ settings.email }}</a></p>
          <p><a :href="settings.facebookUrl" target="_blank" rel="noopener noreferrer">Facebook</a></p>
          <p><a :href="settings.instagramUrl" target="_blank" rel="noopener noreferrer">Instagram</a></p>
        </address>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Östersund Triathlon. Alla rättigheter förbehållna.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { parse } from 'yaml'

const settingsFiles = import.meta.glob('../content/settings/site.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const settingsSource = settingsFiles['../content/settings/site.md']
const settingsFrontMatterMatch = settingsSource?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
const settings = settingsFrontMatterMatch ? parse(settingsFrontMatterMatch[1]) || {} : {}

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: var(--club-charcoal);
  color: #ffffff;
  padding: 2rem 0 0 0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: var(--club-lime);
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #cccccc;
  text-decoration: none;
}

.footer-section a:hover {
  color: var(--club-blue);
}

.footer-section address p {
  margin-bottom: 0.25rem;
  color: #cccccc;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgb(255 255 255 / 18%);
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
