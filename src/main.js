import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pageSettings } from './utils/pageSettings'
import './styles/main.css'

const imagePaths = new Set()
for (const settings of Object.values(pageSettings)) {
	if (settings.backdrop) imagePaths.add(settings.backdrop)
	if (settings.backdropSmall) imagePaths.add(settings.backdropSmall)
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
