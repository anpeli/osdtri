<template>
  <header class="header">
    <nav class="nav">
      <div class="logo">OSD Tri</div>
      <ul class="nav-links">
        <li><router-link to="/">Hem</router-link></li>
        <li><router-link to="/events">Event</router-link></li>
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
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
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
