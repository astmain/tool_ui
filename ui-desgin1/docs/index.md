---
layout: doc
---

<section class="u1-doc-hero">
  <h1>U1Design</h1>
  <p>U1Design 是一个面向 Vue 3 生态的组件库项目. 当前提供按钮, 输入框, 单选框和卡片组件, 并提供类似 Element Plus 的文档体验.</p>
  <div class="u1-doc-actions">
    <U1Button type="primary" size="large">开始使用</U1Button>
    <U1Button size="large">查看组件</U1Button>
  </div>
</section>

## 安装

```bash
pnpm add @u1design/vue
```

## 使用

```ts
import { createApp } from 'vue'
import U1Design from '@u1design/vue'
import '@u1design/vue/style.css'

createApp(App).use(U1Design).mount('#app')
```

## 当前状态

- 已开发: Button, Input, Radio, Card
- 未开发: 其他组件会先出现在组件总览中

