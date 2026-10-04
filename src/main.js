import { createApp } from 'vue'
import { parse } from 'yaml'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const pageFiles = import.meta.glob('./content/pages/*.md', {
	eager: true,
	import: 'default',
	query: '?raw'
})
const settingsFiles = import.meta.glob('./content/settings/site.md', {
	eager: true,
	import: 'default',
	query: '?raw'
})

const getMetadata = (source) => {
	const match = source?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
	return match ? parse(match[1]) || {} : {}
}

const settings = getMetadata(Object.values(settingsFiles)[0])
const defaultBackdrop = settings.backdrop || '/assets/images/20190820_203136-medium.jpg'
const imagePaths = new Set([defaultBackdrop, settings.backdropSmall || defaultBackdrop])

for (const source of Object.values(pageFiles)) {
	const page = getMetadata(source)
	const desktopBackdrop = page.backdrop || defaultBackdrop
	imagePaths.add(desktopBackdrop)
	imagePaths.add(page.backdropSmall || settings.backdropSmall || desktopBackdrop)
}

for (const imagePath of imagePaths) {
	const preload = document.createElement('link')
	preload.rel = 'preload'
	preload.as = 'image'
	preload.href = imagePath.startsWith('/')
		? `${import.meta.env.BASE_URL}${imagePath.slice(1)}`
		: imagePath
	document.head.append(preload)
}

createApp(App).use(router).mount('#app')
