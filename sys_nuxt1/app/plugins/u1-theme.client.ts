import { applyU1Theme } from 'tool_ui1/theme'

// 应用 tool_ui1 全局主题（仅客户端，依赖 document）
export default defineNuxtPlugin(() => {
  applyU1Theme({
    primary: '#225ce5',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#dc2626',
    info: '#e5e7eb',
    text: '#303133',
    textRegular: '#606266',
    border: '#dcdfe6',
    borderLight: '#e4e7ed',
    background: '#ffffff',
    radiusBase: '10px',
    shadowLight: '0 4px 12px rgb(31 45 61 / 8%)',
    shadowFocus: '0 0 0 3px rgb(64 158 255 / 18%)',
  })
})
