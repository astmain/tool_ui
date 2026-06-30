import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 3003,
    strictPort: true
  },
  preview: {
    host: '127.0.0.1',
    port: 3003,
    strictPort: true
  }
})