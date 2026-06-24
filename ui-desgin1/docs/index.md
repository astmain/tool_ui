---
layout: doc
---

<section class="u1-doc-hero">
  <h1>U1Design</h1>
  <p>U1Design 是一个面向 Vue 3 的轻量组件库. 当前提供基础控件, 表单控件, 反馈组件, 数据展示组件和导航组件, 并配套 VitePress 文档与可交互示例.</p>
  <div class="u1-doc-actions">
    <U1Button type="primary" size="large" tag="a" href="/component/overview">开始使用</U1Button>
    <U1Button size="large" tag="a" href="/component/button">查看组件</U1Button>
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

- 基础: Button, Input, Radio, Checkbox, Select, Switch, Avatar, Tag
- 反馈: Message, Dialog
- 数据: Table, Card
- 导航: Menu

## 验收状态

- 组件包支持全量安装和按需导入.
- 文档站提供总览, 示例和 API 表.
- 测试覆盖组件渲染, 状态, 事件和关键交互.
