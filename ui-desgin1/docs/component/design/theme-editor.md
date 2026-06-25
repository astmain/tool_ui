# 主题编辑器

主题编辑器是一个可视化工具, 用于预览和生成 U1Design 主题配置. 通过编辑器可以实时调整 CSS 变量, 生成的主题代码可直接复制到项目中使用.

## 打开编辑器

使用 `U1ThemeEditorDialog` 组件打开主题编辑器对话框:

```vue
<template>
  <u1-button @click="showEditor = true">自定义主题</u1-button>
  <u1-theme-editor-dialog v-model="showEditor" />
</template>

<script setup>
import { ref } from 'vue'
import { U1ThemeEditorDialog } from '@u1design/vue'

const showEditor = ref(false)
</script>
```

## 获取主题代码

编辑器底部提供"复制代码"按钮, 点击后生成的主题配置格式如下:

```js
import { applyU1Theme } from '@u1design/vue/theme'

applyU1Theme({
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399',
  text: '#303133',
  textRegular: '#606266',
  border: '#dcdfe6',
  borderLight: '#e4e7ed',
  background: '#ffffff',
  radiusBase: '4px',
  shadowLight: '0 4px 12px rgb(31 45 61 / 8%)',
  shadowFocus: '0 0 0 3px rgb(64 158 255 / 18%)'
})
```

## 主题变量说明

| 变量 | CSS 变量 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `primary` | `--u1-color-primary` | 主题色 | #409eff |
| `success` | `--u1-color-success` | 成功色 | #67c23a |
| `warning` | `--u1-color-warning` | 警告色 | #e6a23c |
| `danger` | `--u1-color-danger` | 危险色 | #f56c6c |
| `info` | `--u1-color-info` | 信息色 | #909399 |
| `text` | `--u1-color-text` | 主要文本色 | #303133 |
| `textRegular` | `--u1-color-text-regular` | 常规文本色 | #606266 |
| `border` | `--u1-color-border` | 边框色 | #dcdfe6 |
| `borderLight` | `--u1-color-border-light` | 浅边框色 | #e4e7ed |
| `background` | `--u1-color-bg` | 背景色 | #ffffff |
| `radiusBase` | `--u1-radius-base` | 基础圆角 | 4px |
| `shadowLight` | `--u1-shadow-light` | 轻阴影 | 0 4px 12px rgb(31 45 61 / 8%) |
| `shadowFocus` | `--u1-shadow-focus` | 聚焦阴影 | 0 0 0 3px rgb(64 158 255 / 18%) |

## 预览效果说明

主题编辑器内的预览效果会实时应用, 但在页面刷新后会恢复默认. 如需持久化主题, 请将生成的代码复制到项目中.

## 用户项目用法

```ts
import '@u1design/vue/style.css'
import { applyU1Theme } from '@u1design/vue/theme'

applyU1Theme({
  primary: '#1677ff',
  radiusBase: '8px'
})
```

建议在 `main.ts` 中尽早执行 `applyU1Theme`.
