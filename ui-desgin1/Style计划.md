# U1ThemeEditor Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task by task. Steps use checkbox syntax for tracking.

**Goal:** Build a temporary theme editor for U1Design that previews CSS variable changes in the current page and generates copyable JS code for user projects.

**Architecture:** The public theme API lives in `packages/components/src/theme`. The editor UI uses that API for preview and code generation. `U1ThemeEditorDialog` only wraps `U1ThemeEditor` with the existing Dialog component.

**Tech Stack:** Vue 3, TypeScript, Vite library mode, VitePress docs, Vitest, Vue Test Utils, jsdom.

**Status:** ✅ All tasks completed. Implementation matches this plan.

---

## 核心需求

- [x] 新增 `U1ThemeEditorDialog`.
- [x] 弹窗内可以编辑 U1Design 全局 CSS 变量.
- [x] 修改变量后当前页面马上预览生效.
- [x] 刷新浏览器后预览效果消失并回到默认样式.
- [x] 弹窗内必须显示一个 JS 多行文本框.
- [x] 多行文本框展示当前变量生成的完整 JS 代码.
- [x] 用户手动复制 JS 代码.
- [x] 用户自己粘贴到项目入口或主题文件中.
- [x] 用户项目运行这段 JS 后才长期生效.

## 明确不做

- [x] 不保存文件.
- [x] 不下载文件.
- [x] 不生成 CSS 文件.
- [x] 不生成 `style1.css`.
- [x] 不生成 `style2.css`.
- [x] 不接后端接口.
- [x] 不做主题管理.
- [x] 不做账号同步.
- [x] 不保存到浏览器.
- [x] 不写入 `localStorage`.
- [x] 不写入 `sessionStorage`.
- [x] 不写入 Cookie.

## 交互流程

1. [x] 打开主题编辑器 Dialog.
2. [x] 修改颜色, 圆角, 阴影等变量.
3. [x] 当前页面组件立即变化.
4. [x] JS 多行文本框同步变化.
5. [x] 用户复制 JS 代码.
6. [x] 用户粘贴到自己的项目代码中.
7. [x] 用户项目启动时执行这段 JS.
8. [x] 用户刷新当前演示页面后回到默认样式.

## 第一版范围

第一版只做全局通用变量.

不要一开始开放太多组件细节.

| 字段 | CSS 变量 | 默认值 | 类型 |
| --- | --- | --- | --- |
| `primary` | `--u1-color-primary` | `#409eff` | color |
| `success` | `--u1-color-success` | `#67c23a` | color |
| `warning` | `--u1-color-warning` | `#e6a23c` | color |
| `danger` | `--u1-color-danger` | `#f56c6c` | color |
| `info` | `--u1-color-info` | `#909399` | color |
| `text` | `--u1-color-text` | `#303133` | color |
| `textRegular` | `--u1-color-text-regular` | `#606266` | color |
| `border` | `--u1-color-border` | `#dcdfe6` | color |
| `borderLight` | `--u1-color-border-light` | `#e4e7ed` | color |
| `background` | `--u1-color-bg` | `#ffffff` | color |
| `radiusBase` | `--u1-radius-base` | `4px` | size |
| `shadowLight` | `--u1-shadow-light` | `0 4px 12px rgb(31 45 61 / 8%)` | shadow |
| `shadowFocus` | `--u1-shadow-focus` | `0 0 0 3px rgb(64 158 255 / 18%)` | shadow |

## 主题 API

新增主题工具函数 `applyU1Theme`.

```ts
applyU1Theme({
  primary: '#1677ff',
  success: '#52c41a',
  radiusBase: '8px'
})
```

工具函数内部写入页面根节点.

```ts
document.documentElement.style.setProperty('--u1-color-primary', '#1677ff')
```

编辑器实时预览也必须使用同一个工具函数.

`applyU1Theme` 支持无 `document` 环境.

SSR 或构建阶段调用时直接返回.

```ts
if (typeof document === 'undefined') {
  return
}
```

这只是当前页面状态.

刷新后不会保留.

## 重置规则

必须新增 `resetU1Theme`.

`resetU1Theme` 只清理第一版主题变量在 `document.documentElement.style` 上的内联值.

不要删除用户页面上的其他内联样式.

```ts
document.documentElement.style.removeProperty('--u1-color-primary')
```

编辑器点击重置时同步做三件事.

1. [x] 表单值恢复 `u1ThemeTokens` 默认值.
2. [x] 页面预览恢复默认 CSS 变量.
3. [x] JS 多行文本框恢复默认变量代码.

## 用户项目用法

组件基础样式仍然需要引入.

JS 只负责主题变量.

```ts
import '@u1design/vue/style.css'
import { applyU1Theme } from '@u1design/vue/theme'

applyU1Theme({
  primary: '#1677ff',
  success: '#52c41a',
  radiusBase: '8px'
})
```

建议在 `main.ts` 中尽早执行 `applyU1Theme`.

## JS 文本格式

多行文本框标题叫 `主题代码`.

多行文本框展示完整 JS.

生成 JS 文本的逻辑单独放到 `createU1ThemeCode`.

主题编辑器不直接拼字符串.

第一版生成完整变量代码.

不要只生成修改过的变量.

空值不生成到主题代码.

```ts
import { applyU1Theme } from '@u1design/vue/theme'

applyU1Theme({
  primary: '#1677ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#ff4d4f',
  info: '#1677ff',
  text: '#1f2937',
  textRegular: '#4b5563',
  border: '#d1d5db',
  borderLight: '#e5e7eb',
  background: '#ffffff',
  radiusBase: '8px',
  shadowLight: '0 6px 18px rgb(15 23 42 / 10%)',
  shadowFocus: '0 0 0 3px rgb(22 119 255 / 20%)'
})
```

用户复制后可以直接放到自己的项目里.

## 变量校验

第一版只做轻量校验.

- [x] 颜色值不能为空.
- [x] 尺寸值不能为空.
- [x] 阴影值不能为空.
- [x] 空值不写入页面.
- [x] 空值不生成到主题代码.
- [x] 不做复杂 CSS 解析.
- [x] 不阻止用户输入合法 CSS 颜色函数, 例如 `rgb(...)` 和 `oklch(...)`.

## 组件边界

`U1ThemeEditor` 负责主题编辑, 预览生效, 主题代码生成和复制.

`U1ThemeEditorDialog` 只负责弹窗包装.

`U1ThemeEditorDialog` 不写主题逻辑.

主题逻辑只放在这些位置.

- `applyU1Theme`.
- `resetU1Theme`.
- `createU1ThemeCode`.
- `u1ThemeTokens`.
- `U1ThemeEditor`.

## 文件职责

| 文件 | 动作 | 状态 | 职责 |
| --- | --- | --- | --- |
| `packages/components/src/theme/tokens.ts` | Create | ✅ | 定义第一版 token 列表, 默认值, 字段类型, CSS 变量映射. |
| `packages/components/src/theme/applyTheme.ts` | Create | ✅ | 实现 `applyU1Theme` 和 `resetU1Theme`. |
| `packages/components/src/theme/createThemeCode.ts` | Create | ✅ | 实现 `createU1ThemeCode`. |
| `packages/components/src/theme/index.ts` | Create | ✅ | 导出主题 API. |
| `packages/components/src/theme-editor/ThemeEditor.vue` | Create | ✅ | 表单编辑, 实时预览, 复制主题代码, 重置默认变量. |
| `packages/components/src/theme-editor/ThemeEditorDialog.vue` | Create | ✅ | 只包装 Dialog 的打开关闭状态和内容插槽. |
| `packages/components/src/theme-editor/index.ts` | Create | ✅ | 导出编辑器组件. |
| `packages/components/src/index.ts` | Modify | ✅ | 导出 `U1ThemeEditor` 和 `U1ThemeEditorDialog`. |
| `packages/components/package.json` | Modify | ✅ | 增加 `./theme` 和必要的编辑器导出信息. |
| `packages/components/vite.config.ts` | Modify | ✅ | 改成多入口构建, 确保生成 `dist/theme/index.js`. |
| `packages/components/src/__tests__/theme.test.ts` | Create | ✅ | 覆盖主题 API. |
| `packages/components/src/__tests__/theme-editor.test.ts` | Create | ✅ | 覆盖编辑器和 Dialog 边界. |
| `docs/component/design/theme-editor.md` | Create | ⚠️ | 文档存在但 API 字段名错误, 需修正. |
| `docs/.vitepress/config.ts` | Modify | ✅ | 在设计分组增加主题编辑器入口. |

## 包导出

需要新增 `@u1design/vue/theme` 子入口.

用户要能这样引入.

```ts
import { applyU1Theme } from '@u1design/vue/theme'
```

当前 `packages/components/vite.config.ts` 已配置多入口.

目标结构如下.

```ts
lib: {
  entry: {
    index: resolve(__dirname, 'src/index.ts'),
    theme: resolve(__dirname, 'src/theme/index.ts')
  },
  name: 'U1Design',
  fileName: (format, entryName) => entryName === 'index' ? 'u1design.js' : `${entryName}/index.js`,
  cssFileName: 'style'
}
```

`package.json` 已有 exports.

```json
{
  "./theme": {
    "types": "./dist/theme/index.d.ts",
    "import": "./dist/theme/index.js"
  }
}
```

构建完成后确认这些文件存在.

- `packages/components/dist/theme/index.js`.
- `packages/components/dist/theme/index.d.ts`.
- `packages/components/dist/style.css`.

## UI 要求

编辑器不是营销页.

它是组件库里的工具面板.

布局要求如下.

- [x] 表单区域和代码区域用清晰分栏.
- [x] 小屏幕下纵向排列.
- [x] 控件使用稳定尺寸.
- [x] 颜色输入要有色块预览.
- [x] 文本输入必须有可见 label.
- [x] 复制按钮要有成功反馈.
- [x] 重置按钮不能和复制按钮混淆.
- [x] textarea 使用等宽字体.
- [x] textarea 只读.
- [x] Dialog 关闭后不自动保存任何状态.

## 实施任务

### Task 1: 主题 token 和 API

**Files:**

- Create: `packages/components/src/theme/tokens.ts`.
- Create: `packages/components/src/theme/applyTheme.ts`.
- Create: `packages/components/src/theme/createThemeCode.ts`.
- Create: `packages/components/src/theme/index.ts`.
- Create: `packages/components/src/__tests__/theme.test.ts`.

- [x] Step 1: 写 `theme.test.ts`, 覆盖 token 映射, DOM 写入, 空值过滤, reset 清理, 无 `document` 返回.
- [x] Step 2: 运行 `pnpm test packages/components/src/__tests__/theme.test.ts`, 预期先失败.
- [x] Step 3: 实现 `u1ThemeTokens`, `applyU1Theme`, `resetU1Theme`, `createU1ThemeCode`.
- [x] Step 4: 再运行 `pnpm test packages/components/src/__tests__/theme.test.ts`, 预期通过.

### Task 2: 主题编辑器组件

**Files:**

- Create: `packages/components/src/theme-editor/ThemeEditor.vue`.
- Create: `packages/components/src/theme-editor/ThemeEditorDialog.vue`.
- Create: `packages/components/src/theme-editor/index.ts`.
- Modify: `packages/components/src/index.ts`.
- Create: `packages/components/src/__tests__/theme-editor.test.ts`.

- [x] Step 1: 写 `theme-editor.test.ts`, 覆盖修改变量后调用预览, 代码同步, 复制反馈, 重置默认值.
- [x] Step 2: 写 Dialog 边界测试, 断言 `U1ThemeEditorDialog` 不直接调用 `document.documentElement.style.setProperty`.
- [x] Step 3: 运行 `pnpm test packages/components/src/__tests__/theme-editor.test.ts`, 预期先失败.
- [x] Step 4: 实现 `U1ThemeEditor`.
- [x] Step 5: 实现 `U1ThemeEditorDialog`.
- [x] Step 6: 再运行 `pnpm test packages/components/src/__tests__/theme-editor.test.ts`, 预期通过.

### Task 3: 构建入口和包导出

**Files:**

- Modify: `packages/components/vite.config.ts`.
- Modify: `packages/components/package.json`.

- [x] Step 1: 修改 Vite lib entry 为多入口.
- [x] Step 2: 修改 `package.json` exports, 增加 `./theme`.
- [x] Step 3: 运行 `pnpm --filter @u1design/vue build`.
- [x] Step 4: 确认 `dist/theme/index.js` 和 `dist/theme/index.d.ts` 存在.

### Task 4: 文档和演示

**Files:**

- Create: `docs/component/design/theme-editor.md`.
- Modify: `docs/.vitepress/config.ts`.

- [x] Step 1: 增加文档页, 展示 `U1ThemeEditorDialog` 打开入口.
- [x] Step 2: 增加用户项目代码示例.
- [x] Step 3: 在 VitePress sidebar 的设计分组加入 `主题编辑器`.
- [x] Step 4: 运行 `pnpm --filter docs dev`, 在浏览器检查文档页.

⚠️ 文档存在已知问题: 代码示例中的 API 字段名使用了旧名称 (如 `primaryColor`), 实际 API 使用短横线风格 (如 `primary`), 需要修正.

## 测试要求

- [x] `applyU1Theme` 能写入 `document.documentElement`.
- [x] `applyU1Theme` 在无 `document` 时不报错.
- [x] `applyU1Theme` 不写入空值.
- [x] `resetU1Theme` 只清理主题变量.
- [x] `createU1ThemeCode` 能生成完整 JS 代码.
- [x] `createU1ThemeCode` 不生成空值字段.
- [x] `U1ThemeEditor` 修改变量后调用 `applyU1Theme`.
- [x] `U1ThemeEditor` 修改变量后同步更新主题代码.
- [x] `U1ThemeEditor` 点击重置后恢复默认 token.
- [x] `U1ThemeEditorDialog` 只负责显示和关闭弹窗.
- [x] `U1ThemeEditorDialog` 不包含主题变量写入逻辑.

## 验证命令

实现完成后按顺序运行.

```powershell
pnpm test
pnpm typecheck
pnpm build
```

浏览器验证需要启动文档站.

```powershell
pnpm --filter docs dev
```

验证页面.

- `/component/design/theme-editor`.
- 桌面宽度.
- 375px 移动宽度.

## 验收标准

- [x] 可以打开主题编辑器 Dialog.
- [x] 修改变量后页面马上变化.
- [x] 刷新页面后回到默认样式.
- [x] JS 多行文本框同步展示完整代码.
- [x] 可以复制完整 JS 代码.
- [x] 复制的代码可以在用户项目中调用 `applyU1Theme`.
- [x] 可以重置默认变量.
- [x] `@u1design/vue/theme` 可以正常导入.
- [x] `@u1design/vue/style.css` 仍然正常导入.
- [x] 不产生任何文件.
- [x] 不需要后端接口.
- [x] 不写入浏览器存储.

## 后续扩展

后续扩展顺序如下.

1. 全局颜色和基础外观.
2. 尺寸和字号.
3. 组件专属变量.
4. 暗色模式和动画.

### 尺寸

- `inputHeight`.
- `tableCellPadding`.

### 字号

- `fontSize`.
- `fontSizeSmall`.
- `fontSizeLarge`.

### 间距

- `paddingSmall`.
- `paddingBase`.
- `paddingLarge`.
- `gapBase`.

### 组件专属

- `buttonRadius`.
- `buttonHeight`.
- `cardPadding`.
- `dialogRadius`.
- `tableHeaderBg`.

### 暗色模式

- `darkBackground`.
- `darkText`.
- `darkBorder`.

### 动画

- `transitionDuration`.
- `transitionTiming`.

## 扩展规则

JS 方案不是直接修改组件属性.

JS 方案通过 CSS 变量控制样式.

`applyU1Theme` 要作为正式 API 暴露.

不要只写在主题编辑器内部.

`createU1ThemeCode` 也要作为工具函数保留.

想支持新的可调项时, 组件 CSS 中必须先有对应变量.

例如按钮高度要先改成变量.

```css
.u1-button {
  height: var(--u1-button-height);
}
```

然后 JS 才能控制.

## 核心需求

- 新增 `U1ThemeEditorDialog`.
- 弹窗内可以编辑 U1Design 全局 CSS 变量.
- 修改变量后当前页面马上预览生效.
- 刷新浏览器后预览效果消失并回到默认样式.
- 弹窗内必须显示一个 JS 多行文本框.
- 多行文本框展示当前变量生成的完整 JS 代码.
- 用户手动复制 JS 代码.
- 用户自己粘贴到项目入口或主题文件中.
- 用户项目运行这段 JS 后才长期生效.

## 明确不做

- 不保存文件.
- 不下载文件.
- 不生成 CSS 文件.
- 不生成 `style1.css`.
- 不生成 `style2.css`.
- 不接后端接口.
- 不做主题管理.
- 不做账号同步.
- 不保存到浏览器.
- 不写入 `localStorage`.
- 不写入 `sessionStorage`.
- 不写入 Cookie.

## 交互流程

1. 打开主题编辑器 Dialog.
2. 修改颜色, 圆角, 阴影等变量.
3. 当前页面组件立即变化.
4. JS 多行文本框同步变化.
5. 用户复制 JS 代码.
6. 用户粘贴到自己的项目代码中.
7. 用户项目启动时执行这段 JS.
8. 用户刷新当前演示页面后回到默认样式.

## 第一版范围

第一版只做全局通用变量.

不要一开始开放太多组件细节.

| 字段 | CSS 变量 | 默认值 | 类型 |
| --- | --- | --- | --- |
| `primary` | `--u1-color-primary` | `#409eff` | color |
| `success` | `--u1-color-success` | `#67c23a` | color |
| `warning` | `--u1-color-warning` | `#e6a23c` | color |
| `danger` | `--u1-color-danger` | `#f56c6c` | color |
| `info` | `--u1-color-info` | `#909399` | color |
| `text` | `--u1-color-text` | `#303133` | color |
| `textRegular` | `--u1-color-text-regular` | `#606266` | color |
| `border` | `--u1-color-border` | `#dcdfe6` | color |
| `borderLight` | `--u1-color-border-light` | `#e4e7ed` | color |
| `background` | `--u1-color-bg` | `#ffffff` | color |
| `radiusBase` | `--u1-radius-base` | `4px` | size |
| `shadowLight` | `--u1-shadow-light` | `0 4px 12px rgb(31 45 61 / 8%)` | shadow |
| `shadowFocus` | `--u1-shadow-focus` | `0 0 0 3px rgb(64 158 255 / 18%)` | shadow |

## 主题 API

新增主题工具函数 `applyU1Theme`.

```ts
applyU1Theme({
  primary: '#1677ff',
  success: '#52c41a',
  radiusBase: '8px'
})
```

工具函数内部写入页面根节点.

```ts
document.documentElement.style.setProperty('--u1-color-primary', '#1677ff')
```

编辑器实时预览也必须使用同一个工具函数.

`applyU1Theme` 要支持无 `document` 环境.

SSR 或构建阶段调用时直接返回.

```ts
if (typeof document === 'undefined') {
  return
}
```

这只是当前页面状态.

刷新后不会保留.

## 重置规则

必须新增 `resetU1Theme`.

`resetU1Theme` 只清理第一版主题变量在 `document.documentElement.style` 上的内联值.

不要删除用户页面上的其他内联样式.

```ts
document.documentElement.style.removeProperty('--u1-color-primary')
```

编辑器点击重置时同步做三件事.

1. 表单值恢复 `u1ThemeTokens` 默认值.
2. 页面预览恢复默认 CSS 变量.
3. JS 多行文本框恢复默认变量代码.

## 用户项目用法

组件基础样式仍然需要引入.

JS 只负责主题变量.

```ts
import '@u1design/vue/style.css'
import { applyU1Theme } from '@u1design/vue/theme'

applyU1Theme({
  primary: '#1677ff',
  success: '#52c41a',
  radiusBase: '8px'
})
```

建议在 `main.ts` 中尽早执行 `applyU1Theme`.

## JS 文本格式

多行文本框标题叫 `主题代码`.

多行文本框展示完整 JS.

生成 JS 文本的逻辑单独放到 `createU1ThemeCode`.

主题编辑器不直接拼字符串.

第一版生成完整变量代码.

不要只生成修改过的变量.

空值不生成到主题代码.

```ts
import { applyU1Theme } from '@u1design/vue/theme'

applyU1Theme({
  primary: '#1677ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#ff4d4f',
  info: '#1677ff',
  text: '#1f2937',
  textRegular: '#4b5563',
  border: '#d1d5db',
  borderLight: '#e5e7eb',
  background: '#ffffff',
  radiusBase: '8px',
  shadowLight: '0 6px 18px rgb(15 23 42 / 10%)',
  shadowFocus: '0 0 0 3px rgb(22 119 255 / 20%)'
})
```

用户复制后可以直接放到自己的项目里.

## 变量校验

第一版只做轻量校验.

- 颜色值不能为空.
- 尺寸值不能为空.
- 阴影值不能为空.
- 空值不写入页面.
- 空值不生成到主题代码.
- 不做复杂 CSS 解析.
- 不阻止用户输入合法 CSS 颜色函数, 例如 `rgb(...)` 和 `oklch(...)`.

## 组件边界

`U1ThemeEditor` 负责主题编辑, 预览生效, 主题代码生成和复制.

`U1ThemeEditorDialog` 只负责弹窗包装.

`U1ThemeEditorDialog` 不写主题逻辑.

主题逻辑只放在这些位置.

- `applyU1Theme`.
- `resetU1Theme`.
- `createU1ThemeCode`.
- `u1ThemeTokens`.
- `U1ThemeEditor`.

## 文件职责

| 文件 | 动作 | 职责 |
| --- | --- | --- |
| `packages/components/src/theme/tokens.ts` | Create | 定义第一版 token 列表, 默认值, 字段类型, CSS 变量映射. |
| `packages/components/src/theme/applyTheme.ts` | Create | 实现 `applyU1Theme` 和 `resetU1Theme`. |
| `packages/components/src/theme/createThemeCode.ts` | Create | 实现 `createU1ThemeCode`. |
| `packages/components/src/theme/index.ts` | Create | 导出主题 API. |
| `packages/components/src/theme-editor/ThemeEditor.vue` | Create | 表单编辑, 实时预览, 复制主题代码, 重置默认变量. |
| `packages/components/src/theme-editor/ThemeEditorDialog.vue` | Create | 只包装 Dialog 的打开关闭状态和内容插槽. |
| `packages/components/src/theme-editor/index.ts` | Create | 导出编辑器组件. |
| `packages/components/src/index.ts` | Modify | 导出 `U1ThemeEditor` 和 `U1ThemeEditorDialog`. |
| `packages/components/package.json` | Modify | 增加 `./theme` 和必要的编辑器导出信息. |
| `packages/components/vite.config.ts` | Modify | 改成多入口构建, 确保生成 `dist/theme/index.js`. |
| `packages/components/src/__tests__/theme.test.ts` | Create | 覆盖主题 API. |
| `packages/components/src/__tests__/theme-editor.test.ts` | Create | 覆盖编辑器和 Dialog 边界. |
| `docs/component/design/theme-editor.md` | Create | 增加主题编辑器文档和演示. |
| `docs/.vitepress/config.ts` | Modify | 在设计分组增加主题编辑器入口. |

## 包导出

需要新增 `@u1design/vue/theme` 子入口.

用户要能这样引入.

```ts
import { applyU1Theme } from '@u1design/vue/theme'
```

当前 `packages/components/vite.config.ts` 只有单入口 `src/index.ts`.

因此不能只改 `package.json`.

必须同步把 Vite lib entry 改为多入口.

建议目标结构如下.

```ts
lib: {
  entry: {
    index: resolve(__dirname, 'src/index.ts'),
    theme: resolve(__dirname, 'src/theme/index.ts')
  },
  name: 'U1Design',
  fileName: (format, entryName) => entryName === 'index' ? 'u1design.js' : `${entryName}/index.js`,
  cssFileName: 'style'
}
```

`package.json` 需要增加 exports.

```json
{
  "./theme": {
    "types": "./dist/theme/index.d.ts",
    "import": "./dist/theme/index.js"
  }
}
```

构建完成后必须确认这些文件存在.

- `packages/components/dist/theme/index.js`.
- `packages/components/dist/theme/index.d.ts`.
- `packages/components/dist/style.css`.

## UI 要求

编辑器不是营销页.

它是组件库里的工具面板.

布局要求如下.

- 表单区域和代码区域用清晰分栏.
- 小屏幕下纵向排列.
- 控件使用稳定尺寸.
- 颜色输入要有色块预览.
- 文本输入必须有可见 label.
- 复制按钮要有成功反馈.
- 重置按钮不能和复制按钮混淆.
- textarea 使用等宽字体.
- textarea 只读.
- Dialog 关闭后不自动保存任何状态.

## 实施任务

### Task 1: 主题 token 和 API

**Files:**

- Create: `packages/components/src/theme/tokens.ts`.
- Create: `packages/components/src/theme/applyTheme.ts`.
- Create: `packages/components/src/theme/createThemeCode.ts`.
- Create: `packages/components/src/theme/index.ts`.
- Create: `packages/components/src/__tests__/theme.test.ts`.

- [ ] Step 1: 写 `theme.test.ts`, 覆盖 token 映射, DOM 写入, 空值过滤, reset 清理, 无 `document` 返回.
- [ ] Step 2: 运行 `pnpm test packages/components/src/__tests__/theme.test.ts`, 预期先失败.
- [ ] Step 3: 实现 `u1ThemeTokens`, `applyU1Theme`, `resetU1Theme`, `createU1ThemeCode`.
- [ ] Step 4: 再运行 `pnpm test packages/components/src/__tests__/theme.test.ts`, 预期通过.

### Task 2: 主题编辑器组件

**Files:**

- Create: `packages/components/src/theme-editor/ThemeEditor.vue`.
- Create: `packages/components/src/theme-editor/ThemeEditorDialog.vue`.
- Create: `packages/components/src/theme-editor/index.ts`.
- Modify: `packages/components/src/index.ts`.
- Create: `packages/components/src/__tests__/theme-editor.test.ts`.

- [ ] Step 1: 写 `theme-editor.test.ts`, 覆盖修改变量后调用预览, 代码同步, 复制反馈, 重置默认值.
- [ ] Step 2: 写 Dialog 边界测试, 断言 `U1ThemeEditorDialog` 不直接调用 `document.documentElement.style.setProperty`.
- [ ] Step 3: 运行 `pnpm test packages/components/src/__tests__/theme-editor.test.ts`, 预期先失败.
- [ ] Step 4: 实现 `U1ThemeEditor`.
- [ ] Step 5: 实现 `U1ThemeEditorDialog`.
- [ ] Step 6: 再运行 `pnpm test packages/components/src/__tests__/theme-editor.test.ts`, 预期通过.

### Task 3: 构建入口和包导出

**Files:**

- Modify: `packages/components/vite.config.ts`.
- Modify: `packages/components/package.json`.

- [ ] Step 1: 修改 Vite lib entry 为多入口.
- [ ] Step 2: 修改 `package.json` exports, 增加 `./theme`.
- [ ] Step 3: 运行 `pnpm --filter @u1design/vue build`.
- [ ] Step 4: 确认 `dist/theme/index.js` 和 `dist/theme/index.d.ts` 存在.

### Task 4: 文档和演示

**Files:**

- Create: `docs/component/design/theme-editor.md`.
- Modify: `docs/.vitepress/config.ts`.

- [ ] Step 1: 增加文档页, 展示 `U1ThemeEditorDialog` 打开入口.
- [ ] Step 2: 增加用户项目代码示例.
- [ ] Step 3: 在 VitePress sidebar 的设计分组加入 `主题编辑器`.
- [ ] Step 4: 运行 `pnpm --filter docs dev`, 在浏览器检查文档页.

## 测试要求

- `applyU1Theme` 能写入 `document.documentElement`.
- `applyU1Theme` 在无 `document` 时不报错.
- `applyU1Theme` 不写入空值.
- `resetU1Theme` 只清理主题变量.
- `createU1ThemeCode` 能生成完整 JS 代码.
- `createU1ThemeCode` 不生成空值字段.
- `U1ThemeEditor` 修改变量后调用 `applyU1Theme`.
- `U1ThemeEditor` 修改变量后同步更新主题代码.
- `U1ThemeEditor` 点击重置后恢复默认 token.
- `U1ThemeEditorDialog` 只负责显示和关闭弹窗.
- `U1ThemeEditorDialog` 不包含主题变量写入逻辑.

## 验证命令

实现完成后按顺序运行.

```powershell
pnpm test
pnpm typecheck
pnpm build
```

浏览器验证需要启动文档站.

```powershell
pnpm --filter docs dev
```

验证页面.

- `/component/design/theme-editor`.
- 桌面宽度.
- 375px 移动宽度.

## 验收标准

- 可以打开主题编辑器 Dialog.
- 修改变量后页面马上变化.
- 刷新页面后回到默认样式.
- JS 多行文本框同步展示完整代码.
- 可以复制完整 JS 代码.
- 复制的代码可以在用户项目中调用 `applyU1Theme`.
- 可以重置默认变量.
- `@u1design/vue/theme` 可以正常导入.
- `@u1design/vue/style.css` 仍然正常导入.
- 不产生任何文件.
- 不需要后端接口.
- 不写入浏览器存储.

## 后续扩展

后续扩展顺序如下.

1. 全局颜色和基础外观.
2. 尺寸和字号.
3. 组件专属变量.
4. 暗色模式和动画.

### 尺寸

- `inputHeight`.
- `tableCellPadding`.

### 字号

- `fontSize`.
- `fontSizeSmall`.
- `fontSizeLarge`.

### 间距

- `paddingSmall`.
- `paddingBase`.
- `paddingLarge`.
- `gapBase`.

### 组件专属

- `buttonRadius`.
- `buttonHeight`.
- `cardPadding`.
- `dialogRadius`.
- `tableHeaderBg`.

### 暗色模式

- `darkBackground`.
- `darkText`.
- `darkBorder`.

### 动画

- `transitionDuration`.
- `transitionTiming`.

## 扩展规则

JS 方案不是直接修改组件属性.

JS 方案通过 CSS 变量控制样式.

`applyU1Theme` 要作为正式 API 暴露.

不要只写在主题编辑器内部.

`createU1ThemeCode` 也要作为工具函数保留.

想支持新的可调项时, 组件 CSS 中必须先有对应变量.

例如按钮高度要先改成变量.

```css
.u1-button {
  height: var(--u1-button-height);
}
```

然后 JS 才能控制.
