import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { parse } from 'yaml'
import Home from '../views/Home.vue'
import Events from '../views/Events.vue'
import About from '../views/About.vue'
import Membership from '../views/Membership.vue'
import Training from '../views/Training.vue'
import Partners from '../views/Partners.vue'
import Archive from '../views/Archive.vue'
import Gallery from '../views/Gallery.vue'

const pageFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})
const galleryFiles = import.meta.glob('../content/galleries/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const routes = [
  { path: '/', component: Home, meta: { cmsPage: 'home' } },
  { path: '/kalender', name: 'kalender', component: Events, alias: ['/events'], meta: { title: 'Kalender', cmsPage: 'events' } },
  { path: '/om-oss', component: About, meta: { title: 'Om oss', cmsPage: 'about' } },
  { path: '/bli-medlem', component: Membership, meta: { title: 'Bli medlem', cmsPage: 'membership' } },
  { path: '/kontakt', redirect: '/om-oss' },
  { path: '/traning', component: Training, meta: { title: 'Träning', cmsPage: 'training' } },
  { path: '/partners', component: Partners, meta: { title: 'Partners', cmsPage: 'partners' } },
  { path: '/arkiv', component: Archive, meta: { title: 'Inläggsarkiv', cmsPage: 'archive' } },
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

const getCmsTitle = (route) => {
  const source = route.name === 'gallery'
    ? galleryFiles[`../content/galleries/${route.params.slug}.md`]
    : pageFiles[`../content/pages/${route.meta.cmsPage}.md`]
  const frontMatterMatch = source?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  return typeof metadata.title === 'string' && metadata.title.trim()
    ? metadata.title
    : route.meta.title
}

router.afterEach((to) => {
  const title = getCmsTitle(to)
  document.title = title
    ? `${title} | Östersund Triathlon`
    : 'Östersund Triathlon'
})

export default router
