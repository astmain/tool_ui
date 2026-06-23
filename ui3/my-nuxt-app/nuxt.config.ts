// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('./', import.meta.url))
const appDir = fileURLToPath(new URL('./app', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  alias: {
    '~': projectRoot,
    '@': appDir,
  },
  future: {
    compatibilityVersion: 4,
  },
  pages: {
    dir: 'pages',
  },
  css: [
    `${appDir}/assets/styles/main.scss`,
    `${appDir}/assets/css/tailwind.css`,
  ],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
  },
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
  vite: {
    resolve: {
      alias: {
        '~': projectRoot,
        '@': appDir,
      },
    },
  },
})
