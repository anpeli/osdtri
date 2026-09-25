<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/" aria-label="OSD Tri - hem">
        <img class="logo" :src="`${assetBaseUrl}assets/images/osdtri-jamtkraft.png`" alt="OSD Tri" />
      </router-link>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="main-menu"
        :aria-label="menuOpen ? 'Stäng meny' : 'Öppna meny'"
        @click="menuOpen = !menuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul id="main-menu" class="nav-links" :class="{ 'nav-links--open': menuOpen }">
        <li><router-link to="/" @click="menuOpen = false">Hem</router-link></li>
        <li><router-link to="/kalender" @click="menuOpen = false">Kalender</router-link></li>
        <li><router-link to="/om-oss" @click="menuOpen = false">Om oss</router-link></li>
        <li><router-link to="/traning" @click="menuOpen = false">Träning</router-link></li>
        <li><router-link to="/bli-medlem" @click="menuOpen = false">Bli medlem</router-link></li>
        <li><router-link to="/kontakt" @click="menuOpen = false">Kontakt</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const assetBaseUrl = import.meta.env.BASE_URL
const menuOpen = ref(false)
</script>

<style scoped>
.header {
  background-color: var(--club-charcoal);
  padding: 1rem 2rem;
  border-bottom: 4px solid var(--club-lime);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.logo {
  display: block;
  width: 180px;
  height: auto;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  padding: 0.35rem 0;
  border-bottom: 3px solid transparent;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--club-lime);
  border-bottom-color: var(--club-lime);
}

.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  .header {
    padding: 0.75rem 1rem;
  }

  .logo {
    width: 150px;
  }

  .menu-toggle {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 2.75rem;
    height: 2.5rem;
    padding: 0.55rem 0.65rem;
    background: transparent;
    border: 1px solid var(--club-lime);
    border-radius: 4px;
  }

  .menu-toggle span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--club-lime);
  }

  .nav-links {
    display: none;
    position: absolute;
    top: calc(100% + 0.75rem);
    right: 0;
    z-index: 10;
    min-width: 12rem;
    padding: 0.5rem 0;
    background-color: var(--club-charcoal);
    border: 1px solid var(--club-lime);
    box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  }

  .nav-links--open {
    display: block;
  }

  .nav-links li a {
    display: block;
    padding: 0.65rem 1rem;
  }

  .nav-links li a:hover,
  .nav-links li a.router-link-active {
    background-color: rgb(139 203 63 / 16%);
  }
}
</style>
