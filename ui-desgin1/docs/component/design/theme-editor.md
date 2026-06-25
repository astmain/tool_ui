# 主题编辑器

主题编辑器是一个可视化工具，用于预览和生成 U1Design 主题配置。通过编辑器可以实时调整 CSS 变量，生成的主题代码可直接复制到项目中使用。

## 打开编辑器

使用 `U1ThemeEditorDialog` 组件打开主题编辑器对话框：

```vue
<template>
  <u1-button @click="showEditor = true">自定义主题</u1-button>
  <u1-theme-editor-dialog v-model="showEditor" />
</template>

<script setup>
import { ref } from 'vue'
import { U1ThemeEditorDialog } from 'u1-design'

const showEditor = ref(false)
</script>
```

## 获取主题代码

编辑器底部提供"复制代码"按钮，点击后生成的主题配置格式如下：

```js
import { applyU1Theme } from 'u1-design'

// 在应用入口（如 main.ts）调用一次即可
applyU1Theme({
  primaryColor: '#409eff',
  successColor: '#67c23a',
  warningColor: '#e6a23c',
  dangerColor: '#f56c6c',
  textColorPrimary: '#303133',
  textColorSecondary: '#606266',
  borderColor: '#dcdfe6',
  surfaceColor: '#ffffff'
})
```

## 主题变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| primaryColor | 主题色 | #409eff |
| successColor | 成功色 | #67c23a |
| warningColor | 警告色 | #e6a23c |
| dangerColor | 危险色 | #f56c6c |
| textColorPrimary | 主文本色 | #303133 |
| textColorSecondary | 次要文本色 | #606266 |
| borderColor | 边框色 | #dcdfe6 |
| surfaceColor | 背景色 | #ffffff |

## 预览效果说明

主题编辑器内的预览效果会实时应用，但在页面刷新后会恢复默认。如需持久化主题，请将生成的代码复制到项目中。
