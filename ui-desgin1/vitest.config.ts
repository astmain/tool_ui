import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: resolve(__dirname, 'packages/components/src') + '/' }
    ]
  },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/components/src/**/*.test.ts']
  }
})
