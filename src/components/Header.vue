<template>
  <header class="header">
    <nav class="nav">
      <img class="logo" src="../resources/osdtri-jamtkraft.png" alt="OSD Tri" />
      <ul class="nav-links">
        <li><router-link to="/">Hem</router-link></li>
        <li><router-link to="/kalender">Kalender</router-link></li>
        <li><router-link to="/about">Om oss</router-link></li>
        <li><router-link to="/contact">Kontakt</router-link></li>
      </ul>
    </nav>
  </header>
</template>

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
</style>
