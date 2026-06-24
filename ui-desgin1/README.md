# U1Design Vue 组件库

U1Design 是一个基于 Vue 3 的轻量组件库项目, 包含组件源码, 单元测试, 构建配置和 VitePress 文档站.

## 功能特点

- 提供 `@u1design/vue` 组件包, 支持全量安装和组件按需导入.
- 当前组件包含 Button, Input, Radio, Checkbox, Select, Switch, Avatar, Tag, Message, Dialog, Table, Card, Menu.
- 组件样式统一使用 `u1-` 前缀, 便于在业务项目中识别和覆盖.
- 文档站提供组件总览, 示例演示和 API 表.
- 单元测试覆盖组件渲染, 状态, 事件和关键交互.

## 安装与运行

```powershell
pnpm install
```

```powershell
pnpm dev
```

本地文档站默认由 VitePress 启动, 地址通常是 `http://127.0.0.1:5173/`.

```powershell
pnpm test
pnpm typecheck
pnpm build
```

`pnpm build` 会先构建 `@u1design/vue`, 再构建文档站.

## 技术栈

- Vue 3 - 组件运行框架.
- TypeScript - 组件和配置类型约束.
- Vite - 组件库构建工具.
- VitePress - 文档站生成工具.
- Vitest - 单元测试运行器.
- Vue Test Utils - Vue 组件测试工具.
- pnpm workspace - 管理组件包和文档包.

## 项目结构

- `packages/components` - `@u1design/vue` 组件库源码, 样式, 测试和构建配置.
- `packages/components/src/index.ts` - 组件统一导出和 Vue 插件安装入口.
- `packages/components/src/styles/index.css` - U1Design 设计变量和组件样式.
- `docs` - VitePress 文档站源码.
- `docs/component` - 各组件文档页面.
- `docs/.vitepress` - 文档站配置和主题样式.
- `docs/superpowers` - 产品化规格和实现计划.
- `vitest.config.ts` - 组件测试配置.
- `pnpm-workspace.yaml` - workspace 包发现配置.

## 优化建议

### 代码结构封装归类优化

- p0-补充组件类型导出-让业务项目可以直接复用表格列配置, 菜单项和表单值类型.
- p0-拆分共享类型目录-减少组件内部重复定义, 提高后续新增组件的一致性.
- p1-增加按需样式入口-为只使用少数组件的项目降低样式体积.

### 用户体验优化

- p0-补齐所有组件文档交互示例-让 Input, Select, Dialog, Menu, Table 等组件都能展示真实状态变化.
- p1-增加移动端文档验收-持续检查小屏下 demo 行, API 表和侧栏导航是否溢出.
- p1-增加暗色模式视觉检查-确保组件边框, 文本和禁用状态在暗色主题下仍然清晰.
