# UI1 Component Library
- A React 19 component library with Storybook documentation, built with TypeScript and Vite.

## 功能特点
- 基于 React 19 + TypeScript 构建，类型安全
- 使用 CSS Modules 实现样式隔离，避免样式冲突
- 集成 Storybook，支持组件文档与交互式预览
- 支持按需引入，每个组件独立打包
- 使用 ESLint 9 flat config 保证代码质量

## 安装与运行
```powershell
# 安装依赖
npm install

# 启动开发服务器（组件预览页面）
npm run dev

# 启动 Storybook（组件文档与交互式用例）
npm run storybook

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 技术栈
- React 19 — UI 框架
- TypeScript 5 — 类型系统
- Vite 6 — 构建工具与开发服务器
- Storybook 8 — 组件文档与交互式用例
- CSS Modules — 样式隔离
- ESLint 9 — 代码质量检查

## 项目结构
src/
├── components/                # 组件目录
│   ├── Avatar/               # 头像组件
│   │   ├── Avatar.tsx
│   │   ├── Avatar.module.css
│   │   ├── Avatar.stories.tsx
│   │   └── index.ts
│   ├── Card/                  # 卡片组件
│   │   ├── Card.tsx
│   │   ├── Card.module.css
│   │   ├── Card.stories.tsx
│   │   └── index.ts
│   ├── Checkbox/              # 复选框组件
│   │   ├── Checkbox.tsx
│   │   ├── CheckboxGroup.tsx
│   │   ├── Checkbox.module.css
│   │   ├── CheckboxGroup.module.css
│   │   ├── Checkbox.stories.tsx
│   │   └── index.ts
│   ├── Dropdown/              # 下拉菜单组件
│   │   ├── Dropdown.tsx
│   │   ├── DropdownItem.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── Dropdown.module.css
│   │   ├── Dropdown.stories.tsx
│   │   └── index.ts
│   ├── Message/               # 消息提示组件
│   │   ├── Message.tsx
│   │   ├── MessageManager.tsx
│   │   ├── messageApi.ts
│   │   ├── Message.module.css
│   │   ├── MessageManager.module.css
│   │   ├── Message.stories.tsx
│   │   └── index.ts
│   ├── Modal/                 # 模态框组件
│   │   ├── Modal.tsx
│   │   ├── Modal.module.css
│   │   ├── Modal.stories.tsx
│   │   └── index.ts
│   ├── Select/                # 选择器组件
│   │   ├── Select.tsx
│   │   ├── SelectOption.tsx
│   │   ├── Select.module.css
│   │   ├── Select.stories.tsx
│   │   └── index.ts
│   ├── Switch/                # 开关组件
│   │   ├── Switch.tsx
│   │   ├── Switch.module.css
│   │   ├── Switch.stories.tsx
│   │   └── index.ts
│   ├── Table/                 # 表格组件
│   │   ├── Table.tsx
│   │   ├── Table.module.css
│   │   ├── Table.stories.tsx
│   │   └── index.ts
│   ├── Tag/                   # 标签组件
│   │   ├── Tag.tsx
│   │   ├── Tag.module.css
│   │   ├── Tag.stories.tsx
│   │   └── index.ts
│   ├── Textarea/              # 文本域组件
│   │   ├── Textarea.tsx
│   │   ├── Textarea.module.css
│   │   ├── Textarea.stories.tsx
│   │   └── index.ts
│   └── Tooltip/               # 文字提示组件
│       ├── Tooltip.tsx
│       ├── Tooltip.module.css
│       ├── Tooltip.stories.tsx
│       └── index.ts
├── stories/                   # Storybook 基础示例（Storybook 内置模板）
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── Page.tsx
│   ├── button.css
│   ├── header.css
│   └── page.css
├── styles/                    # 全局样式
│   └── global.css
├── App.tsx                    # 应用入口组件
├── main.tsx                   # React 渲染入口
└── vite-env.d.ts              # Vite 类型声明
.storybook/
├── main.ts                    # Storybook 配置文件
└── preview.tsx                # Storybook 预览配置
public/                        # 静态资源目录
index.html                     # HTML 入口文件
vite.config.ts                 # Vite 构建配置
eslint.config.js               # ESLint 代码检查配置
tsconfig.json                  # TypeScript 主配置
tsconfig.node.json             # TypeScript 节点配置（用于 vite.config.ts）

## 优化建议
### 代码结构封装归类优化
- p0 - 部分组件（如 Table、Textarea）内部仍使用 `any` 类型，建议替换为具体类型定义，提升类型安全性
- p1 - Textarea 组件存在 exhaustive-deps 警告，建议将 autosizeOption 和 internalValue 依赖问题纳入优化范围
### 用户体验优化
- p1 - Tooltip 组件存在 ref 访问警告，cloneElement 传 ref 方式可考虑迁移至 React.forwardRef 封装
- p1 - 部分组件样式建议统一主题变量，便于后期主题切换
