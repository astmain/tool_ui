# U1Design Vue 组件库

U1Design 是一个面向 Vue 3 生态的轻量组件库项目, 包名为 `@u1design/vue`.

## 功能特点

- 提供 Vue 3 组件库包 `@u1design/vue`, 支持全量安装和按需导入.
- 基础组件已开发 Button, Input, Radio, Checkbox, Select, Switch, Avatar, Tag, Message.
- 高级组件已开发 Card, Dialog, Table, Menu.
- 组件命名统一使用 `U1` 前缀, 例如 `U1Button`, `U1Input`, `U1Radio`, `U1Card`.
- 样式类统一使用 `u1-` 前缀, 例如 `.u1-button`, `.u1-input`.
- Button 支持 `label`, `icon`, `iconLeft`, `iconRight`, 后台管理系统常用图标已扩充到 41 个.
- Card 保留头部, 主体和阴影模式, 不再提供 footer 能力.
- Dialog 默认支持拖拽, `closeOnClickModal` 默认值为 `false`, 更适合后台管理系统弹窗.
- Table 支持列配置, 尺寸, loading, 空状态, 溢出提示, 对齐, 序号列, 操作列和自定义表头单元格.
- Message 支持函数式 API, 类型快捷方法, 分组, 手动关闭和出现位置配置.
- 文档站只展示已经开发完成的组件, 每个组件页面提供示例, Show code 和 API 表.
- Show code 已统一为完整可复制示例, 组件示例包含 `<template>` 和必要的 `<script setup>`.
- 设计文档已整理 Colors 色彩和 Icon 图标, 便于后台管理系统统一视觉语言.
- 文档 demo 卡片统一使用内边距容器, 避免 Radio, Card, Table, Menu 等示例内容贴边.
- 测试覆盖组件渲染, 状态, 事件, 插件安装和文档布局回归.

## 安装与运行

```powershell
pnpm install

pnpm dev

pnpm test

pnpm typecheck

pnpm build
```

文档站默认地址是 `http://127.0.0.1:5173/`.

业务项目使用示例

```ts
import { createApp } from 'vue'
import U1Design from '@u1design/vue'
import '@u1design/vue/style.css'

createApp(App).use(U1Design).mount('#app')
```

## 技术栈

- Vue 3 - 组件运行框架.
- TypeScript - 组件源码, 类型声明和构建配置.
- Vite - 组件库构建工具.
- VitePress - 组件文档站.
- Vitest - 单元测试运行器.
- Vue Test Utils - Vue 组件测试工具.
- pnpm workspace - 管理组件包和文档包.

## 项目结构

```text
ui-desgin1/
├── docs/                         # 文档站源码
│   ├── .vitepress/               # VitePress 配置和主题样式
│   ├── component/                # 已开发组件文档页面和设计规范页面
│   │   └── design/               # Colors 和 Icon 设计规范
│   ├── __tests__/                # 文档相关测试目录
│   └── superpowers/              # 产品规格和实现计划
├── packages/
│   └── components/               # @u1design/vue 组件包
│       ├── src/                  # 组件源码, 样式和测试
│       │   ├── button/           # U1Button 按钮
│       │   ├── styles/           # 全局样式, 组件样式和 Icon 线性图标
│       │   ├── input/            # U1Input 输入框
│       │   ├── radio/            # U1Radio 单选框
│       │   ├── checkbox/         # U1Checkbox 多选框
│       │   ├── select/           # U1Select 选择器
│       │   ├── switch/           # U1Switch 开关
│       │   ├── avatar/           # U1Avatar 头像
│       │   ├── tag/              # U1Tag 标签
│       │   ├── message/          # U1Message 消息提示
│       │   ├── card/             # U1Card 卡片
│       │   ├── dialog/           # U1Dialog 对话框
│       │   ├── table/            # U1Table 表格
│       │   ├── menu/             # U1Menu 菜单
│       │   └── index.ts          # 组件导出和插件安装入口
│       └── vite.config.ts        # 组件包构建配置
├── package.json                  # workspace 脚本和公共依赖
├── pnpm-workspace.yaml           # pnpm workspace 配置
├── tsconfig.json                 # TypeScript 配置
└── vitest.config.ts              # Vitest 测试配置
```

## 优化建议

### 代码结构封装归类优化

- p0-补充公共类型导出-让业务项目可以复用 `U1TableColumn`, `U1MenuItem` 等类型.
- p1-拆分组件样式入口-为按需加载组件时减少不必要的样式体积.
- p1-沉淀表单组件共享逻辑-减少 Radio, Checkbox, Select 等组件后续扩展时的重复代码.
- p1-沉淀 Show code 校验脚本-把完整示例检查纳入常规测试, 避免后续文档再次退化成片段.

### 用户体验优化

- p0-继续对齐 Element Plus 文档体验-完善右侧锚点, 示例间距和 API 表可读性.
- p1-增加移动端验收-重点检查侧栏, demo 行, 表格横向滚动和按钮组换行.
- p1-增加暗色主题验收-持续检查禁用态, 边框, Message 和 Tag 的对比度.
- p1-增加文档截图回归-持续检查标题锚点, demo 卡片内边距和 Show code 区域.

### 残缺功能优化

- p0-补齐组件高级能力-后续可继续开发 Input 前后缀, Select 多选, Table 排序筛选分页和固定列.
- p1-沉淀 Icon 组件-当前图标通过 `.u1-icon-mark` 样式类复用, 后续可封装为独立 `U1Icon`.
- p1-增加无障碍测试-覆盖键盘操作, aria 属性和焦点状态.
- p1-增加文档站搜索能力-组件数量继续增加后方便快速定位页面.

### 无用和重复代码优化

- p0-增加未开发入口防回归检查-持续确保未开发组件不出现在导航和总览中.
- p1-增加文档主题样式清理脚本-持续发现无引用的 demo 工具类和旧页面样式.
- p1-增加重复测试审计机制-持续合并只验证同一行为的重复测试用例.
