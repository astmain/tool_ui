---
layout: doc
---

<section class="u1-doc-hero">
  <h1>U1Design</h1>
<p>U1Design 是一个面向 Vue 3 的轻量组件库. 当前按基础组件, 高级组件和设计分组组织, 并配套 VitePress 文档与可交互示例.</p>
</section>

## 安装

```bash
# 安装依赖包
npm add tool_ui1
```

## 使用

```ts
import { createApp } from 'vue'
import U1Design from 'tool_ui1'
import 'tool_ui1/style.css'

createApp(App).use(U1Design).mount('#app')
```