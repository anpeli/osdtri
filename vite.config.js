import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'node:fs'
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
