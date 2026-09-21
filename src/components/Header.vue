<template>
  <header class="header">
    <nav class="nav">
      <img class="logo" src="../resources/osdtri-jamtkraft.png" alt="OSD Tri" />
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
        <li><router-link to="/about" @click="menuOpen = false">Om oss</router-link></li>
        <li><router-link to="/bli-medlem" @click="menuOpen = false">Bli medlem</router-link></li>
        <li><router-link to="/contact" @click="menuOpen = false">Kontakt</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
</script>

<style scoped>
.header {
  background-color: #ffffff;
  padding: 1rem 2rem;
  border-bottom: 2px solid #6d4aff;
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
  color: #333;
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
    border: 1px solid #6d4aff;
    border-radius: 4px;
  }

  .menu-toggle span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: #333;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: calc(100% + 0.75rem);
    right: 0;
    z-index: 10;
    min-width: 12rem;
    padding: 0.5rem 0;
    background-color: #ffffff;
    border: 1px solid #e5e5e5;
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
    background-color: #f6f4ff;
  }
}
</style>
