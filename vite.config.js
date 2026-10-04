import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateCalendar } from './scripts/generate-calendar.mjs'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    {
      name: 'serve-calendar-feed',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.split('?')[0] !== '/events.ics') return next()
          if (request.method !== 'GET' && request.method !== 'HEAD') return next()

          response.statusCode = 200
          response.setHeader('Content-Type', 'text/calendar; charset=utf-8')
          response.setHeader('Cache-Control', 'no-store')
          response.end(request.method === 'HEAD' ? undefined : generateCalendar())
        })
      }
    },
    {
      name: 'copy-admin-config',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'admin/config.yml',
          source: readFileSync(resolve(__dirname, 'admin/config.yml'), 'utf8')
        })

        const imageDirectory = resolve(__dirname, 'assets/images')
        for (const fileName of readdirSync(imageDirectory)) {
          this.emitFile({
            type: 'asset',
            fileName: `assets/images/${fileName}`,
            source: readFileSync(resolve(imageDirectory, fileName))
          })
        }
      }
    }
  ],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
})
