# UI1 组件库 — 规格说明书

> 仿 Element Plus 风格的 React 19 组件库，支持 TSX / TS / JSX / JS

## 1. 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 19 |
| 语言 | TypeScript（TSX/TS + JSX/JS 双支持） |
| 构建工具 | Vite |
| 文档站 | Storybook |
| 样式方案 | CSS Modules + CSS 变量（主题切换） |
| 发布方式 | 本地代码库（不发 npm，内部项目引用） |

## 2. 设计规范

### 2.1 UI 风格
- 风格参照 **Element Plus**，简洁现代、线条干净
- 去除多余装饰，注重功能性和可读性

### 2.2 主题
- **浅色模式（Light）**：白底，浅灰文字，深色主按钮
- **深色模式（Dark）**：深灰/近黑底，亮色文字，高对比度
- 通过 CSS 变量 `data-theme="light"|"dark"` 切换
- 主题色（accent）统一使用一个主色调，支持通过 CSS 变量调整

### 2.3 字体
- 中文字体优先使用系统默认无衬线字体
- 等宽字体用于代码展示

### 2.4 圆角
- 小型组件（Button、Input 等）：`border-radius: 6px`
- 容器型组件（Modal、Card 等）：`border-radius: 8px`

### 2.5 阴影
- 悬浮态：`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
- 弹窗：`box-shadow: 0 8px 24px rgba(0,0,0,0.15)`

## 3. 组件清单

### 3.1 已开发

| 组件 | 说明 | 路径（规划） |
|------|------|------|
| `Button` 按钮 | Primary / Secondary / Ghost / Danger 变体，支持加载状态 | `src/components/Button/` |
| `Input` 输入框 | 默认 / 禁用 / 错误状态，支持前后缀图标 | `src/components/Input/` |
| `Radio` 单选框 | 单选组，支持禁用选项 | `src/components/Radio/` |

### 3.2 待开发（按优先级）

| # | 组件 | 说明 |
|---|------|------|
| 1 | `Checkbox` 多选框 | 多选组，支持全选 |
| 2 | `Select` 选择器 | 下拉单选，支持搜索过滤 |
| 3 | `Switch` 开关 | 切换开关 |
| 4 | `Textarea` 文本域 | 多行文本输入框 |
| 5 | `Modal` 对话框 | 模态弹窗，支持自定义内容 |
| 6 | `Tooltip` 气泡提示 | 鼠标悬停显示提示文字 |
| 7 | `Message` 消息提示 | 顶部全局消息通知（success / error / warning / info） |
| 8 | `Tag` 标签 | 可移除标签，支持多种颜色 |
| 9 | `Table` 表格 | 支持排序、分页的基本表格 |
| 10 | `Dropdown` 下拉菜单 | 点击触发的下拉菜单 |
| 11 | `Avatar` 头像 | 用户头像展示，支持 fallback |
| 12 | `Card` 卡片 | 通用内容卡片容器 |

### 3.3 未规划

| 组件 | 说明 |
|------|------|
| `Badge` 徽标 | 数字徽标和小圆点徽标 |
| `Alert` 警告提示 | 页面内顶部横幅警告 |
| `Divider` 分割线 | 内容分隔线 |
| `Skeleton` 骨架屏 | 加载占位骨架 |
| `Spin` 加载中 | 页面局部加载指示器 |
| `Pagination` 分页 | 页码分页组件 |
| `Breadcrumb` 面包屑 | 页面路径导航 |
| `Progress` 进度条 | 线性进度条 |

## 4. 组件开发规范

### 4.1 文件结构
```
src/
  components/
    Button/
      Button.tsx          # 组件主体
      Button.module.css   # CSS Modules 样式
      index.ts             # 导出入口
      Button.stories.tsx   # Storybook 文档
```

### 4.2 命名约定
- 组件名：大驼峰（PascalCase），如 `Button`、`Select`
- CSS 类名：小驼峰 + BEM 修饰符，如 `button__primary--active`
- Props 类型：组件名 + `Props`，如 `ButtonProps`

### 4.3 Props 规范
- 组件必须支持 `className` 和 `style` 透传
- 原生 HTML 属性透传到底层元素
- 事件处理器使用 React 标准事件（如 `onClick`）

### 4.4 无障碍（a11y）
- 所有交互组件支持键盘操作
- 使用语义化 HTML 元素
- 提供适当的 ARIA 属性

### 4.5 主题变量（CSS Variables）
```css
:root {
  --ui-primary: #409eff;
  --ui-success: #67c23a;
  --ui-warning: #e6a23c;
  --ui-danger: #f56c6c;
  --ui-bg: #ffffff;
  --ui-text: #303133;
  --ui-border: #dcdfe6;
  --ui-radius: 6px;
}

[data-theme="dark"] {
  --ui-bg: #1a1a2e;
  --ui-text: #e4e4e7;
  --ui-border: #3f3f46;
}
```

## 5. Storybook 文档规范

每个组件的 `.stories.tsx` 需包含：
- **Default**：默认状态
- **Variants**：所有变体（如 Primary / Secondary / Ghost / Danger）
- **Sizes**：小 / 中 / 大三种尺寸
- **States**：正常 / 禁用 / 加载 / 错误状态
- **Interactive**：可交互的实时预览

## 6. 项目初始化

> 项目目录 `c:/AAA/tool_ui/ui1` 已存在，以下为补充初始化步骤

### 6.1 安装依赖

```bash
npm install
```

### 6.2 初始化 Storybook

```bash
npx storybook@latest init
```

### 6.3 启动开发

```bash
# 启动 Storybook 文档站
npm run storybook

# 或启动 Vite 开发服务器
npm run dev
```

## 7. 变更记录

| 日期 | 变更内容 |
|------|----------|
| 2026-06-23 | 初始化规格文档，确定技术栈和组件清单 |
