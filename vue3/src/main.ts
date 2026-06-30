import { createApp } from 'vue'
import U1Design from 'tool_ui1'
import 'tool_ui1/style.css'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App).use(router).use(U1Design).mount('#app')