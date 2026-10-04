import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Events from '../views/Events.vue'
import About from '../views/About.vue'
import Membership from '../views/Membership.vue'
import Training from '../views/Training.vue'
import Partners from '../views/Partners.vue'
import Archive from '../views/Archive.vue'
import Gallery from '../views/Gallery.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/kalender', name: 'kalender', component: Events, alias: ['/events'], meta: { title: 'Kalender' } },
  { path: '/om-oss', component: About, meta: { title: 'Om oss' } },
  { path: '/bli-medlem', component: Membership, meta: { title: 'Bli medlem' } },
  { path: '/kontakt', redirect: '/om-oss' },
  { path: '/traning', component: Training, meta: { title: 'Träning' } },
  { path: '/partners', component: Partners, meta: { title: 'Partners' } },
  { path: '/arkiv', component: Archive, meta: { title: 'Inläggsarkiv' } },
  { path: '/galleri/:slug', name: 'gallery', component: Gallery, meta: { title: 'Galleri' } }
]

const router = createRouter({
  history: window.location.protocol === 'file:'
    ? createWebHashHistory()
    : createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Östersund Triathlon`
    : 'Östersund Triathlon'
})

export default router
