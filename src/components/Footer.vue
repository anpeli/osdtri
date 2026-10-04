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
          <li><router-link to="/" @click="scrollToTop">Hem</router-link></li>
          <li><router-link to="/kalender" @click="scrollToTop">Kalender</router-link></li>
          <li><router-link to="/bli-medlem" @click="scrollToTop">Bli medlem</router-link></li>
          <li><router-link to="/om-oss" @click="scrollToTop">Om oss</router-link></li>
          <li><router-link to="/partners" @click="scrollToTop">Partners</router-link></li>
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
      <a class="admin-link" :href="adminUrl" aria-label="Admin" title="Admin">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.18.45.62.75 1.1.75H21a2 2 0 1 1 0 4h-.09c-.48 0-.92.3-1.1.75Z" />
        </svg>
      </a>
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
const adminUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/admin/'
  : 'https://marvelous-cendol-4a4c36.netlify.app/admin/'

function scrollToTop() {
  window.scrollTo(0, 0)
}
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

.footer-bottom p {
  margin: 0;
}

.admin-link {
  display: inline-flex;
  flex: 0 0 auto;
  color: #cccccc;
}

.admin-link:hover {
  color: var(--club-blue);
}

.admin-link svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 768px) {
  .footer-bottom {
    text-align: left;
  }
}
</style>
