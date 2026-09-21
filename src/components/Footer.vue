<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>OSD Tri</h3>
        <p>Östersunds Triathlonklubb</p>
        <p>Gemenskapen för triathleter i Östersund</p>
      </div>

      <div class="footer-section">
        <h4>Länkar</h4>
        <ul>
          <li><router-link to="/">Hem</router-link></li>
          <li><router-link to="/kalender">Kalender</router-link></li>
          <li><router-link to="/about">Om oss</router-link></li>
          <li><router-link to="/bli-medlem">Bli medlem</router-link></li>
          <li><router-link to="/contact">Kontakt</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Kontakt</h4>
        <address>
          <p>Email: info@osdtri.se</p>
          <p>Postadress:</p>
          <p>OSD Tri</p>
          <p>850 00 Östersund</p>
        </address>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Östersund Triathlon. Alla rättigheter förbehållna.</p>
      <div class="social-links">
        <a href="#" aria-label="Facebook">FB</a>
        <a href="#" aria-label="Instagram">IG</a>
        <a href="#" aria-label="Strava">STV</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #1a1a2e;
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
  color: #6d4aff;
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
  color: #6d4aff;
}

.address p {
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
  border-top: 1px solid #333;
  flex-wrap: wrap;
  gap: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  width: 40px;
  height: 40px;
  background-color: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.75rem;
  transition: background-color 0.3s;
}

.social-links a:hover {
  background-color: #6d4aff;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
