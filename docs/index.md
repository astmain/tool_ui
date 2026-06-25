---
layout: doc
---

<section class="u1-doc-hero">
  <h1>U1Design</h1>
<p>U1Design 是一个面向 Vue 3 的轻量组件库. 当前按基础组件, 高级组件和设计分组组织, 并配套 VitePress 文档与可交互示例.</p>
  <div class="u1-doc-actions">
    <a class="u1-button u1-button--primary u1-button--large" href="/component/overview">开始使用</a>
    <a class="u1-button u1-button--default u1-button--large" href="/component/button">查看组件</a>
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

## 当前组件

- 基础组件: Button, Input, Radio, Checkbox, Select, Switch, Avatar, Tag, Message
- 高级组件: Affix, Card, Dialog, Table, Menu

## 验收状态

- 组件包支持全量安装和按需导入.
- 文档站提供总览, 示例和 API 表.
- 测试覆盖组件渲染, 状态, 事件和关键交互.
