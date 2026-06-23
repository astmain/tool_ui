# React 19 + Vite 脚手架项目设计

## 1. 概述

- **项目名称**：ui2
- **类型**：Web 应用
- **目标**：在 `C:\AAA\tool_ui\ui2` 目录下创建一个生产级别的 React 19 项目脚手架
- **技术栈**：React 19 + Vite + TypeScript + SCSS + React Router + Jotai

## 2. 技术选型

| 类别 | 选型 | 理由 |
|------|------|------|
| 框架 | React 19 | 最新稳定版，支持新 Hook |
| 构建工具 | Vite | 极速 HMR，配置简洁 |
| 语言 | TypeScript | 类型安全，开发体验好 |
| 样式 | SCSS | 原生 CSS 扩展，支持变量/混入 |
| 路由 | React Router v7 | 嵌套路由，标准方案 |
| 状态管理 | Jotai | 原子化状态，轻量简洁 |
| 代码规范 | ESLint + Prettier | 统一代码风格 |

## 3. 初始化方案

使用 `npm create vite@latest` + 手动安装依赖：
```
npm create vite@latest . -- --template react-ts
npm install react-router-dom jotai
npm install -D sass
```

## 4. 项目结构

```
src/
  assets/          # 静态资源（图片、字体等）
  components/     # 公共组件
    Layout/       # 布局组件（Header, Footer, Sidebar）
  pages/          # 页面组件
    Home/         # 首页
  routes/         # 路由配置
    index.tsx     # 路由定义
  store/          # Jotai 原子状态
  styles/         # 全局 SCSS 样式
    _variables.scss   # SCSS 变量（颜色、字体、间距）
    _reset.scss       # CSS Reset
    main.scss          # 全局入口样式
  App.tsx         # 根组件
  main.tsx        # 入口文件
  router.tsx      # 路由配置
```

## 5. 配置文件

- `vite.config.ts` — Vite 配置，保持默认
- `tsconfig.json` — TypeScript 配置，保持默认
- `.eslintrc.cjs` — ESLint 配置
- `.prettierrc.json` — Prettier 配置（复用已有的根目录配置）
- `.npmrc` — npm 配置（已存在，保持不变）

## 6. 页面规划

### 6.1 Home 页面
- 默认展示的首页
- 包含基础欢迎文本和布局

### 6.2 About 页面
- 展示项目信息

## 7. 实施步骤

1. 执行 `npm create vite` 初始化项目
2. 安装依赖：`react-router-dom`, `jotai`, `sass`
3. 清理 Vite 默认模板文件
4. 配置 React Router
5. 配置 Jotai store
6. 配置全局 SCSS 样式
7. 创建 Layout 组件
8. 创建首页和关于页
9. 验证项目可运行
