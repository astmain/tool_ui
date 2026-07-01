# U1Design Vue 组件库
- 本项目是一个基于 Vue 3 和 TypeScript 的组件库 workspace, 包名为 `tool_ui1`, 主要用于沉淀 U1Design 组件, SVG 图标, 主题变量和 VitePress 文档站.
- npm仓库 `https://www.npmjs.com/package/tool_ui1`

## 功能特点
- Vue 3 组件库 - 支持全量插件安装, 单组件导入和样式文件导入.
- 基础组件 - 已覆盖 Affix, Button, Icon, Input, InputLabel, Radio, RadioGroup, Checkbox, CheckboxGroup, Select, Switch, Avatar, Tag, Message.
- 高级组件 - 已覆盖 Card, Dialog, Table, Menu, Layout.
- Button 图标能力 - `U1Button` 支持 `label`, `icon`, `icon-left`, `icon-right` 和 `class="icon-name"` 图标写法.
- SVG 图标能力 - `U1Icon` 统一渲染 SVG 图标, 图标源码按单个 `.vue` 文件维护在 `src/icon/icons`, 同时通过 `scripts/build-icon-css.mjs` 自动生成 41 个 CSS class (`icon-xxx`), 支持 `<U1Icon name="xxx" />` 和 `<div class="icon-xxx" />` 两种使用方式.
- 主题能力 - 提供主题 token, CSS 变量应用, 主题重置和主题代码生成.
- 主题编辑器 - 提供 `U1ThemeEditor` 和 `U1ThemeEditorDialog`, 文档站右下角可打开主题编辑器浮窗.
- 文档站 - 基于 VitePress, 当前组件文档按基础组件, 高级组件和设计分组组织.
- 测试覆盖 - 组件安装, 交互行为, 主题工具, 图标解析和文档布局均有 Vitest 测试.

## 安装与运行
```powershell
# 安装依赖
pnpm install

# 启动文档站
pnpm dev

# 运行测试
pnpm test

# 运行类型检查
pnpm typecheck

# 构建组件包和文档站
pnpm build

# 只构建组件包
pnpm --filter tool_ui1 build
```
- 文档开发服务默认监听本机 VitePress 默认端口.
- `pnpm dev` 实际执行 `pnpm --filter docs dev`.
- `pnpm build` 会先构建 `tool_ui1`, 再构建 docs 文档站.
业务项目使用示例
```ts
import { createApp } from 'vue'
import U1Design from 'tool_ui1'
import 'tool_ui1/style.css'

createApp(App).use(U1Design).mount('#app')
```
按需导入示例
```ts
import { U1Button, U1Icon, U1Input } from 'tool_ui1'
import { applyU1Theme, resetU1Theme } from 'tool_ui1/theme'
import 'tool_ui1/style.css'
```
按钮和图标使用示例
```vue
<template>
  <div class="button-icon-demo">
    <U1Button label="我的按钮" />
    <U1Button icon="add" label="新增动作" />
    <U1Button icon="eye-open" label="显示内容" />
    <U1Button icon-left="search" icon-right="check" label="搜索确认" />
    <U1Button class="icon-eye-open" label="显示内容" />
    <U1Icon name="eye-open" />
  </div>
</template>
```

## 技术栈
- Vue 3 - 组件运行框架.
- TypeScript - 组件源码, 类型声明和工程配置.
- Vite - 组件库构建工具.
- vite-plugin-dts - 生成组件包类型声明.
- VitePress - 文档站框架.
- Vitest - 单元测试运行器.
- Vue Test Utils - Vue 组件测试工具.
- jsdom - 组件测试 DOM 环境.
- pnpm workspace - 管理 `packages/*` 和 `docs`.

## 项目结构
```text
C-AAA-tool_ui
|-- docs/                         # VitePress 文档站
|   |-- .vitepress/
|   |   |-- config.ts              # 文档站标题, 导航, 侧栏和源码 alias
|   |   `-- theme/                 # 自定义主题和主题编辑器浮窗入口
|   |       |-- Layout.vue          # 文档站布局扩展
|   |       |-- ThemeEditorDemo.vue # 右下角主题编辑器浮窗
|   |       |-- index.ts            # VitePress 主题入口
|   |       `-- style.css           # 文档站主题样式
|   |-- component/                  # 组件文档和设计文档
|   |   |-- overview.md             # 组件总览
|   |   |-- affix.md                # U1Affix 文档
|   |   |-- button.md               # U1Button 文档
|   |   |-- input.md                # U1Input 文档
|   |   |-- input-label.md          # U1InputLabel 文档
|   |   |-- radio.md                # U1Radio 和 U1RadioGroup 文档
|   |   |-- checkbox.md             # U1Checkbox 和 U1CheckboxGroup 文档
|   |   |-- select.md               # U1Select 文档
|   |   |-- switch.md               # U1Switch 文档
|   |   |-- avatar.md               # U1Avatar 文档
|   |   |-- tag.md                  # U1Tag 文档
|   |   |-- message.md              # U1Message 文档
|   |   |-- card.md                 # U1Card 文档
|   |   |-- dialog.md               # U1Dialog 文档
|   |   |-- table.md                # U1Table 文档
|   |   |-- menu.md                 # U1Menu 文档
|   |-- layout1.md              # U1Layout1 文档
|   |   `-- design/                 # 颜色, 图标和主题编辑器文档
|   `-- package.json               # docs 包脚本和 workspace 依赖
|-- packages/
|   `-- components/                 # tool_ui1 组件包
|       |-- package.json            # 包入口, exports 和 peerDependencies
|       |-- vite.config.ts          # 组件库构建配置
|       |-- scripts/                 # 构建脚本
|       |   `-- build-icon-css.mjs  # 从 src/icon/icons/*.vue 自动生成 icons.css
|       `-- src/
|           |-- index.ts            # 组件导出和插件安装入口, 自动导入 icons.css
|           |-- affix/              # U1Affix
|           |-- avatar/             # U1Avatar
|           |-- button/             # U1Button
|           |-- card/               # U1Card
|           |-- checkbox/           # U1Checkbox 和 U1CheckboxGroup
|           |-- dialog/             # U1Dialog
|           |-- icon/               # U1Icon 和 SVG 图标注册
|           |   `-- icons/           # 单个 SVG 图标 Vue 文件
|           |-- input/              # U1Input
|           |-- input-label/        # U1InputLabel
|           |-- menu/               # U1Menu
|           |-- layout/              # U1Layout1
|           |-- message/            # U1Message
|           |-- radio/              # U1Radio 和 U1RadioGroup
|           |-- select/             # U1Select
|           |-- switch/             # U1Switch
|           |-- table/              # U1Table
|           |-- tag/                # U1Tag
|           |-- theme/              # 主题 token, 应用, 重置和代码生成
|           |-- theme-editor/       # U1ThemeEditor 和 U1ThemeEditorDialog
|           |-- styles/             # 全局样式, 组件样式和图标 CSS
|           |   `-- icons.css       # 自动生成, 包含 41 个 icon-xxx CSS class
|           `-- __tests__/          # 组件, 主题, 图标和文档布局测试
|-- package.json                    # 根 workspace 脚本和公共开发依赖
|-- pnpm-workspace.yaml             # pnpm workspace 配置
|-- tsconfig.json                   # TypeScript 配置
`-- vitest.config.ts                # Vitest 配置
```

## 优化建议

### 代码结构封装归类优化
- p0-补充类型统一出口-将 `U1TableColumn`, `U1MenuItem` 等组件类型整理为稳定导出, 方便业务项目复用.
- p1-拆分按需样式入口-当前构建输出统一 `style.css`, 后续可按组件拆分样式以降低按需使用成本.
- p1-沉淀表单共享逻辑-Radio, Checkbox, Select 和 InputLabel 后续可共享表单状态, 尺寸和校验相关逻辑.

### 用户体验优化
- p0-补充移动端文档验收-重点检查侧栏, demo 容器, 表格横向滚动和按钮组换行.
- p1-补充暗色主题验收-重点检查禁用态, 边框, Message, Tag 和主题编辑器对比度.
- p1-增加文档搜索-组件数量继续增加后, 需要更快定位组件页面和 API 内容.

### 残缺功能优化
- p0-增强复杂组件能力-Table 可继续补充排序, 筛选, 分页和固定列, Select 可继续补充多选.
- p1-补充 Icon 类型导出-后续可导出稳定的 `IconName` 类型, 方便业务代码获得图标名称提示.
- p1-补充无障碍用例-继续覆盖键盘操作, aria 属性, 焦点状态和弹层返回焦点.

### 无用和重复代码优化
- p0-清理构建产物入库风险-`docs/.vitepress/cache` 和 `docs/.vitepress/dist` 属于生成内容, 后续提交应保持排除.
- p1-清理旧日志文件-根目录 `docs-dev-4173.log` 和 `docs-dev-4173.err.log` 如不再需要可移出源码目录.
- p1-检查文档样式冗余-持续清理无引用 demo 工具类和旧页面样式.
