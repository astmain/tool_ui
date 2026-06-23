import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import U1Design from '@u1design/vue'
import '@u1design/vue/style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(U1Design)
  }
} satisfies Theme
