import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  base: repositoryName ? `/${repositoryName}/` : './',
  plugins: [
    vue(),
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
