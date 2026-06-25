# UI1 组件库 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在已有 Button、Input、Radio 的基础上，通过 Vite + Storybook 环境开发 12 个新组件，完成组件库核心搭建。

**Architecture:** 规划为两个阶段 —— 阶段一完成项目基础（Vite 初始化 + Storybook 配置 + 主题系统），阶段二逐组件开发。每个组件独立文件夹，包含 TSX 组件、CSS Modules 样式、Storybook 文档。主题通过 CSS 变量 `data-theme` 驱动，全组件共享一套 CSS 变量。

**Tech Stack:** React 19 + TypeScript + Vite + Storybook + CSS Modules

---

## 阶段一：项目基础（仅执行一次）

### 阶段一总览

| 步骤 | 内容 |
|------|------|
| 1 | 初始化 Vite + React TS 项目 |
| 2 | 安装依赖 |
| 3 | 配置 CSS 变量与全局样式 |
| 4 | 初始化 Storybook |
| 5 | 配置 Storybook（主题、decorators、TypeScript） |
| 6 | 提交阶段一成果 |

---

### 任务 1: 初始化 Vite + React TS 项目

**Files:**
- Create: `c:/AAA/tool_ui/ui1/package.json`
- Create: `c:/AAA/tool_ui/ui1/vite.config.ts`
- Create: `c:/AAA/tool_ui/ui1/tsconfig.json`
- Create: `c:/AAA/tool_ui/ui1/tsconfig.node.json`
- Create: `c:/AAA/tool_ui/ui1/index.html`
- Create: `c:/AAA/tool_ui/ui1/src/main.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/App.tsx`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "ui1",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@storybook/react": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "storybook": "^8.0.0",
    "typescript": "^5.0.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "*.ts", "*.tsx"]
}
```

- [ ] **Step 4: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UI1 Component Library</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 src/main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 7: 创建 src/App.tsx**

```typescript
function App() {
  return <div style={{ padding: '40px' }}>UI1 Component Library</div>
}

export default App
```

---

### 任务 2: 安装依赖

**Files:**
- Modify: `c:/AAA/tool_ui/ui1/package.json`（已创建于任务 1）

- [ ] **Step 1: 运行 npm install**

```bash
cd c:/AAA/tool_ui/ui1
npm install
```

- [ ] **Step 2: 验证 node_modules 安装成功**

```
ls node_modules/.bin/vite
```

---

### 任务 3: 配置 CSS 变量与全局样式

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/styles/global.css`
- Create: `c:/AAA/tool_ui/ui1/src/styles/variables.css`

- [ ] **Step 1: 创建 CSS 变量文件 src/styles/variables.css**

```css
/* ============================================
   UI1 Design Tokens
   仿 Element Plus 色板
   ============================================ */

:root {
  /* Primary Colors */
  --ui-primary: #409eff;
  --ui-primary-light: #66b1ff;
  --ui-primary-lighter: #a0cfff;

  /* Status Colors */
  --ui-success: #67c23a;
  --ui-warning: #e6a23c;
  --ui-danger: #f56c6c;
  --ui-info: #909399;

  /* Neutral Colors - Light Theme */
  --ui-bg: #ffffff;
  --ui-bg-page: #f5f7fa;
  --ui-text-primary: #303133;
  --ui-text-regular: #606266;
  --ui-text-secondary: #909399;
  --ui-text-placeholder: #c0c4cc;
  --ui-border: #dcdfe6;
  --ui-border-light: #e4e7ed;
  --ui-border-lighter: #ebeef5;
  --ui-border-extra-light: #f2f6fc;

  /* Shadows */
  --ui-shadow-base: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --ui-shadow-light: 0 4px 12px rgba(0, 0, 0, 0.1);
  --ui-shadow-dark: 0 8px 24px rgba(0, 0, 0, 0.15);

  /* Border Radius */
  --ui-radius-small: 4px;
  --ui-radius-base: 6px;
  --ui-radius-large: 8px;

  /* Font */
  --ui-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  --ui-font-family-mono: 'SF Mono', Consolas, 'Liberation Mono', Menlo,
    'Courier New', monospace;
  --ui-font-size-xs: 12px;
  --ui-font-size-sm: 13px;
  --ui-font-size-base: 14px;
  --ui-font-size-lg: 16px;
  --ui-font-size-xl: 18px;

  /* Spacing */
  --ui-spacing-xs: 4px;
  --ui-spacing-sm: 8px;
  --ui-spacing-base: 12px;
  --ui-spacing-lg: 16px;
  --ui-spacing-xl: 24px;

  /* Transitions */
  --ui-transition-duration: 0.3s;
  --ui-transition-function: ease;
}

/* Dark Theme */
[data-theme='dark'] {
  --ui-bg: #1a1a2e;
  --ui-bg-page: #16213e;
  --ui-text-primary: #e4e4e7;
  --ui-text-regular: #a1a1aa;
  --ui-text-secondary: #71717a;
  --ui-text-placeholder: #52525b;
  --ui-border: #3f3f46;
  --ui-border-light: #27272a;
  --ui-border-lighter: #27272a;
  --ui-border-extra-light: #1f1f23;
  --ui-shadow-base: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 6px rgba(0, 0, 0, 0.1);
  --ui-shadow-light: 0 4px 12px rgba(0, 0, 0, 0.4);
  --ui-shadow-dark: 0 8px 24px rgba(0, 0, 0, 0.5);
}
```

- [ ] **Step 2: 创建全局样式文件 src/styles/global.css**

```css
@import './variables.css';

/* ============================================
   Global Resets & Base Styles
   ============================================ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size-base);
  color: var(--ui-text-primary);
  background-color: var(--ui-bg-page);
  line-height: 1.5;
  transition: background-color var(--ui-transition-duration)
      var(--ui-transition-function),
    color var(--ui-transition-duration) var(--ui-transition-function);
}

#root {
  min-height: 100vh;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input,
textarea,
select {
  font-family: inherit;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus visible */
:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}
```

- [ ] **Step 3: 更新 src/main.tsx 导入 global.css**

将 `import './styles/global.css'` 的路径改为（已在任务 1 创建）：

```typescript
import './styles/global.css'
```

---

### 任务 4: 初始化 Storybook

**Files:**
- Create: `c:/AAA/tool_ui/ui1/.storybook/main.ts`
- Create: `c:/AAA/tool_ui/ui1/.storybook/preview.ts`
- Create: `c:/AAA/tool_ui/ui1/src/stories/Introduction.mdx`

- [ ] **Step 1: 创建 .storybook/main.ts**

```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    return {
      ...config,
      css: {
        modules: {
          localsConvention: 'camelCase',
        },
      },
    }
  },
}

export default config
```

- [ ] **Step 2: 创建 .storybook/preview.ts**

```typescript
import type { Preview } from '@storybook/react'
import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a2e' },
        { name: 'gray', value: '#f5f7fa' },
      ],
    },
    layout: 'padded',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value === '#1a1a2e' ? 'dark' : 'light'
      return (
        <div data-theme={theme} style={{ padding: '24px' }}>
          <Story />
        </div>
      )
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circle', title: 'Light' },
          { value: 'dark', icon: 'circlehollow', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
}

export default preview
```

- [ ] **Step 3: 创建 src/stories/Introduction.mdx**

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="UI1 组件库/介绍" />

# UI1 Component Library

仿 Element Plus 风格的 React 19 组件库。

## 技术栈

- **React 19** + **TypeScript**
- **Vite** 构建工具
- **Storybook** 文档站
- **CSS Modules** + CSS 变量主题切换

## 设计规范

参照 Element Plus，简洁现代，注重功能性和可读性。

- 主题：Light / Dark 两种模式，通过 `data-theme` 属性切换
- 圆角：小型组件 `6px`，容器型组件 `8px`
- 阴影：悬浮 `0 4px 12px rgba(0,0,0,0.1)`，弹窗 `0 8px 24px rgba(0,0,0,0.15)`

## 快速开始

```bash
npm install
npm run storybook
```

## 已开发组件

Button、Input、Radio

## 待开发组件

Checkbox、Select、Switch、Textarea、Modal、Tooltip、Message、Tag、Table、Dropdown、Avatar、Card
```

- [ ] **Step 4: 提交阶段一成果**

```bash
cd c:/AAA/tool_ui/ui1
git add -A
git commit -m "feat: 初始化 Vite + React TS 项目和 Storybook 配置

- 初始化 Vite + React TS 项目结构
- 配置 TypeScript (tsconfig.json, tsconfig.node.json)
- 配置 CSS 变量系统 (src/styles/variables.css)
- 配置全局样式 (src/styles/global.css)
- 初始化 Storybook (main.ts, preview.ts)
- 创建 Introduction.mdx 文档"
```

---

## 阶段二：组件开发

### 阶段二总览（12 个组件）

| # | 组件 | 路径 | 说明 |
|---|------|------|------|
| 1 | Checkbox 多选框 | `src/components/Checkbox/` | 多选组，支持全选 |
| 2 | Select 选择器 | `src/components/Select/` | 下拉单选，支持搜索过滤 |
| 3 | Switch 开关 | `src/components/Switch/` | 切换开关 |
| 4 | Textarea 文本域 | `src/components/Textarea/` | 多行文本输入 |
| 5 | Modal 对话框 | `src/components/Modal/` | 模态弹窗 |
| 6 | Tooltip 气泡提示 | `src/components/Tooltip/` | 悬停显示提示 |
| 7 | Message 消息提示 | `src/components/Message/` | 顶部通知 |
| 8 | Tag 标签 | `src/components/Tag/` | 可移除标签 |
| 9 | Table 表格 | `src/components/Table/` | 支持排序、分页 |
| 10 | Dropdown 下拉菜单 | `src/components/Dropdown/` | 点击触发菜单 |
| 11 | Avatar 头像 | `src/components/Avatar/` | 头像展示 |
| 12 | Card 卡片 | `src/components/Card/` | 通用卡片容器 |

### 共用模式（每个组件均适用）

每个组件的开发均遵循以下模式，Task N 中不再重复写出所有共用步骤：

```
Task N: [组件名]
  - 创建 src/components/[Component]/
    - [Component].tsx       → 组件主体
    - [Component].module.css → CSS Modules 样式
    - index.ts              → 导出入口
    - [Component].stories.tsx → Storybook 文档
  - [ ] Step 1: 创建组件 TSX 文件
  - [ ] Step 2: 创建 CSS Modules 样式文件
  - [ ] Step 3: 创建 index.ts 导出文件
  - [ ] Step 4: 创建 Storybook stories 文件
  - [ ] Step 5: 创建 / 更新 src/components/index.ts 汇总导出
  - [ ] Step 6: 启动 Storybook 验证组件
  - [ ] Step 7: 提交
```

---

### 任务 5: Checkbox 多选框

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Checkbox/Checkbox.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Checkbox/Checkbox.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Checkbox/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Checkbox/Checkbox.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Checkbox.tsx**

```typescript
import React, { forwardRef, useCallback, useMemo } from 'react'

/* ============================================
   Checkbox Props
   ============================================ */

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** 是否选中 */
  checked?: boolean
  /** 默认选中（非受控） */
  defaultChecked?: boolean
  /** 是否有中间态（parent checkbox） */
  indeterminate?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 标签文本 */
  label?: React.ReactNode
  /** 值 */
  value?: string
  /** 变化回调 */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
}

/* ============================================
   Checkbox Component
   ============================================ */

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      label,
      value,
      onChange,
      size = 'default',
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [innerChecked, setInnerChecked] = React.useState(
      defaultChecked ?? false,
    )
    const isControlled = checked !== undefined
    const currentChecked = isControlled ? checked : innerChecked

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInnerChecked(e.target.checked)
        }
        onChange?.(e.target.checked, e)
      },
      [isControlled, onChange],
    )

    const sizeClass = useMemo(
      () => ({
        small: 'checkbox--small',
        default: 'checkbox--default',
        large: 'checkbox--large',
      }[size]),
      [size],
    )

    return (
      <label
        className={`${sizeClass} ${disabled ? 'checkbox--disabled' : ''} ${className ?? ''}`}
        style={style}
      >
        <span
          className={`checkbox__input-wrap ${indeterminate ? 'checkbox__input-wrap--indeterminate' : ''}`}
        >
          <input
            ref={ref}
            type="checkbox"
            className="checkbox__original"
            checked={currentChecked}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            {...rest}
          />
        </span>
        {label && <span className="checkbox__label">{label}</span>}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'

/* ============================================
   CheckboxGroup
   ============================================ */

export interface CheckboxGroupProps {
  /** 选中值数组（受控） */
  value?: string[]
  /** 默认选中值（非受控） */
  defaultValue?: string[]
  /** 选项列表 */
  options?: Array<{ label: React.ReactNode; value: string; disabled?: boolean }>
  /** 是否禁用 */
  disabled?: boolean
  /** 变化回调 */
  onChange?: (value: string[]) => void
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  className?: string
  style?: React.CSSProperties
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      value,
      defaultValue = [],
      options = [],
      disabled = false,
      onChange,
      size = 'default',
      className,
      style,
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : innerValue

    const handleChange = useCallback(
      (checked: boolean, itemValue: string) => {
        const nextValue = checked
          ? [...currentValue, itemValue]
          : currentValue.filter((v) => v !== itemValue)
        if (!isControlled) {
          setInnerValue(nextValue)
        }
        onChange?.(nextValue)
      },
      [currentValue, isControlled, onChange],
    )

    const isAllChecked = options.length > 0 && options.every((o) => currentValue.includes(o.value))
    const isIndeterminate =
      options.length > 0 && isAllChecked === false && options.some((o) => currentValue.includes(o.value))

    const handleSelectAll = useCallback(() => {
      const nextValue = isAllChecked
        ? currentValue.filter((v) => !options.some((o) => o.value === v))
        : [...new Set([...currentValue, ...options.filter((o) => !o.disabled).map((o) => o.value)])]
      if (!isControlled) {
        setInnerValue(nextValue)
      }
      onChange?.(nextValue)
    }, [isAllChecked, currentValue, options, isControlled, onChange])

    return (
      <div ref={ref} className={`checkbox-group ${className ?? ''}`} style={style}>
        {options.length > 1 && (
          <Checkbox
            label="全选"
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            disabled={disabled}
            onChange={(_, e) => {
              e.preventDefault()
              handleSelectAll()
            }}
            size={size}
          />
        )}
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            value={option.value}
            checked={currentValue.includes(option.value)}
            disabled={disabled || option.disabled}
            onChange={(checked) => handleChange(checked, option.value)}
            size={size}
          />
        ))}
      </div>
    )
  },
)

CheckboxGroup.displayName = 'CheckboxGroup'
```

- [ ] **Step 2: 创建 Checkbox.module.css**

```css
/* ============================================
   Checkbox Styles
   ============================================ */

.checkbox--small {
  font-size: var(--ui-font-size-xs);
}

.checkbox--default {
  font-size: var(--ui-font-size-base);
}

.checkbox--large {
  font-size: var(--ui-font-size-lg);
}

.checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox__input-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
  margin-right: 0.5em;
}

.checkbox__input-wrap--indeterminate::after {
  content: '';
  position: absolute;
  display: block;
  width: 8px;
  height: 2px;
  background-color: var(--ui-primary);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1px;
}

.checkbox__original {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  margin: 0;
}

.checkbox__original:checked + .checkbox__input-wrap {
  background-color: var(--ui-primary);
  border-color: var(--ui-primary);
  border-radius: var(--ui-radius-small);
}

.checkbox__original:checked + .checkbox__input-wrap::before {
  content: '';
  position: absolute;
  display: block;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  top: 1px;
  left: 4px;
}

.checkbox__input-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2em;
  height: 1.2em;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-small);
  background-color: var(--ui-bg);
  transition: all var(--ui-transition-duration) var(--ui-transition-function);
  cursor: pointer;
}

.checkbox__input-wrap::before {
  display: none;
}

.checkbox__original:hover + .checkbox__input-wrap {
  border-color: var(--ui-primary);
}

.checkbox__original:focus-visible + .checkbox__input-wrap {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

.checkbox__original:disabled + .checkbox__input-wrap {
  background-color: var(--ui-bg-page);
  border-color: var(--ui-border-light);
  cursor: not-allowed;
}

.checkbox__label {
  cursor: pointer;
  user-select: none;
  color: var(--ui-text-primary);
}

/* ============================================
   CheckboxGroup
   ============================================ */

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--ui-spacing-sm);
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Checkbox, type CheckboxProps } from './Checkbox'
export { CheckboxGroup, type CheckboxGroupProps } from './Checkbox'
```

- [ ] **Step 4: 创建 Checkbox.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox, CheckboxGroup } from './Checkbox'
import { useState } from 'react'

const meta: Meta<typeof Checkbox> = {
  title: 'UI1/Checkbox 多选框',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    label: '选项',
    checked: false,
    disabled: false,
  },
}

export const Checked: Story = {
  args: {
    label: '已选中选项',
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: '禁用选项',
    disabled: true,
    checked: false,
  },
}

export const Indeterminate: Story = {
  args: {
    label: '中间态',
    indeterminate: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Checkbox label="小号" size="small" />
      <Checkbox label="默认" size="default" />
      <Checkbox label="大号" size="large" />
    </div>
  ),
}

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['a'])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <CheckboxGroup
          value={value}
          onChange={setValue}
          options={[
            { label: '选项 A', value: 'a' },
            { label: '选项 B', value: 'b' },
            { label: '选项 C', value: 'c', disabled: true },
          ]}
        />
        <p style={{ fontSize: '13px', color: 'var(--ui-text-secondary)' }}>
          当前选中: {value.join(', ') || '无'}
        </p>
      </div>
    )
  },
}

export const GroupSelectAll: Story = {
  render: () => (
    <CheckboxGroup
      defaultValue={['a']}
      onChange={(v) => console.log(v)}
      options={[
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
        { label: '樱桃', value: 'cherry' },
        { label: '葡萄', value: 'grape' },
      ]}
    />
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
export { Checkbox, type CheckboxProps } from './Checkbox'
export { CheckboxGroup, type CheckboxGroupProps } from './Checkbox'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
cd c:/AAA/tool_ui/ui1
npm run storybook
```

打开 http://localhost:6006，确认 Checkbox 和 CheckboxGroup 正常显示。

- [ ] **Step 7: 提交**

```bash
git add src/components/Checkbox/
git commit -m "feat(Checkbox): 添加多选框和 CheckboxGroup 组件

- Checkbox: 支持选中/禁用/中间态/三种尺寸
- CheckboxGroup: 支持多选组和全选
- 提供 Storybook 文档"
```

---

### 任务 6: Select 选择器

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Select/Select.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Select/Select.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Select/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Select/Select.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Select.tsx**

```typescript
import React, { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from 'react'

/* ============================================
   Select Props
   ============================================ */

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  /** 选中值 */
  value?: string | number
  /** 默认值（非受控） */
  defaultValue?: string | number
  /** 选项列表 */
  options?: SelectOption[]
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可搜索 */
  filterable?: boolean
  /** 变化回调 */
  onChange?: (value: string | number) => void
  /** 清空回调 */
  onClear?: () => void
  /** className */
  className?: string
  /** style */
  style?: React.CSSProperties
}

/* ============================================
   Select Component
   ============================================ */

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      options = [],
      placeholder = '请选择',
      disabled = false,
      filterable = false,
      onChange,
      onClear,
      className,
      style,
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = useState<string | number | undefined>(
      defaultValue,
    )
    const [isOpen, setIsOpen] = useState(false)
    const [searchText, setSearchText] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const isControlled = value !== undefined
    const currentValue = isControlled ? value : innerValue

    const selectedOption = useMemo(
      () => options.find((o) => o.value === currentValue),
      [options, currentValue],
    )

    const filteredOptions = useMemo(() => {
      if (!filterable || !searchText) return options
      const lower = searchText.toLowerCase()
      return options.filter((o) => o.label.toLowerCase().includes(lower))
    }, [options, filterable, searchText])

    const handleSelect = useCallback(
      (option: SelectOption) => {
        if (option.disabled) return
        if (!isControlled) setInnerValue(option.value)
        onChange?.(option.value)
        setIsOpen(false)
        setSearchText('')
      },
      [isControlled, onChange],
    )

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isControlled) setInnerValue(undefined)
        onClear?.()
      },
      [isControlled, onClear],
    )

    // Close on outside click
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
          setSearchText('')
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Focus input when opened in filterable mode
    useEffect(() => {
      if (isOpen && filterable && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isOpen, filterable])

    return (
      <div
        ref={containerRef}
        className={`select ${isOpen ? 'select--open' : ''} ${disabled ? 'select--disabled' : ''} ${className ?? ''}`}
        style={style}
      >
        <div
          className="select__trigger"
          onClick={() => !disabled && setIsOpen((v) => !v)}
          role="combobox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          {filterable && isOpen ? (
            <input
              ref={inputRef}
              className="select__search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder={placeholder}
            />
          ) : (
            <span className={`select__value ${!selectedOption ? 'select__value--placeholder' : ''}`}>
              {selectedOption?.label ?? placeholder}
            </span>
          )}
          <span className="select__suffix">
            {currentValue !== undefined && !disabled && (
              <span className="select__clear" onClick={handleClear}>
                ✕
              </span>
            )}
            <span className={`select__arrow ${isOpen ? 'select__arrow--open' : ''}`}>▼</span>
          </span>
        </div>

        {isOpen && (
          <div className="select__dropdown" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="select__empty">无匹配选项</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={String(option.value)}
                  className={`select__option ${option.value === currentValue ? 'select__option--selected' : ''} ${option.disabled ? 'select__option--disabled' : ''}`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.value === currentValue}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
```

- [ ] **Step 2: 创建 Select.module.css**

```css
/* ============================================
   Select Styles
   ============================================ */

.select {
  position: relative;
  display: inline-flex;
  min-width: 200px;
  font-family: var(--ui-font-family);
}

.select--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.select__trigger {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 0 var(--ui-spacing-lg) 0 var(--ui-spacing-base);
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-base);
  cursor: pointer;
  transition: border-color var(--ui-transition-duration);
  user-select: none;
}

.select__trigger:hover {
  border-color: var(--ui-primary);
}

.select--open .select__trigger {
  border-color: var(--ui-primary);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.select__value {
  flex: 1;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-size-base);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select__value--placeholder {
  color: var(--ui-text-placeholder);
}

.select__search {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-size-base);
  font-family: inherit;
}

.select__suffix {
  display: flex;
  align-items: center;
  gap: var(--ui-spacing-xs);
  color: var(--ui-text-secondary);
}

.select__clear {
  font-size: 10px;
  padding: 2px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color var(--ui-transition-duration);
}

.select__clear:hover {
  background-color: var(--ui-border-light);
  color: var(--ui-text-primary);
}

.select__arrow {
  font-size: 10px;
  transition: transform var(--ui-transition-duration);
  color: var(--ui-text-secondary);
}

.select__arrow--open {
  transform: rotate(180deg);
}

/* ============================================
   Dropdown
   ============================================ */

.select__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-base);
  box-shadow: var(--ui-shadow-light);
  max-height: 240px;
  overflow-y: auto;
  animation: selectDropdownFadeIn var(--ui-transition-duration) ease;
}

@keyframes selectDropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.select__option {
  padding: var(--ui-spacing-sm) var(--ui-spacing-base);
  font-size: var(--ui-font-size-base);
  color: var(--ui-text-primary);
  cursor: pointer;
  transition: background-color var(--ui-transition-duration);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select__option:hover {
  background-color: var(--ui-bg-page);
}

.select__option--selected {
  color: var(--ui-primary);
  font-weight: 500;
  background-color: rgba(64, 158, 255, 0.08);
}

.select__option--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.select__empty {
  padding: var(--ui-spacing-lg);
  text-align: center;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-size-sm);
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Select, type SelectProps, type SelectOption } from './Select'
```

- [ ] **Step 4: 创建 Select.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'
import { useState } from 'react'

const meta: Meta<typeof Select> = {
  title: 'UI1/Select 选择器',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    placeholder: '请选择',
    options: [
      { label: '选项一', value: 1 },
      { label: '选项二', value: 2 },
      { label: '选项三', value: 3 },
    ],
  },
}

export const Filterable: Story = {
  args: {
    placeholder: '搜索选项',
    filterable: true,
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
      { label: '杭州', value: 'hangzhou' },
    ],
  },
}

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState<string | number>(2)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Select
          value={val}
          onChange={(v) => setVal(v)}
          options={[
            { label: '苹果', value: 'apple' },
            { label: '香蕉', value: 'banana' },
            { label: '樱桃', value: 'cherry' },
          ]}
        />
        <p style={{ fontSize: '13px', color: 'var(--ui-text-secondary)' }}>
          当前值: {String(val)}
        </p>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    placeholder: '禁用状态',
    disabled: true,
    value: 'beijing',
    options: [{ label: '北京', value: 'beijing' }],
  },
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留 Checkbox 导出，新增：
export { Select, type SelectProps, type SelectOption } from './Select'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
cd c:/AAA/tool_ui/ui1
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Select/
git commit -m "feat(Select): 添加选择器组件

- 支持下拉单选
- 支持搜索过滤
- 支持清空
- 支持禁用"
```

---

### 任务 7: Switch 开关

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Switch/Switch.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Switch/Switch.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Switch/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Switch/Switch.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Switch.tsx**

```typescript
import React, { forwardRef, useCallback, useMemo } from 'react'

export interface SwitchProps {
  /** 是否开启 */
  checked?: boolean
  /** 默认状态（非受控） */
  defaultChecked?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 开启时的值 */
  activeValue?: boolean | string | number
  /** 关闭时的值 */
  inactiveValue?: boolean | string | number
  /** 变化回调 */
  onChange?: (value: boolean) => void
  /** 尺寸 */
  size?: 'small' | 'default'
  /** 开启状态文字 */
  activeText?: string
  /** 关闭状态文字 */
  inactiveText?: string
  className?: string
  style?: React.CSSProperties
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      activeValue = true,
      inactiveValue = false,
      onChange,
      size = 'default',
      activeText,
      inactiveText,
      className,
      style,
    },
    ref,
  ) => {
    const [innerChecked, setInnerChecked] = React.useState(defaultChecked)
    const isControlled = checked !== undefined
    const currentChecked = isControlled ? checked : innerChecked

    const handleClick = useCallback(() => {
      if (disabled) return
      const next = !currentChecked
      if (!isControlled) setInnerChecked(next)
      onChange?.(next)
    }, [disabled, currentChecked, isControlled, onChange])

    const sizeClass = size === 'small' ? 'switch--small' : 'switch--default'

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={currentChecked}
        className={`switch ${sizeClass} ${currentChecked ? 'switch--on' : 'switch--off'} ${disabled ? 'switch--disabled' : ''} ${className ?? ''}`}
        onClick={handleClick}
        disabled={disabled}
        style={style}
      >
        <span className="switch__core">
          <span className="switch__dot" />
        </span>
        {activeText && (
          <span className="switch__text switch__text--active">{activeText}</span>
        )}
        {inactiveText && (
          <span className="switch__text switch__text--inactive">{inactiveText}</span>
        )}
      </button>
    )
  },
)

Switch.displayName = 'Switch'
```

- [ ] **Step 2: 创建 Switch.module.css**

```css
/* ============================================
   Switch Styles
   ============================================ */

.switch {
  display: inline-flex;
  align-items: center;
  gap: var(--ui-spacing-sm);
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}

.switch--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Default size */
.switch--default .switch__core {
  width: 40px;
  height: 22px;
  border-radius: 11px;
}

/* Small size */
.switch--small .switch__core {
  width: 30px;
  height: 16px;
  border-radius: 8px;
}

.switch__core {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: var(--ui-border);
  transition: background-color var(--ui-transition-duration);
}

.switch--on .switch__core {
  background-color: var(--ui-primary);
}

.switch__dot {
  position: absolute;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform var(--ui-transition-duration);
}

.switch--default.switch--on .switch__dot {
  transform: translateX(18px);
}

.switch--small .switch__dot {
  width: 12px;
  height: 12px;
}

.switch--small.switch--on .switch__dot {
  transform: translateX(12px);
}

.switch__text {
  font-size: var(--ui-font-size-sm);
  color: var(--ui-text-secondary);
  user-select: none;
}

.switch__text--active {
  color: var(--ui-primary);
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Switch, type SwitchProps } from './Switch'
```

- [ ] **Step 4: 创建 Switch.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'
import { useState } from 'react'

const meta: Meta<typeof Switch> = {
  title: 'UI1/Switch 开关',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const WithText: Story = {
  args: {
    defaultChecked: false,
    activeText: 'ON',
    inactiveText: 'OFF',
  },
}

export const Small: Story = {
  args: {
    defaultChecked: false,
    size: 'small',
  },
}

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(true)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Switch checked={on} onChange={setOn} />
        <p style={{ fontSize: '13px', color: 'var(--ui-text-secondary)' }}>
          状态: {on ? '开启' : '关闭'}
        </p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Switch disabled defaultChecked={false} />
      <Switch disabled defaultChecked={true} />
    </div>
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Switch, type SwitchProps } from './Switch'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Switch/
git commit -m "feat(Switch): 添加开关组件

- 支持开启/关闭状态
- 支持文字标签
- 支持小/默认两种尺寸"
```

---

### 任务 8: Textarea 文本域

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Textarea/Textarea.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Textarea/Textarea.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Textarea/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Textarea/Textarea.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Textarea.tsx**

```typescript
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** 值（受控） */
  value?: string
  /** 默认值（非受控） */
  defaultValue?: string
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 最大字符数 */
  maxLength?: number
  /** 是否显示计数 */
  showCount?: boolean
  /** 行数 */
  rows?: number
  /** 变化回调 */
  onChange?: (value: string) => void
  className?: string
  style?: React.CSSProperties
}

export interface TextareaRef {
  focus: () => void
  blur: () => void
  textarea: HTMLTextAreaElement | null
}

export const Textarea = forwardRef<TextareaRef, TextareaProps>(
  (
    {
      value,
      defaultValue = '',
      placeholder,
      disabled = false,
      maxLength,
      showCount = false,
      rows = 3,
      onChange,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [innerValue, setInnerValue] = useState(defaultValue)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : innerValue

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      textarea: textareaRef.current,
    }))

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        if (!isControlled) setInnerValue(val)
        onChange?.(val)
      },
      [isControlled, onChange],
    )

    return (
      <div className={`textarea-wrap ${disabled ? 'textarea-wrap--disabled' : ''} ${className ?? ''}`} style={style}>
        <textarea
          ref={textareaRef}
          className="textarea"
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          value={currentValue}
          onChange={handleChange}
          {...rest}
        />
        {showCount && maxLength !== undefined && (
          <div className="textarea__count">
            {currentValue.length} / {maxLength}
          </div>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
```

- [ ] **Step 2: 创建 Textarea.module.css**

```css
/* ============================================
   Textarea Styles
   ============================================ */

.textarea-wrap {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}

.textarea {
  width: 100%;
  padding: var(--ui-spacing-sm) var(--ui-spacing-base);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size-base);
  color: var(--ui-text-primary);
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-base);
  resize: vertical;
  outline: none;
  transition: border-color var(--ui-transition-duration),
    box-shadow var(--ui-transition-duration);
  line-height: 1.6;
}

.textarea:hover {
  border-color: var(--ui-primary-light);
}

.textarea:focus {
  border-color: var(--ui-primary);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.textarea:disabled {
  background-color: var(--ui-bg-page);
  border-color: var(--ui-border-light);
  color: var(--ui-text-placeholder);
  cursor: not-allowed;
  resize: none;
}

.textarea::placeholder {
  color: var(--ui-text-placeholder);
}

.textarea__count {
  align-self: flex-end;
  margin-top: var(--ui-spacing-xs);
  font-size: var(--ui-font-size-xs);
  color: var(--ui-text-secondary);
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Textarea, type TextareaProps, type TextareaRef } from './Textarea'
```

- [ ] **Step 4: 创建 Textarea.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'
import { useState } from 'react'

const meta: Meta<typeof Textarea> = {
  title: 'UI1/Textarea 文本域',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: '请输入内容...',
    rows: 3,
  },
}

export const WithCount: Story = {
  args: {
    placeholder: '最多输入100字',
    maxLength: 100,
    showCount: true,
    rows: 3,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: '禁用状态',
    disabled: true,
    defaultValue: '这是禁用的文本内容',
  },
}

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Textarea value={val} onChange={setVal} placeholder="双向绑定示例" rows={4} />
        <p style={{ fontSize: '13px', color: 'var(--ui-text-secondary)' }}>
          字数: {val.length}
        </p>
      </div>
    )
  },
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Textarea, type TextareaProps, type TextareaRef } from './Textarea'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Textarea/
git commit -m "feat(Textarea): 添加文本域组件

- 支持最大字符数和字数统计
- 支持禁用状态
- 支持 resize"
```

---

### 任务 9: Modal 对话框

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Modal/Modal.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Modal/Modal.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Modal/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Modal/Modal.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Modal.tsx**

```typescript
import React, { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
  /** 是否显示 */
  open: boolean
  /** 标题 */
  title?: React.ReactNode
  /** 内容 */
  children?: React.ReactNode
  /** 自定义底部 */
  footer?: React.ReactNode
  /** 宽度 */
  width?: string | number
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否点击遮罩关闭 */
  closeOnOverlay?: boolean
  /** 是否按 ESC 关闭 */
  closeOnEsc?: boolean
  /** 关闭回调 */
  onClose?: () => void
  className?: string
  style?: React.CSSProperties
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  footer,
  width = 520,
  showClose = true,
  closeOnOverlay = true,
  closeOnEsc = true,
  onClose,
  className,
  style,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlay && e.target === e.currentTarget) {
        handleClose()
      }
    },
    [closeOnOverlay, handleClose],
  )

  useEffect(() => {
    if (!closeOnEsc || !open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeOnEsc, open, handleClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div
        ref={dialogRef}
        className={`modal ${className ?? ''}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width, ...style }}
      >
        <div className="modal__header">
          <span className="modal__title">{title}</span>
          {showClose && (
            <button className="modal__close" onClick={handleClose} aria-label="关闭">
              ✕
            </button>
          )}
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

Modal.displayName = 'Modal'
```

- [ ] **Step 2: 创建 Modal.module.css**

```css
/* ============================================
   Modal Styles
   ============================================ */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  animation: overlayFadeIn var(--ui-transition-duration) ease;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  position: relative;
  background-color: var(--ui-bg);
  border-radius: var(--ui-radius-large);
  box-shadow: var(--ui-shadow-dark);
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  animation: modalSlideIn var(--ui-transition-duration) ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ui-spacing-lg) var(--ui-spacing-xl);
  border-bottom: 1px solid var(--ui-border-lighter);
  flex-shrink: 0;
}

.modal__title {
  font-size: var(--ui-font-size-lg);
  font-weight: 600;
  color: var(--ui-text-primary);
}

.modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--ui-text-secondary);
  cursor: pointer;
  border-radius: var(--ui-radius-small);
  font-size: 14px;
  transition: background-color var(--ui-transition-duration),
    color var(--ui-transition-duration);
}

.modal__close:hover {
  background-color: var(--ui-bg-page);
  color: var(--ui-text-primary);
}

.modal__body {
  padding: var(--ui-spacing-xl);
  overflow-y: auto;
  flex: 1;
  color: var(--ui-text-regular);
  font-size: var(--ui-font-size-base);
  line-height: 1.6;
}

.modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ui-spacing-sm);
  padding: var(--ui-spacing-base) var(--ui-spacing-xl);
  border-top: 1px solid var(--ui-border-lighter);
  flex-shrink: 0;
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Modal, type ModalProps } from './Modal'
```

- [ ] **Step 4: 创建 Modal.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '../Button/Button'
import { useState } from 'react'

const meta: Meta<typeof Modal> = {
  title: 'UI1/Modal 对话框',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>打开对话框</Button>
        <Modal
          open={open}
          title="对话框标题"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setOpen(false)}>确定</Button>
            </>
          }
        >
          <p>这是一段对话框内容，可以包含任意 React 元素。</p>
        </Modal>
      </>
    )
  },
}

export const NoFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>无底部对话框</Button>
        <Modal open={open} title="无底部对话框" onClose={() => setOpen(false)}>
          <p>没有底部的对话框，用于纯信息展示。</p>
        </Modal>
      </>
    )
  },
}

export const CustomWidth: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>800px 宽度</Button>
        <Modal open={open} title="自定义宽度" onClose={() => setOpen(false)} width={800}>
          <p>对话框内容区域，宽度为 800px。</p>
        </Modal>
      </>
    )
  },
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Modal, type ModalProps } from './Modal'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Modal/
git commit -m "feat(Modal): 添加对话框组件

- 支持 title、footer 自定义
- 支持点击遮罩和 ESC 关闭
- 支持 body scroll 锁定
- 支持自定义宽度"
```

---

### 任务 10: Tooltip 气泡提示

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Tooltip/Tooltip.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Tooltip/Tooltip.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Tooltip/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Tooltip/Tooltip.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Tooltip.tsx**

```typescript
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** 提示内容 */
  content: React.ReactNode
  /** 触发方式 */
  trigger?: 'hover' | 'click'
  /** 显示位置 */
  placement?: TooltipPlacement
  /** 延迟（毫秒） */
  delay?: number
  /** 子元素 */
  children: React.ReactElement
  className?: string
  style?: React.CSSProperties
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  trigger = 'hover',
  placement = 'top',
  delay = 200,
  children,
  className,
  style,
}) => {
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }, [])

  const handleClick = useCallback(() => {
    if (trigger === 'click') setVisible((v) => !v)
  }, [trigger])

  useEffect(() => {
    if (!visible) return
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [visible])

  const triggerProps =
    trigger === 'hover'
      ? { onMouseEnter: show, onMouseLeave: hide }
      : { onClick: handleClick }

  const position = (): { top: number; left: number } => {
    if (!triggerRef.current) return { top: 0, left: 0 }
    const rect = triggerRef.current.getBoundingClientRect()
    const gap = 8
    switch (placement) {
      case 'top':
        return { top: rect.top + window.scrollY - gap, left: rect.left + window.scrollX + rect.width / 2 }
      case 'bottom':
        return { top: rect.bottom + window.scrollY + gap, left: rect.left + window.scrollX + rect.width / 2 }
      case 'left':
        return { top: rect.top + window.scrollY + rect.height / 2, left: rect.left + window.scrollX - gap }
      case 'right':
        return { top: rect.top + window.scrollY + rect.height / 2, left: rect.right + window.scrollX + gap }
      default:
        return { top: rect.top + window.scrollY - gap, left: rect.left + window.scrollX + rect.width / 2 }
    }
  }

  return (
    <>
      <span ref={triggerRef} className={`tooltip-trigger ${className ?? ''}`} style={style}>
        {React.cloneElement(children, triggerProps)}
      </span>
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`tooltip tooltip--${placement}`}
            style={(() => {
              const pos = position()
              const transforms: Record<TooltipPlacement, string> = {
                top: 'translate(-50%, -100%)',
                bottom: 'translate(-50%, 0)',
                left: 'translate(-100%, -50%)',
                right: 'translate(0, -50%)',
              }
              return {
                top: pos.top,
                left: pos.left,
                transform: transforms[placement],
              }
            })()}
            role="tooltip"
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}

Tooltip.displayName = 'Tooltip'
```

- [ ] **Step 2: 创建 Tooltip.module.css**

```css
/* ============================================
   Tooltip Styles
   ============================================ */

.tooltip-trigger {
  display: inline-flex;
}

.tooltip {
  position: absolute;
  z-index: 3000;
  padding: var(--ui-spacing-sm) var(--ui-spacing-base);
  background-color: #303133;
  color: white;
  font-size: var(--ui-font-size-sm);
  border-radius: var(--ui-radius-base);
  white-space: nowrap;
  box-shadow: var(--ui-shadow-light);
  pointer-events: none;
  animation: tooltipFadeIn 0.15s ease;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.tooltip::after {
  content: '';
  position: absolute;
  border: 5px solid transparent;
}

.tooltip--top::after {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #303133;
}

.tooltip--bottom::after {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #303133;
}

.tooltip--left::after {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #303133;
}

.tooltip--right::after {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #303133;
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Tooltip, type TooltipProps, type TooltipPlacement } from './Tooltip'
```

- [ ] **Step 4: 创建 Tooltip.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../Button/Button'

const meta: Meta<typeof Tooltip> = {
  title: 'UI1/Tooltip 气泡提示',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip content="这是一条提示信息">
      <Button>鼠标悬停</Button>
    </Tooltip>
  ),
}

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '300px' }}>
      <div style={{ gridColumn: '2' }}>
        <Tooltip content="上方提示" placement="top">
          <Button variant="secondary">上</Button>
        </Tooltip>
      </div>
      <Tooltip content="左侧提示" placement="left">
        <Button variant="secondary">左</Button>
      </Tooltip>
      <Tooltip content="右侧提示" placement="right">
        <Button variant="secondary">右</Button>
      </Tooltip>
      <div style={{ gridColumn: '2' }}>
        <Tooltip content="下方提示" placement="bottom">
          <Button variant="secondary">下</Button>
        </Tooltip>
      </div>
    </div>
  ),
}

export const ClickTrigger: Story = {
  render: () => (
    <Tooltip content="点击触发" trigger="click">
      <Button>点击</Button>
    </Tooltip>
  ),
}

export const RichContent: Story = {
  render: () => (
    <Tooltip
      content={
        <div>
          <strong>提示标题</strong>
          <br />
          提示内容详情
        </div>
      }
    >
      <Button>富文本提示</Button>
    </Tooltip>
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Tooltip, type TooltipProps, type TooltipPlacement } from './Tooltip'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Tooltip/
git commit -m "feat(Tooltip): 添加气泡提示组件

- 支持 hover 和 click 两种触发方式
- 支持 top/bottom/left/right 四种位置
- 支持富文本内容
- 使用 Portal 渲染"
```

---

### 任务 11: Message 消息提示

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Message/Message.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Message/Message.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Message/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Message/Message.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Message.tsx**

```typescript
import React, { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

/* ============================================
   Message API
   ============================================ */

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface MessageOptions {
  content: React.ReactNode
  type?: MessageType
  duration?: number
  closable?: boolean
  onClose?: () => void
}

interface MessageItem {
  id: string
  options: MessageOptions
  onClose: () => void
}

// Global state managed outside React
const messageItems: MessageItem[] = []
let setMessageItemsFn: React.Dispatch<React.SetStateAction<MessageItem[]>> | null = null

const removeMessage = (id: string) => {
  const idx = messageItems.findIndex((m) => m.id === id)
  if (idx !== -1) {
    const item = messageItems[idx]
    item.onClose()
    messageItems.splice(idx, 1)
    setMessageItemsFn?.([...messageItems])
  }
}

const addMessage = (options: MessageOptions): (() => void) => {
  const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const close = () => removeMessage(id)
  messageItems.push({ id, options, onClose: close })
  setMessageItemsFn?.([...messageItems])
  return close
}

// Exported API
export const Message = {
  success: (content: React.ReactNode, opts?: Partial<MessageOptions>) =>
    addMessage({ content, type: 'success', ...opts }),
  error: (content: React.ReactNode, opts?: Partial<MessageOptions>) =>
    addMessage({ content, type: 'error', ...opts }),
  warning: (content: React.ReactNode, opts?: Partial<MessageOptions>) =>
    addMessage({ content, type: 'warning', ...opts }),
  info: (content: React.ReactNode, opts?: Partial<MessageOptions>) =>
    addMessage({ content, type: 'info', ...opts }),
  config: (options: Partial<MessageOptions>) => addMessage(options as MessageOptions),
}

/* ============================================
   MessageContainer (renders all messages)
   ============================================ */

const MessageItemComponent: React.FC<{
  item: MessageItem
  onRemove: (id: string) => void
}> = ({ item, onRemove }) => {
  const { options } = item
  const duration = options.duration ?? 3000
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        onRemove(item.id)
        options.onClose?.()
      }, duration)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [duration, item.id, onRemove, options])

  const icons: Record<MessageType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div className={`message message--${options.type ?? 'info'}`}>
      <span className="message__icon">{icons[options.type ?? 'info']}</span>
      <span className="message__content">{options.content}</span>
      {options.closable && (
        <button
          className="message__close"
          onClick={() => {
            onRemove(item.id)
            options.onClose?.()
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export const MessageContainer: React.FC = () => {
  const [items, setItems] = React.useState<MessageItem[]>([])

  useEffect(() => {
    setMessageItemsFn = setItems
    return () => {
      setMessageItemsFn = null
    }
  }, [])

  const handleRemove = useCallback((id: string) => {
    removeMessage(id)
  }, [])

  if (items.length === 0) return null

  return createPortal(
    <div className="message-container" aria-live="polite">
      {items.map((item) => (
        <MessageItemComponent key={item.id} item={item} onRemove={handleRemove} />
      ))}
    </div>,
    document.body,
  )
}
```

- [ ] **Step 2: 创建 Message.module.css**

```css
/* ============================================
   Message Styles
   ============================================ */

.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ui-spacing-sm);
  pointer-events: none;
}

.message {
  display: flex;
  align-items: center;
  gap: var(--ui-spacing-sm);
  padding: var(--ui-spacing-sm) var(--ui-spacing-lg);
  background-color: var(--ui-bg);
  border-radius: var(--ui-radius-base);
  box-shadow: var(--ui-shadow-dark);
  pointer-events: auto;
  min-width: 240px;
  max-width: 480px;
  animation: messageSlideIn 0.3s ease;
  border-left: 3px solid;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message--success {
  border-left-color: var(--ui-success);
}

.message--error {
  border-left-color: var(--ui-danger);
}

.message--warning {
  border-left-color: var(--ui-warning);
}

.message--info {
  border-left-color: var(--ui-primary);
}

.message__icon {
  font-size: 14px;
  flex-shrink: 0;
}

.message--success .message__icon { color: var(--ui-success); }
.message--error .message__icon { color: var(--ui-danger); }
.message--warning .message__icon { color: var(--ui-warning); }
.message--info .message__icon { color: var(--ui-primary); }

.message__content {
  flex: 1;
  font-size: var(--ui-font-size-base);
  color: var(--ui-text-primary);
  line-height: 1.5;
}

.message__close {
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: var(--ui-text-secondary);
  cursor: pointer;
  font-size: 12px;
  padding: 2px;
  border-radius: var(--ui-radius-small);
  transition: color var(--ui-transition-duration);
}

.message__close:hover {
  color: var(--ui-text-primary);
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Message, MessageContainer, type MessageOptions, type MessageType } from './Message'
```

- [ ] **Step 4: 创建 Message.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Message } from './Message'

const meta: Meta<typeof Message> = {
  title: 'UI1/Message 消息提示',
  component: Message,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Message>

export const Success: Story = {
  render: () => (
    <div style={{ padding: '200px 0', textAlign: 'center' }}>
      <button onClick={() => Message.success('保存成功！')}>成功提示</button>
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div style={{ padding: '200px 0', textAlign: 'center' }}>
      <button onClick={() => Message.error('操作失败，请重试')}>错误提示</button>
    </div>
  ),
}

export const Warning: Story = {
  render: () => (
    <div style={{ padding: '200px 0', textAlign: 'center' }}>
      <button onClick={() => Message.warning('数据即将过期')}>警告提示</button>
    </div>
  ),
}

export const Info: Story = {
  render: () => (
    <div style={{ padding: '200px 0', textAlign: 'center' }}>
      <button onClick={() => Message.info('有新版本可用')}>信息提示</button>
    </div>
  ),
}

export const Closable: Story = {
  render: () => (
    <div style={{ padding: '200px 0', textAlign: 'center' }}>
      <button onClick={() => Message.info('不可自动关闭', { duration: 0, closable: true })}>
        手动关闭
      </button>
    </div>
  ),
}

export const LongDuration: Story = {
  render: () => (
    <div style={{ padding: '200px 0', textAlign: 'center' }}>
      <button onClick={() => Message.success('5秒后消失', { duration: 5000 })}>
        5秒后自动关闭
      </button>
    </div>
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Message, MessageContainer, type MessageOptions, type MessageType } from './Message'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Message/
git commit -m "feat(Message): 添加消息提示组件

- 提供 Message.success/error/warning/info 静态方法
- 支持自动关闭和手动关闭
- 支持自定义持续时间
- 使用 Portal 渲染到 body"
```

---

### 任务 12: Tag 标签

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Tag/Tag.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Tag/Tag.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Tag/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Tag/Tag.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Tag.tsx**

```typescript
import React, { forwardRef, useCallback } from 'react'

export type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type TagSize = 'small' | 'default' | 'large'

export interface TagProps {
  /** 标签文本 */
  children?: React.ReactNode
  /** 类型颜色 */
  type?: TagType
  /** 是否可关闭 */
  closable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 关闭回调 */
  onClose?: (e: React.MouseEvent) => void
  /** 尺寸 */
  size?: TagSize
  /** 是否为深色填充风格 */
  effect?: 'light' | 'dark' | 'plain'
  className?: string
  style?: React.CSSProperties
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      type = 'primary',
      closable = false,
      disabled = false,
      onClose,
      size = 'default',
      effect = 'light',
      className,
      style,
    },
    ref,
  ) => {
    const handleClose = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!disabled) onClose?.(e)
      },
      [disabled, onClose],
    )

    return (
      <span
        ref={ref}
        className={`tag tag--${type} tag--${size} tag--${effect} ${disabled ? 'tag--disabled' : ''} ${className ?? ''}`}
        style={style}
      >
        <span className="tag__text">{children}</span>
        {closable && !disabled && (
          <button className="tag__close" onClick={handleClose} aria-label="关闭">
            ✕
          </button>
        )}
      </span>
    )
  },
)

Tag.displayName = 'Tag'
```

- [ ] **Step 2: 创建 Tag.module.css**

```css
/* ============================================
   Tag Styles
   ============================================ */

/* Base */
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--ui-spacing-xs);
  border-radius: var(--ui-radius-small);
  font-family: var(--ui-font-family);
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all var(--ui-transition-duration);
}

.tag--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.tag--small {
  padding: 0 var(--ui-spacing-xs);
  font-size: var(--ui-font-size-xs);
  height: 20px;
}

.tag--default {
  padding: 0 var(--ui-spacing-sm);
  font-size: var(--ui-font-size-sm);
  height: 24px;
}

.tag--large {
  padding: 0 var(--ui-spacing-base);
  font-size: var(--ui-font-size-base);
  height: 28px;
}

/* Effect: light */
.tag--light.tag--primary {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--ui-primary);
  border-color: rgba(64, 158, 255, 0.2);
}
.tag--light.tag--success {
  background-color: rgba(103, 194, 58, 0.1);
  color: var(--ui-success);
  border-color: rgba(103, 194, 58, 0.2);
}
.tag--light.tag--warning {
  background-color: rgba(230, 162, 60, 0.1);
  color: var(--ui-warning);
  border-color: rgba(230, 162, 60, 0.2);
}
.tag--light.tag--danger {
  background-color: rgba(245, 108, 108, 0.1);
  color: var(--ui-danger);
  border-color: rgba(245, 108, 108, 0.2);
}
.tag--light.tag--info {
  background-color: rgba(144, 147, 153, 0.1);
  color: var(--ui-info);
  border-color: rgba(144, 147, 153, 0.2);
}

/* Effect: dark */
.tag--dark.tag--primary { background-color: var(--ui-primary); color: white; }
.tag--dark.tag--success { background-color: var(--ui-success); color: white; }
.tag--dark.tag--warning { background-color: var(--ui-warning); color: white; }
.tag--dark.tag--danger { background-color: var(--ui-danger); color: white; }
.tag--dark.tag--info { background-color: var(--ui-info); color: white; }

/* Effect: plain */
.tag--plain.tag--primary {
  background-color: transparent;
  color: var(--ui-primary);
  border-color: var(--ui-primary);
}
.tag--plain.tag--success {
  background-color: transparent;
  color: var(--ui-success);
  border-color: var(--ui-success);
}
.tag--plain.tag--warning {
  background-color: transparent;
  color: var(--ui-warning);
  border-color: var(--ui-warning);
}
.tag--plain.tag--danger {
  background-color: transparent;
  color: var(--ui-danger);
  border-color: var(--ui-danger);
}
.tag--plain.tag--info {
  background-color: transparent;
  color: var(--ui-info);
  border-color: var(--ui-info);
}

/* Close button */
.tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  color: inherit;
  opacity: 0.7;
  border-radius: 50%;
  transition: opacity var(--ui-transition-duration),
    background-color var(--ui-transition-duration);
  padding: 0;
  line-height: 1;
}

.tag__close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Tag, type TagProps, type TagType, type TagSize } from './Tag'
```

- [ ] **Step 4: 创建 Tag.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './Tag'
import { useState } from 'react'

const meta: Meta<typeof Tag> = {
  title: 'UI1/Tag 标签',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {
  args: {
    children: '标签',
  },
}

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag type="primary">主要</Tag>
      <Tag type="success">成功</Tag>
      <Tag type="warning">警告</Tag>
      <Tag type="danger">危险</Tag>
      <Tag type="info">信息</Tag>
    </div>
  ),
}

export const Closable: Story = {
  render: () => {
    const [tags, setTags] = useState(['标签一', '标签二', '标签三'])
    const remove = (t: string) => setTags((prev) => prev.filter((v) => v !== t))
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {tags.map((t) => (
          <Tag key={t} closable onClose={() => remove(t)}>
            {t}
          </Tag>
        ))}
      </div>
    )
  },
}

export const Effects: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Tag effect="light">浅色</Tag>
        <Tag effect="dark">深色</Tag>
        <Tag effect="plain">朴素</Tag>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Tag size="small">小号</Tag>
      <Tag size="default">默认</Tag>
      <Tag size="large">大号</Tag>
    </div>
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Tag, type TagProps, type TagType, type TagSize } from './Tag'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Tag/
git commit -m "feat(Tag): 添加标签组件

- 支持 5 种类型 (primary/success/warning/danger/info)
- 支持 3 种效果 (light/dark/plain)
- 支持 3 种尺寸 (small/default/large)
- 支持可关闭"
```

---

### 任务 13: Table 表格

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Table/Table.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Table/Table.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Table/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Table/Table.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Table.tsx**

```typescript
import React, { useState, useMemo, useCallback } from 'react'

export interface TableColumn<T = Record<string, unknown>> {
  /** 列标识 */
  key: string
  /** 列标题 */
  title: string
  /** 数据索引 */
  dataIndex?: string
  /** 自定义渲染 */
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  /** 是否可排 */
  sortable?: boolean
  /** 列宽 */
  width?: string | number
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
}

export interface TableProps<T = Record<string, unknown>> {
  /** 列定义 */
  columns: TableColumn<T>[]
  /** 数据源 */
  data: T[]
  /** 行 key 提取 */
  rowKey?: keyof T | ((record: T) => string | number)
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否有斑马纹 */
  stripe?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 分页配置 */
  pagination?: false | {
    current?: number
    pageSize?: number
    total?: number
    onChange?: (page: number, pageSize: number) => void
  }
  /** 行点击 */
  onRowClick?: (record: T, index: number) => void
  className?: string
  style?: React.CSSProperties
}

type SortOrder = 'asc' | 'desc' | null

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  bordered = false,
  stripe = false,
  size = 'default',
  pagination,
  onRowClick,
  className,
  style,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const getRowKey = useCallback(
    (record: T, index: number): string | number => {
      if (typeof rowKey === 'function') return rowKey(record)
      if (typeof rowKey === 'string') return String(record[rowKey] ?? index)
      return index
    },
    [rowKey],
  )

  const handleSort = useCallback((key: string) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortOrder((order) => (order === 'asc' ? 'desc' : order === 'desc' ? null : 'asc'))
      } else {
        setSortOrder('asc')
      }
      return prev === key ? prev : key
    })
    if (sortKey === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : o === 'desc' ? null : 'asc'))
    } else {
      setSortOrder('asc')
    }
  }, [sortKey])

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortOrder === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortOrder])

  const pagedData = useMemo(() => {
    if (!pagination) return sortedData
    const { current = 1, pageSize = 10 } = pagination
    const start = (current - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, pagination])

  return (
    <div className={`table-wrap ${className ?? ''}`} style={style}>
      <table
        className={[
          'table',
          `table--${size}`,
          bordered ? 'table--bordered' : '',
          stripe ? 'table--stripe' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`table__th ${col.sortable ? 'table__th--sortable' : ''}`}
                style={{
                  width: col.width,
                  textAlign: col.align ?? 'left',
                }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="table__th-inner">
                  {col.title}
                  {col.sortable && (
                    <span className="table__sort-icon">
                      {sortKey === col.key
                        ? sortOrder === 'asc'
                          ? '↑'
                          : sortOrder === 'desc'
                            ? '↓'
                            : '↕'
                        : '↕'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">
                暂无数据
              </td>
            </tr>
          ) : (
            pagedData.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={`table__tr ${onRowClick ? 'table__tr--clickable' : ''}`}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="table__td"
                    style={{ textAlign: col.align ?? 'left' }}
                  >
                    {col.render
                      ? col.render(record[col.dataIndex ?? col.key] as unknown, record, index)
                      : (record[col.dataIndex ?? col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination !== false && pagination && (
        <div className="table__pagination">
          <span className="table__pagination-info">
            共 {pagination.total ?? data.length} 条
          </span>
          <div className="table__pagination-controls">
            <button
              className="table__page-btn"
              disabled={pagination.current === 1}
              onClick={() => pagination.onChange?.(pagination.current! - 1, pagination.pageSize ?? 10)}
            >
              ‹
            </button>
            <span className="table__page-current">
              {pagination.current ?? 1} / {Math.ceil((pagination.total ?? data.length) / (pagination.pageSize ?? 10))}
            </span>
            <button
              className="table__page-btn"
              disabled={
                pagination.current! >=
                Math.ceil((pagination.total ?? data.length) / (pagination.pageSize ?? 10))
              }
              onClick={() => pagination.onChange?.(pagination.current! + 1, pagination.pageSize ?? 10)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 创建 Table.module.css**

```css
/* ============================================
   Table Styles
   ============================================ */

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size-base);
}

.table--bordered {
  border: 1px solid var(--ui-border);
}

.table__th,
.table__td {
  padding: var(--ui-spacing-base) var(--ui-spacing-lg);
  border-bottom: 1px solid var(--ui-border-lighter);
  color: var(--ui-text-primary);
}

.table__th {
  background-color: var(--ui-bg-page);
  font-weight: 600;
  font-size: var(--ui-font-size-sm);
  color: var(--ui-text-secondary);
  white-space: nowrap;
}

.table__th--sortable {
  cursor: pointer;
  user-select: none;
}

.table__th--sortable:hover {
  color: var(--ui-primary);
}

.table__th-inner {
  display: flex;
  align-items: center;
  gap: var(--ui-spacing-xs);
}

.table__sort-icon {
  font-size: 10px;
  color: var(--ui-text-placeholder);
}

.table--stripe .table__tr:nth-child(even) {
  background-color: var(--ui-bg-page);
}

.table__tr--clickable {
  cursor: pointer;
}

.table__tr--clickable:hover {
  background-color: rgba(64, 158, 255, 0.04);
}

.table__empty {
  text-align: center;
  color: var(--ui-text-secondary);
  padding: var(--ui-spacing-xl) !important;
  font-size: var(--ui-font-size-sm);
}

/* Size variations */
.table--small .table__th,
.table--small .table__td {
  padding: var(--ui-spacing-sm) var(--ui-spacing-base);
  font-size: var(--ui-font-size-sm);
}

.table--large .table__th,
.table--large .table__td {
  padding: var(--ui-spacing-lg) var(--ui-spacing-xl);
  font-size: var(--ui-font-size-lg);
}

/* Pagination */
.table__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ui-spacing-base) var(--ui-spacing-lg);
  border-top: 1px solid var(--ui-border-lighter);
}

.table__pagination-info {
  font-size: var(--ui-font-size-sm);
  color: var(--ui-text-secondary);
}

.table__pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--ui-spacing-sm);
}

.table__page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 var(--ui-spacing-sm);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-small);
  background-color: var(--ui-bg);
  color: var(--ui-text-primary);
  cursor: pointer;
  font-size: var(--ui-font-size-base);
  transition: all var(--ui-transition-duration);
}

.table__page-btn:hover:not(:disabled) {
  border-color: var(--ui-primary);
  color: var(--ui-primary);
}

.table__page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.table__page-current {
  font-size: var(--ui-font-size-sm);
  color: var(--ui-text-secondary);
  min-width: 60px;
  text-align: center;
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Table, type TableProps, type TableColumn } from './Table'
```

- [ ] **Step 4: 创建 Table.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import { useState } from 'react'

const meta: Meta<typeof Table> = {
  title: 'UI1/Table 表格',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Table>

const sampleData = [
  { id: 1, name: '张三', age: 28, city: '北京', score: 92 },
  { id: 2, name: '李四', age: 34, city: '上海', score: 85 },
  { id: 3, name: '王五', age: 22, city: '广州', score: 78 },
  { id: 4, name: '赵六', age: 41, city: '深圳', score: 88 },
  { id: 5, name: '孙七', age: 30, city: '杭州', score: 95 },
]

export const Default: Story = {
  render: () => (
    <Table
      columns={[
        { key: 'id', title: 'ID', dataIndex: 'id', width: 60 },
        { key: 'name', title: '姓名', dataIndex: 'name' },
        { key: 'age', title: '年龄', dataIndex: 'age', sortable: true },
        { key: 'city', title: '城市', dataIndex: 'city' },
        { key: 'score', title: '分数', dataIndex: 'score', sortable: true },
      ]}
      data={sampleData}
      rowKey="id"
    />
  ),
}

export const BorderedAndStripe: Story = {
  render: () => (
    <Table
      columns={[
        { key: 'id', title: 'ID', dataIndex: 'id', width: 60 },
        { key: 'name', title: '姓名', dataIndex: 'name' },
        { key: 'age', title: '年龄', dataIndex: 'age' },
        { key: 'city', title: '城市', dataIndex: 'city' },
        { key: 'score', title: '分数', dataIndex: 'score', sortable: true },
      ]}
      data={sampleData}
      rowKey="id"
      bordered
      stripe
    />
  ),
}

export const WithPagination: Story = {
  render: () => {
    const allData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      age: 20 + (i % 20),
      city: ['北京', '上海', '广州', '深圳'][i % 4],
      score: 60 + (i * 3) % 40,
    }))
    const [page, setPage] = useState(1)
    return (
      <Table
        columns={[
          { key: 'id', title: 'ID', dataIndex: 'id', width: 60 },
          { key: 'name', title: '姓名', dataIndex: 'name' },
          { key: 'age', title: '年龄', dataIndex: 'age' },
          { key: 'city', title: '城市', dataIndex: 'city' },
          { key: 'score', title: '分数', dataIndex: 'score' },
        ]}
        data={allData}
        rowKey="id"
        pagination={{ current: page, pageSize: 5, total: allData.length, onChange: setPage }}
      />
    )
  },
}

export const WithCustomRender: Story = {
  render: () => (
    <Table
      columns={[
        { key: 'name', title: '姓名', dataIndex: 'name' },
        {
          key: 'score',
          title: '分数',
          dataIndex: 'score',
          sortable: true,
          render: (val) => (
            <span style={{ color: Number(val) >= 90 ? 'var(--ui-success)' : 'var(--ui-danger)' }}>
              {val}
            </span>
          ),
        },
        {
          key: 'level',
          title: '等级',
          render: (_, row: { score: number }) => (
            <span>{row.score >= 90 ? '优秀' : row.score >= 80 ? '良好' : '及格'}</span>
          ),
        },
      ]}
      data={sampleData}
      rowKey="id"
    />
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Table, type TableProps, type TableColumn } from './Table'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Table/
git commit -m "feat(Table): 添加表格组件

- 支持列定义和自定义渲染
- 支持排序
- 支持斑马纹和边框
- 支持基础分页
- 支持行点击回调"
```

---

### 任务 14: Dropdown 下拉菜单

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Dropdown/Dropdown.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Dropdown/Dropdown.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Dropdown/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Dropdown/Dropdown.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Dropdown.tsx**

```typescript
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface DropdownItem {
  /** 显示文本 */
  label: React.ReactNode
  /** 唯一标识 */
  key: string
  /** 是否禁用 */
  disabled?: boolean
  /** 分隔线 */
  divided?: boolean
}

export interface DropdownProps {
  /** 触发器 */
  trigger?: React.ReactNode
  /** 菜单项 */
  items: DropdownItem[]
  /** 触发方式 */
  triggerType?: 'hover' | 'click'
  /** 菜单位置 */
  placement?: 'bottom' | 'top'
  /** 选择回调 */
  onSelect?: (key: string) => void
  className?: string
  style?: React.CSSProperties
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  triggerType = 'click',
  placement = 'bottom',
  onSelect,
  className,
  style,
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  const handleTrigger =
    triggerType === 'hover'
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        }
      : { onClick: () => setOpen((v) => !v) }

  const handleSelect = useCallback(
    (item: DropdownItem) => {
      if (item.disabled) return
      onSelect?.(item.key)
      setOpen(false)
    },
    [onSelect],
  )

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Calculate position
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  useEffect(() => {
    if (!open || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const top = placement === 'bottom' ? rect.bottom + window.scrollY + 4 : rect.top + window.scrollY - 4
    setMenuPos({ top, left: rect.left + window.scrollX })
  }, [open, placement])

  return (
    <div ref={containerRef} className={`dropdown ${className ?? ''}`} style={style}>
      <div className="dropdown__trigger" {...handleTrigger}>
        {trigger}
      </div>
      {open &&
        createPortal(
          <ul
            ref={menuRef}
            className={`dropdown__menu dropdown__menu--${placement}`}
            style={{ top: menuPos.top, left: menuPos.left }}
            role="menu"
          >
            {items.map((item) =>
              item.divided ? (
                <li key={`divided-${item.key}`} className="dropdown__divided" role="separator" />
              ) : (
                <li
                  key={item.key}
                  className={`dropdown__item ${item.disabled ? 'dropdown__item--disabled' : ''}`}
                  role="menuitem"
                  onClick={() => handleSelect(item)}
                >
                  {item.label}
                </li>
              ),
            )}
          </ul>,
          document.body,
        )}
    </div>
  )
}

Dropdown.displayName = 'Dropdown'
```

- [ ] **Step 2: 创建 Dropdown.module.css**

```css
/* ============================================
   Dropdown Styles
   ============================================ */

.dropdown {
  display: inline-flex;
  position: relative;
}

.dropdown__trigger {
  display: inline-flex;
}

.dropdown__menu {
  position: absolute;
  z-index: 1500;
  min-width: 160px;
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-base);
  box-shadow: var(--ui-shadow-light);
  padding: var(--ui-spacing-xs) 0;
  list-style: none;
  animation: dropdownFadeIn 0.15s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown__menu--bottom {
  transform-origin: top;
}

.dropdown__menu--top {
  transform-origin: bottom;
  animation-name: dropdownFadeInTop;
}

@keyframes dropdownFadeInTop {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown__item {
  padding: var(--ui-spacing-sm) var(--ui-spacing-lg);
  font-size: var(--ui-font-size-base);
  color: var(--ui-text-primary);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color var(--ui-transition-duration);
}

.dropdown__item:hover {
  background-color: var(--ui-bg-page);
  color: var(--ui-primary);
}

.dropdown__item--disabled {
  color: var(--ui-text-placeholder);
  cursor: not-allowed;
}

.dropdown__item--disabled:hover {
  background-color: transparent;
  color: var(--ui-text-placeholder);
}

.dropdown__divided {
  height: 1px;
  background-color: var(--ui-border-lighter);
  margin: var(--ui-spacing-xs) 0;
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Dropdown, type DropdownProps, type DropdownItem } from './Dropdown'
```

- [ ] **Step 4: 创建 Dropdown.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'
import { Button } from '../Button/Button'

const meta: Meta<typeof Dropdown> = {
  title: 'UI1/Dropdown 下拉菜单',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Dropdown>

const items = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'delete', label: '删除', disabled: true },
  { key: 'divided1', label: '', divided: true },
  { key: 'share', label: '分享' },
]

export const Default: Story = {
  render: () => (
    <Dropdown
      trigger={<Button>操作菜单 ▼</Button>}
      items={items}
      onSelect={(key) => console.log('select:', key)}
    />
  ),
}

export const Hover: Story = {
  render: () => (
    <Dropdown
      trigger={<Button variant="secondary">悬停触发 ▼</Button>}
      items={items}
      triggerType="hover"
      onSelect={(key) => console.log('select:', key)}
    />
  ),
}

export const TopPlacement: Story = {
  render: () => (
    <div style={{ paddingTop: '100px' }}>
      <Dropdown
        trigger={<Button>向上弹出 ▼</Button>}
        items={items}
        placement="top"
        onSelect={(key) => console.log('select:', key)}
      />
    </div>
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Dropdown, type DropdownProps, type DropdownItem } from './Dropdown'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Dropdown/
git commit -m "feat(Dropdown): 添加下拉菜单组件

- 支持 click 和 hover 触发方式
- 支持分隔线
- 支持禁用项
- 支持 top/bottom 弹出位置"
```

---

### 任务 15: Avatar 头像

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Avatar/Avatar.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Avatar/Avatar.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Avatar/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Avatar/Avatar.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Avatar.tsx**

```typescript
import React, { useState } from 'react'

export type AvatarSize = 'small' | 'default' | 'large' | number

export interface AvatarProps {
  /** 图片地址 */
  src?: string
  /** 头像文本（当无图片时显示） */
  text?: string
  /** 尺寸 */
  size?: AvatarSize
  /** 形状 */
  shape?: 'circle' | 'square'
  /** 图片无法加载时的回调 */
  onError?: () => void
  className?: string
  style?: React.CSSProperties
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  text,
  size = 'default',
  shape = 'circle',
  onError,
  className,
  style,
}) => {
  const [imgError, setImgError] = useState(false)

  const handleError = () => {
    setImgError(true)
    onError?.()
  }

  const sizeValue =
    typeof size === 'number' ? size : { small: 32, default: 40, large: 56 }[size]

  const initials = text
    ? text
        .trim()
        .split(/\s+/)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('')
    : ''

  return (
    <div
      className={`avatar avatar--${shape} ${className ?? ''}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        fontSize: sizeValue * 0.4,
        ...style,
      }}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={text ?? 'avatar'}
          className="avatar__img"
          onError={handleError}
        />
      ) : (
        <span className="avatar__fallback">{text ? initials : '?'}</span>
      )}
    </div>
  )
}

Avatar.displayName = 'Avatar'
```

- [ ] **Step 2: 创建 Avatar.module.css**

```css
/* ============================================
   Avatar Styles
   ============================================ */

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--ui-primary-light);
  font-weight: 600;
  font-family: var(--ui-font-family);
}

.avatar--circle {
  border-radius: 50%;
}

.avatar--square {
  border-radius: var(--ui-radius-base);
}

.avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar__fallback {
  color: white;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Avatar, type AvatarProps, type AvatarSize } from './Avatar'
```

- [ ] **Step 4: 创建 Avatar.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI1/Avatar 头像',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    text: '张',
  },
}

export const WithImage: Story = {
  render: () => (
    <Avatar
      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
      text="张"
    />
  ),
}

export const ImageError: Story = {
  render: () => (
    <Avatar
      src="https://invalid-url-example.com/broken.jpg"
      text="张"
    />
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar text="小" size="small" />
      <Avatar text="中" size="default" />
      <Avatar text="大" size="large" />
      <Avatar text="56" size={56} />
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Avatar text="圆" shape="circle" />
      <Avatar text="方" shape="square" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      {['张', '李', '王', '赵'].map((name, i) => (
        <Avatar
          key={name}
          text={name}
          size="default"
          style={{ marginLeft: i > 0 ? '-8px' : 0, border: '2px solid var(--ui-bg)' }}
        />
      ))}
    </div>
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Avatar, type AvatarProps, type AvatarSize } from './Avatar'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Avatar/
git commit -m "feat(Avatar): 添加头像组件

- 支持图片和文字两种形态
- 支持三种尺寸 (small/default/large) 和自定义数值
- 支持圆形和方形两种形状
- 图片加载失败时自动 fallback 到文字"
```

---

### 任务 16: Card 卡片

**Files:**
- Create: `c:/AAA/tool_ui/ui1/src/components/Card/Card.tsx`
- Create: `c:/AAA/tool_ui/ui1/src/components/Card/Card.module.css`
- Create: `c:/AAA/tool_ui/ui1/src/components/Card/index.ts`
- Create: `c:/AAA/tool_ui/ui1/src/components/Card/Card.stories.tsx`
- Modify: `c:/AAA/tool_ui/ui1/src/components/index.ts`

- [ ] **Step 1: 创建 Card.tsx**

```typescript
import React from 'react'

export interface CardProps {
  /** 标题 */
  header?: React.ReactNode
  /** 是否显示标题栏底部边框 */
  headerBorder?: boolean
  /** 阴影强度 */
  shadow?: 'none' | 'hover' | 'always'
  /** 卡片内容 */
  children?: React.ReactNode
  /** 额外操作区域 */
  extra?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
  header,
  headerBorder = true,
  shadow = 'hover',
  children,
  extra,
  className,
  style,
}) => {
  return (
    <div
      className={`card card--shadow-${shadow} ${className ?? ''}`}
      style={style}
    >
      {header && (
        <div className={`card__header ${headerBorder ? 'card__header--bordered' : ''}`}>
          <span className="card__title">{header}</span>
          {extra && <div className="card__extra">{extra}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  )
}

Card.displayName = 'Card'
```

- [ ] **Step 2: 创建 Card.module.css**

```css
/* ============================================
   Card Styles
   ============================================ */

.card {
  background-color: var(--ui-bg);
  border-radius: var(--ui-radius-large);
  border: 1px solid var(--ui-border-lighter);
  overflow: hidden;
  font-family: var(--ui-font-family);
}

.card--shadow-none {
  box-shadow: none;
}

.card--shadow-hover:hover {
  box-shadow: var(--ui-shadow-light);
}

.card--shadow-always {
  box-shadow: var(--ui-shadow-light);
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ui-spacing-lg) var(--ui-spacing-xl);
}

.card__header--bordered {
  border-bottom: 1px solid var(--ui-border-lighter);
}

.card__title {
  font-size: var(--ui-font-size-lg);
  font-weight: 600;
  color: var(--ui-text-primary);
}

.card__extra {
  display: flex;
  align-items: center;
  gap: var(--ui-spacing-sm);
  color: var(--ui-primary);
  font-size: var(--ui-font-size-sm);
}

.card__body {
  padding: var(--ui-spacing-xl);
  color: var(--ui-text-regular);
  font-size: var(--ui-font-size-base);
  line-height: 1.6;
}
```

- [ ] **Step 3: 创建 index.ts**

```typescript
export { Card, type CardProps } from './Card'
```

- [ ] **Step 4: 创建 Card.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Button } from '../Button/Button'

const meta: Meta<typeof Card> = {
  title: 'UI1/Card 卡片',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card header="卡片标题" style={{ maxWidth: '400px' }}>
      <p>卡片内容区域，可以包含任意内容。</p>
      <p style={{ marginTop: '12px' }}>这是第二段内容。</p>
    </Card>
  ),
}

export const WithExtra: Story = {
  render: () => (
    <Card
      header="卡片标题"
      extra={<Button size="small">操作</Button>}
      style={{ maxWidth: '400px' }}
    >
      <p>带有额外操作区域的卡片。</p>
    </Card>
  ),
}

export const NoHeader: Story = {
  render: () => (
    <Card style={{ maxWidth: '400px' }}>
      <p>没有标题的卡片内容。</p>
    </Card>
  ),
}

export const NoBorder: Story = {
  render: () => (
    <Card header="无底部边框" headerBorder={false} style={{ maxWidth: '400px' }}>
      <p>标题栏没有底部边框。</p>
    </Card>
  ),
}

export const ShadowVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card header="无阴影" shadow="none" style={{ width: '200px' }}>
        <p>无阴影卡片。</p>
      </Card>
      <Card header="悬停阴影" shadow="hover" style={{ width: '200px' }}>
        <p>鼠标悬停时显示阴影。</p>
      </Card>
      <Card header="常驻阴影" shadow="always" style={{ width: '200px' }}>
        <p>始终显示阴影。</p>
      </Card>
    </div>
  ),
}
```

- [ ] **Step 5: 更新 src/components/index.ts**

```typescript
// ... 保留已有导出，新增：
export { Card, type CardProps } from './Card'
```

- [ ] **Step 6: 启动 Storybook 验证**

```bash
npm run storybook
```

- [ ] **Step 7: 提交**

```bash
git add src/components/Card/
git commit -m "feat(Card): 添加卡片组件

- 支持标题和额外操作区域
- 支持三种阴影模式 (none/hover/always)
- 支持标题栏底部边框开关"
```

---

## 最终汇总提交

- [ ] **Step 1: 汇总提交阶段二所有组件**

```bash
git add -A
git commit -m "feat: 完成 Checkbox/Select/Switch/Textarea/Modal/Tooltip/Message/Tag/Table/Dropdown/Avatar/Card 组件

累计新增 12 个组件，全部完成 Storybook 文档"
```

---

## 自审清单

- [ ] **Spec 覆盖检查**：每个 3.2 待开发组件均有对应任务
- [ ] **占位符检查**：无 TBD、TODO、"类似 Task N" 等占位符
- [ ] **类型一致性检查**：所有 Props 类型、接口名称在任务间保持一致
- [ ] **CSS 变量一致性**：所有组件使用 `--ui-*` 前缀变量，与 SPEC.md 4.5 保持一致
- [ ] **Storybook 规范**：每个组件 stories 包含 Default、变体、状态等 story
- [ ] **文件路径检查**：所有路径使用 `c:/AAA/tool_ui/ui1/` 前缀
- [ ] **提交风格**：每任务一提交，消息遵循 `feat(componentName):` 前缀
