/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'legacy',
        additionalData: `@use "src/styles/_variables.scss" as *;
`,
      },
    },
  },
})
