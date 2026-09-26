import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Events from '../views/Events.vue'
import About from '../views/About.vue'
import Membership from '../views/Membership.vue'
import Training from '../views/Training.vue'
import Partners from '../views/Partners.vue'
import Archive from '../views/Archive.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/kalender', name: 'kalender', component: Events, alias: ['/events'] },
  { path: '/om-oss', component: About },
  { path: '/bli-medlem', component: Membership },
  { path: '/kontakt', redirect: '/om-oss' },
  { path: '/traning', component: Training },
  { path: '/partners', component: Partners },
  { path: '/arkiv', component: Archive }
]

export default createRouter({
  history: window.location.protocol === 'file:'
    ? createWebHashHistory()
    : createWebHistory(import.meta.env.BASE_URL),
  routes
})
