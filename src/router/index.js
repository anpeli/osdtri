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
import Event from '../views/Event.vue'

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
const eventFiles = import.meta.glob('../content/events/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})
const postFiles = import.meta.glob('../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const getTitleFromSource = (source) => {
  const frontMatterMatch = source?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  const metadata = frontMatterMatch ? parse(frontMatterMatch[1]) || {} : {}
  return typeof metadata.title === 'string' && metadata.title.trim()
    ? metadata.title
    : undefined
}

const getCmsPageTitle = (page) =>
  getTitleFromSource(pageFiles[`../content/pages/${page}.md`])

const routes = [
  { path: '/', component: Home, meta: { title: getCmsPageTitle('home'), cmsPage: 'home' } },
  { path: '/kalender', name: 'kalender', component: Events, alias: ['/events'], meta: { title: getCmsPageTitle('events'), cmsPage: 'events' } },
  { path: '/om-oss', component: About, meta: { title: getCmsPageTitle('about'), cmsPage: 'about' } },
  { path: '/bli-medlem', component: Membership, meta: { title: getCmsPageTitle('membership'), cmsPage: 'membership' } },
  { path: '/kontakt', redirect: '/om-oss' },
  { path: '/traning', component: Training, meta: { title: getCmsPageTitle('training'), cmsPage: 'training' } },
  { path: '/partners', component: Partners, meta: { title: getCmsPageTitle('partners'), cmsPage: 'partners' } },
  { path: '/arkiv', component: Archive, meta: { title: getCmsPageTitle('archive'), cmsPage: 'archive' } },
  { path: '/inlagg/:slug', name: 'post', component: () => import('../views/Post.vue'), meta: { title: getCmsPageTitle('post'), cmsPage: 'post' } },
  { path: '/galleri/:slug', name: 'gallery', component: Gallery, meta: { title: getCmsPageTitle('gallery') } },
  { path: '/handelse/:slug', name: 'event', component: Event, meta: { title: getCmsPageTitle('event'), cmsPage: 'event' } }
]

const router = createRouter({
  history: window.location.protocol === 'file:'
    ? createWebHashHistory()
    : createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

const getCmsTitle = (route) => {
  if (route.name === 'post') {
    return getTitleFromSource(postFiles[`../content/posts/${route.params.slug}.md`])
      || route.meta.title
  }
  if (route.name === 'gallery') {
    return getTitleFromSource(galleryFiles[`../content/galleries/${route.params.slug}.md`])
      || route.meta.title
  }
  if (route.name === 'event') {
    return getTitleFromSource(eventFiles[`../content/events/${route.params.slug}.md`])
      || route.meta.title
  }
  return route.meta.title
}

router.afterEach((to) => {
  const title = getCmsTitle(to)
  document.title = title
    ? `Östersund Triathlon | ${title}`
    : 'Östersund Triathlon'
})

export default router
