import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import U1Design from '@u1design/vue'
import '@u1design/vue/style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(U1Design)
  }
} satisfies Theme
