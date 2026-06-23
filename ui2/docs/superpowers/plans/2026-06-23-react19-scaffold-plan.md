# React 19 + Vite 脚手架项目实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `C:\AAA\tool_ui\ui2` 目录下创建一套生产级 React 19 + Vite + TypeScript + SCSS + React Router + Jotai 的项目脚手架。

**Architecture:** 使用 Vite 作为构建工具，React 19 为框架，通过 React Router 管理路由，Jotai 进行原子化状态管理，SCSS 处理样式。项目结构遵循 `src/assets`、`src/components`、`src/pages`、`src/routes`、`src/store`、`src/styles` 的标准分层。

**Tech Stack:** React 19 + Vite + TypeScript + SCSS + React Router v7 + Jotai

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `package.json` | 创建/覆盖 | 项目依赖配置 |
| `vite.config.ts` | 创建 | Vite 构建配置 |
| `tsconfig.json` | 创建 | TypeScript 配置 |
| `tsconfig.app.json` | 创建 | React TypeScript 配置 |
| `tsconfig.node.json` | 创建 | Node 环境 TypeScript 配置 |
| `index.html` | 创建 | 入口 HTML |
| `.eslintrc.cjs` | 创建 | ESLint 配置 |
| `src/main.tsx` | 创建 | React 入口 |
| `src/App.tsx` | 创建 | 根组件 |
| `src/router.tsx` | 创建 | React Router 配置 |
| `src/styles/_variables.scss` | 创建 | SCSS 变量 |
| `src/styles/_reset.scss` | 创建 | CSS Reset |
| `src/styles/main.scss` | 创建 | 全局样式入口 |
| `src/assets/` | 创建 | 静态资源目录 |
| `src/components/Layout/index.tsx` | 创建 | 布局组件 |
| `src/components/Layout/index.scss` | 创建 | 布局样式 |
| `src/pages/Home/index.tsx` | 创建 | 首页 |
| `src/pages/Home/index.scss` | 创建 | 首页样式 |
| `src/pages/About/index.tsx` | 创建 | 关于页 |
| `src/pages/About/index.scss` | 创建 | 关于页样式 |
| `src/store/index.ts` | 创建 | Jotai store |
| `src/vite-env.d.ts` | 创建 | Vite 类型声明 |

---

## Task 1: 初始化项目基础文件

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `.eslintrc.cjs`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "ui2",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "jotai": "^2.10.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "globals": "^15.0.0",
    "sass": "^1.80.0",
    "typescript": "~5.6.0",
    "typescript-eslint": "^8.0.0",
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
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 4: 创建 tsconfig.app.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: 创建 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ui2</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 创建 .eslintrc.cjs**

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
}
```

- [ ] **Step 8: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

---

## Task 2: 创建入口文件和路由配置

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/router.tsx`

- [ ] **Step 1: 创建 src/main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './styles/main.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 2: 创建 src/App.tsx**

```typescript
function App() {
  return <></>
}

export default App
```

- [ ] **Step 3: 创建 src/router.tsx**

```typescript
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/Home'),
      },
      {
        path: 'about',
        lazy: () => import('./pages/About'),
      },
    ],
  },
])

export { router }
```

---

## Task 3: 配置 SCSS 样式

**Files:**
- Create: `src/styles/_variables.scss`
- Create: `src/styles/_reset.scss`
- Create: `src/styles/main.scss`

- [ ] **Step 1: 创建 src/styles/_variables.scss**

```scss
// Color palette
$color-primary: #1677ff;
$color-success: #52c41a;
$color-warning: #faad14;
$color-error: #ff4d4f;
$color-text-primary: #262626;
$color-text-secondary: #8c8c8c;
$color-bg-base: #ffffff;
$color-bg-layout: #f5f5f5;
$color-border: #d9d9d9;

// Typography
$font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-heading: 24px;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Border radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;

// Transitions
$transition-fast: 0.15s ease;
$transition-normal: 0.25s ease;
```

- [ ] **Step 2: 创建 src/styles/_reset.scss**

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: $font-family;
  font-size: $font-size-base;
  color: $color-text-primary;
  background-color: $color-bg-base;
  line-height: 1.5;
}

a {
  color: $color-primary;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: darken($color-primary, 10%);
  }
}

button {
  font-family: inherit;
  cursor: pointer;
}

img,
svg {
  display: block;
  max-width: 100%;
}
```

- [ ] **Step 3: 创建 src/styles/main.scss**

```scss
@import 'variables';
@import 'reset';

#root {
  min-height: 100vh;
}
```

---

## Task 4: 创建 Layout 组件

**Files:**
- Create: `src/components/Layout/index.tsx`
- Create: `src/components/Layout/index.scss`

- [ ] **Step 1: 创建 src/components/Layout/index.tsx**

```tsx
import { Outlet, Link } from 'react-router-dom'
import './index.scss'

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <nav className="layout-nav">
          <Link to="/" className="nav-logo">ui2</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">首页</Link>
            <Link to="/about" className="nav-link">关于</Link>
          </div>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>&copy; {new Date().getFullYear()} ui2. Built with React 19.</p>
      </footer>
    </div>
  )
}

export default Layout
```

- [ ] **Step 2: 创建 src/components/Layout/index.scss**

```scss
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-header {
  background: $color-bg-base;
  border-bottom: 1px solid $color-border;
  padding: 0 $spacing-lg;
  height: 60px;
  display: flex;
  align-items: center;
}

.layout-nav {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-logo {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $color-primary;
}

.nav-links {
  display: flex;
  gap: $spacing-md;
  margin-left: $spacing-xl;
}

.nav-link {
  color: $color-text-primary;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  transition: background $transition-fast, color $transition-fast;

  &:hover {
    background: $color-bg-layout;
    color: $color-primary;
  }
}

.layout-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: $spacing-xl $spacing-lg;
}

.layout-footer {
  background: $color-bg-layout;
  border-top: 1px solid $color-border;
  padding: $spacing-lg;
  text-align: center;
  color: $color-text-secondary;
  font-size: $font-size-sm;
}
```

---

## Task 5: 创建 Home 和 About 页面

**Files:**
- Create: `src/pages/Home/index.tsx`
- Create: `src/pages/Home/index.scss`
- Create: `src/pages/About/index.tsx`
- Create: `src/pages/About/index.scss`

- [ ] **Step 1: 创建 src/pages/Home/index.tsx**

```tsx
import './index.scss'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">欢迎使用 ui2</h1>
        <p className="hero-desc">
          基于 React 19 + Vite + TypeScript + SCSS + React Router + Jotai 构建的现代 Web 应用。
        </p>
        <div className="hero-tags">
          <span className="tag">React 19</span>
          <span className="tag">Vite</span>
          <span className="tag">TypeScript</span>
          <span className="tag">SCSS</span>
          <span className="tag">React Router</span>
          <span className="tag">Jotai</span>
        </div>
      </section>
    </div>
  )
}

export default Home
```

- [ ] **Step 2: 创建 src/pages/Home/index.scss**

```scss
.home {
  padding: $spacing-xl 0;
}

.hero {
  text-align: center;
  padding: $spacing-xl * 2 0;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: $color-text-primary;
  margin-bottom: $spacing-md;
}

.hero-desc {
  font-size: $font-size-lg;
  color: $color-text-secondary;
  max-width: 600px;
  margin: 0 auto $spacing-xl;
  line-height: 1.8;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  justify-content: center;
}

.tag {
  display: inline-block;
  padding: $spacing-xs $spacing-md;
  background: $color-bg-layout;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
```

- [ ] **Step 3: 创建 src/pages/About/index.tsx**

```tsx
import './index.scss'

function About() {
  return (
    <div className="about">
      <h1 className="about-title">关于 ui2</h1>
      <p className="about-desc">
        这是一个使用现代前端技术栈构建的 React 19 Web 应用脚手架。
      </p>
      <ul className="about-list">
        <li>React 19 — 最新稳定版框架</li>
        <li>Vite — 极速开发服务器和构建工具</li>
        <li>TypeScript — 类型安全</li>
        <li>SCSS — 强大灵活的样式解决方案</li>
        <li>React Router v7 — 客户端路由</li>
        <li>Jotai — 原子化状态管理</li>
      </ul>
    </div>
  )
}

export default About
```

- [ ] **Step 4: 创建 src/pages/About/index.scss**

```scss
.about {
  max-width: 640px;
  margin: 0 auto;
  padding: $spacing-xl 0;
}

.about-title {
  font-size: $font-size-heading;
  font-weight: 700;
  margin-bottom: $spacing-lg;
}

.about-desc {
  font-size: $font-size-lg;
  color: $color-text-secondary;
  margin-bottom: $spacing-xl;
  line-height: 1.8;
}

.about-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  li {
    padding: $spacing-sm $spacing-md;
    background: $color-bg-layout;
    border-radius: $radius-sm;
    font-size: $font-size-base;
    color: $color-text-primary;
    border-left: 3px solid $color-primary;
  }
}
```

---

## Task 6: 创建 Jotai Store

**Files:**
- Create: `src/store/index.ts`

- [ ] **Step 1: 创建 src/store/index.ts**

```typescript
import { atom } from 'jotai'

const countAtom = atom(0)

const doubleCountAtom = atom((get) => get(countAtom) * 2)

export { countAtom, doubleCountAtom }
```

---

## Task 7: 安装依赖并验证

**Files:**
- Modify: `C:\AAA\tool_ui\ui2\.gitignore`

- [ ] **Step 1: 安装 npm 依赖**

在 `C:\AAA\tool_ui\ui2` 目录下运行：
```
npm install
```

- [ ] **Step 2: 检查 .gitignore**

确保 `.gitignore` 包含以下内容（如果缺失则追加）：
```
node_modules/
dist/
```

- [ ] **Step 3: 验证项目可以启动**

运行：
```
npm run dev
```
预期：终端显示 `Local: http://localhost:5173/` 且浏览器可正常访问。

- [ ] **Step 4: 验证构建正常**

运行：
```
npm run build
```
预期：构建成功，生成 `dist/` 目录，无报错。
