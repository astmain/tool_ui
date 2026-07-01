import U1Design from 'tool_ui1'

// 全局注册 tool_ui1 组件库
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(U1Design)
})
