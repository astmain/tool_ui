# U1Design Vue 组件库

U1Design 是一个面向 Vue 3 的轻量组件库，包名为 `@u1design/vue`。

## 核心功能

- 提供 Vue 3 组件库包 `@u1design/vue`，支持全量安装和按需导入。
- 基础组件已开发 Button, Input, Radio, Checkbox, Select, Switch, Avatar, Tag, Message。
- 高级组件已开发 Card, Dialog, Table, Menu。
- 主题编辑器 `U1ThemeEditorDialog`：可视化调整 CSS 变量，实时预览，生成主题代码并一键复制。
- 文档站内置主题编辑器浮窗（右下角蓝色按钮），可在任意页面打开编辑器预览主题效果。
- 组件命名统一使用 `U1` 前缀，样式类统一使用 `u1-` 前缀。
- 文档 demo 卡片统一使用内边距容器，组件示例包含完整可复制代码。

## 安装与运行和常用命令

```powershell
pnpm install

pnpm dev

pnpm test

pnpm typecheck

pnpm build
```

文档站默认地址是 `http://127.0.0.1:5173/`。业务项目使用示例：

```ts
import { createApp } from 'vue'
import U1Design from '@u1design/vue'
import '@u1design/vue/style.css'

createApp(App).use(U1Design).mount('#app')
```

## 技术栈

- Vue 3 - 组件运行框架。
- TypeScript - 组件源码，类型声明和构建配置。
- Vite - 组件库构建工具。
- VitePress - 组件文档站，主题编辑器浮窗通过 Layout.vue 全局注入。
- Vitest - 单元测试运行器。
- Vue Test Utils - Vue 组件测试工具。
- pnpm workspace - 管理组件包和文档包。

## 项目结构

```
ui-desgin1/
├── docs/                         # 文档站源码
│   ├── .vitepress/               # VitePress 配置和主题
│   │   ├── config.ts             # 导航，侧栏和路径别名配置
│   │   ├── Layout.vue            # 自定义 Layout，全局注入 ThemeEditorDemo 浮窗
│   │   ├── style.css             # 文档站全局样式
│   │   └── ThemeEditorDemo.vue   # 主题编辑器浮窗入口组件
│   ├── component/                # 已开发组件文档和设计规范
│   │   ├── button.md             # U1Button 按钮
│   │   ├── input.md             # U1Input 输入框
│   │   ├── radio.md             # U1Radio 单选框
│   │   ├── checkbox.md          # U1Checkbox 多选框
│   │   ├── select.md            # U1Select 选择器
│   │   ├── switch.md            # U1Switch 开关
│   │   ├── avatar.md            # U1Avatar 头像
│   │   ├── tag.md               # U1Tag 标签
│   │   ├── message.md           # U1Message 消息提示
│   │   ├── card.md              # U1Card 卡片
│   │   ├── dialog.md            # U1Dialog 对话框
│   │   ├── table.md             # U1Table 表格
│   │   ├── menu.md              # U1Menu 菜单
│   │   ├── overview.md          # 组件总览
│   │   └── design/              # 设计规范
│   │       ├── colors.md        # 色彩方案
│   │       ├── icons.md         # 图标体系
│   │       └── theme-editor.md  # 主题编辑器
│   ├── __tests__/               # 文档相关测试
│   └── superpowers/             # 产品规格和实现计划
├── packages/
│   └── components/              # @u1design/vue 组件包
│       ├── src/                 # 组件源码，样式和测试
│       │   ├── button/          # U1Button 按钮
│       │   ├── input/           # U1Input 输入框
│       │   ├── radio/           # U1Radio 单选框
│       │   ├── checkbox/        # U1Checkbox 多选框
│       │   ├── select/          # U1Select 选择器
│       │   ├── switch/          # U1Switch 开关
│       │   ├── avatar/          # U1Avatar 头像
│       │   ├── tag/             # U1Tag 标签
│       │   ├── message/         # U1Message 消息提示
│       │   ├── card/            # U1Card 卡片
│       │   ├── dialog/          # U1Dialog 对话框
│       │   ├── table/            # U1Table 表格
│       │   ├── menu/            # U1Menu 菜单
│       │   ├── theme/           # 主题相关工具函数
│       │   │   ├── applyTheme.ts    # 应用主题变量到 CSS
│       │   │   ├── createThemeCode.ts # 生成主题代码字符串
│       │   │   ├── tokens.ts        # 默认主题变量定义
│       │   │   └── index.ts         # 主题工具导出
│       │   ├── theme-editor/    # U1ThemeEditor 主题编辑器
│       │   │   ├── ThemeEditor.vue      # 主题编辑器主组件
│       │   │   └── ThemeEditorDialog.vue # 主题编辑器对话框
│       │   ├── styles/          # 全局样式，组件样式和 Icon 线性图标
│       │   └── index.ts         # 组件导出和插件安装入口
│       └── vite.config.ts       # 组件包构建配置
├── package.json                 # workspace 脚本和公共依赖
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── tsconfig.json               # TypeScript 配置
└── vitest.config.ts           # Vitest 测试配置
```

## 重要目录说明

- `packages/components/src/` - 组件源码，包含已开发的 13 个组件和主题编辑器。
- `docs/.vitepress/` - 文档站配置和自定义主题，主题编辑器浮窗通过 Layout.vue 全局注入。
- `packages/components/src/styles/` - 全局样式，组件样式和图标定义。

## 优化建议

### 代码结构封装归类优化

- p1-补充公共类型导出-让业务项目可以复用 `U1TableColumn`，`U1MenuItem` 等类型。
- p1-拆分组件样式入口-为按需加载组件时减少不必要的样式体积。
- p1-沉淀表单组件共享逻辑-减少 Radio, Checkbox, Select 等组件后续扩展时的重复代码。

### 用户体验优化

- p0-继续对齐 Element Plus 文档体验-完善右侧锚点，示例间距和 API 表可读性。
- p1-增加移动端验收-重点检查侧栏，demo 行，表格横向滚动和按钮组换行。
- p1-增加暗色主题验收-持续检查禁用态，边框，Message 和 Tag 的对比度。
- p1-增加文档截图回归-持续检查标题锚点，demo 卡片内边距和 Show code 区域。

### 残缺功能优化

- p0-补齐组件高级能力-后续可继续开发 Input 前后缀，Select 多选，Table 排序筛选分页和固定列。
- p1-沉淀 Icon 组件-当前图标通过 `.u1-icon-mark` 样式类复用，后续可封装为独立 `U1Icon`。
- p1-增加无障碍测试-覆盖键盘操作，aria 属性和焦点状态。
- p1-增加文档站搜索能力-组件数量继续增加后方便快速定位页面。

### 无用和重复代码优化

- p1-清理空目录 `docs/aaa` 和 `docs/backup` 下的废弃文件。
- p1-增加未开发入口防回归检查-持续确保未开发组件不出现在导航和总览中。
- p1-增加文档主题样式清理脚本-持续发现无引用的 demo 工具类和旧页面样式。
