# 后台 7 个模块 UI/UX 严格优化计划

**日期**: 2026-06-24
**方案**: A — 按严重程度（CRITICAL → HIGH → MEDIUM）
**项目**: `C:\AAA\tool_ui\ui3\my-nuxt-app\`
**参考**: `C:\AAA\sys_admin\sys_admin4_3\sys_next5\`

---

## 全局规范（所有页面必须遵守）

### 必须使用的共享组件
项目已存在以下组件，必须复用：
- `Com1Card` — 卡片容器（带 header-left / header-right 插槽）
- `Com1Button` — 按钮（variant: primary/secondary/danger）
- `Com1Dialog` — 模态对话框
- `Com1Confirm` — 确认弹窗（替代 `confirm()`）
- `Com1Message` — 消息提示（success/error/info）
- `Com1Input` — 输入框
- `Com1Select` — 下拉选择
- `Com1Table` / `Com1Pagination` — 表格与分页（如不存在则用原生 `<table>` + Tailwind）

### 必须遵守的规则
1. **类型安全**: 所有数据用 `interface` 定义类型，禁止 `any[]`
2. **函数命名**: 英文命名，禁止中文（如 `fetch用户管理` → `fetchUsers`）
3. **错误处理**: 所有 API 调用必须 `try/catch`，失败用 `Com1Message.error`
4. **加载状态**: 必须有 spinner 或 skeleton，禁止纯文本 "加载中..."
5. **空状态**: 必须有居中提示 + 引导操作
6. **确认操作**: 删除用 `Com1Confirm`，禁止 `confirm()`/`alert()`
7. **布局**: `<script setup lang="ts">` + `<script setup>` 顶部加 `definePageMeta({ layout: 'admin' })`
8. **样式**: Tailwind 标准色（`bg-blue-600`），禁止任意值（`bg-[#1e40af]`）
9. **触摸目标**: 按钮 ≥44px 高度

### 文件位置
所有目标文件：`app/pages/admin/{name}.vue`

---

## 阶段 1: CRITICAL（基线建立）

### 任务 1.1: user.vue

**当前问题**:
- 仅列表+删除，无表格、无新增/编辑、无角色分配
- 中文函数名 `fetch用户管理`
- 无错误处理、无空状态
- 用原生 `confirm()`/`<button>`

**目标**:
- 表格展示：ID、昵称、邮箱、角色（badge）、描述、操作
- 新增/编辑对话框（Com1Dialog + Com1Input + 角色多选 Com1CheckBox）
- 删除确认（Com1Confirm）
- TypeScript User/Role 接口
- try/catch + Com1Message 错误提示

**参考文件**:
- `C:\AAA\sys_admin\sys_admin4_3\sys_next5\app\admin\user\page.tsx`

**API**: 已有 `/api/admin/user`

### 任务 1.2: role.vue

**当前问题**:
- 仅列表+删除
- 中文函数名 `fetch角色管理`
- 无表格、无新增/编辑、无状态开关、无预设角色保护

**目标**:
- 表格展示：ID、名称、标识、描述、用户数、状态、排序、操作
- 新增/编辑对话框（Com1Dialog）
- 状态切换按钮（启用/禁用）
- 预设角色保护（USER_ADMIN0 等不可删除）
- TypeScript Role 接口

**参考文件**:
- `C:\AAA\sys_admin\sys_admin4_3\sys_next5\app\admin\role\page.tsx`

**API**: 已有 `/api/admin/role`

### 任务 1.3: my-student.vue

**当前问题**:
- 极简列表，仅显示姓名+年龄
- 参考项目是画布 UI（800+ 行），复杂度高
- 无组件、无错误处理

**目标（基础版）**:
- 表格展示：ID、姓名、年龄、操作
- 新增/编辑对话框（Com1Dialog）
- 删除确认（Com1Confirm）
- TypeScript Student 接口
- **不实现画布拖拽**（避免过度工程，先满足基础 CRUD）

**参考文件**:
- `C:\AAA\sys_admin\sys_admin4_3\sys_next5\app\admin\my-student\page.tsx`

**API**: 已有 `/api/admin/my-student`

---

## 阶段 2: HIGH（套用模式）

### 任务 2.1: article.vue

**当前问题**:
- 分类+文章混合在一个 dialog
- 用 `alert()`/`confirm()`
- `any[]` 类型

**目标**:
- 拆分为分类管理 + 文章管理两个 Com1Card
- 分类：表格 + 增改删
- 文章：表格 + 增改删（带分类下拉选择）
- TypeScript Article/Category 接口
- 修复 `form.value.content === ''` 这种脆弱判断

**参考文件**:
- `C:\AAA\sys_admin\sys_admin4_3\sys_next5\app\admin\article\page.tsx`

**API**: 已有 `/api/admin/article`

### 任务 2.2: menu.vue

**当前问题**:
- 平铺列表，无分组
- 无新增/编辑/状态切换

**目标**:
- 按 `group` 字段分组（admin / web）
- 每组展示：表格 + 状态（启用/禁用）+ 操作
- 新增/编辑对话框（含 group 选择、path、icon、orderNum）
- TypeScript Menu 接口

**参考文件**:
- `C:\AAA\sys_admin\sys_admin4_3\sys_next5\app\admin\menu\page.tsx`

**API**: 已有 `/api/admin/menu`

### 任务 2.3: setting.vue

**当前问题**:
- 无 Com1Card、无组件
- 中文函数名 `fetch网站设置`
- 无加载/空状态

**目标**:
- 每个配置项一张 Com1Card
- Com1Input 输入 + Com1Button 保存
- Com1Message 成功/失败提示
- TypeScript Setting 接口
- label 与 input 用 `for`/`id` 关联

**参考文件**:
- `C:\AAA\sys_admin\sys_admin4_3\sys_next5\app\admin\setting\page.tsx`

**API**: 已有 `/api/admin/setting`

---

## 阶段 3: MEDIUM（打磨）

### 任务 3.1: menu-permission.vue

**当前问题**:
- 已用 Com1Card/Com1Button/Com1Message（最好的一个）
- `bg-[#1e40af]` → 应改为 `bg-blue-800`
- 空状态/加载状态 padding 不足（应 `p-12`）
- 未选角色时与无数据状态混淆

**目标**:
- 颜色改 Tailwind 标准色
- 加载/空状态 padding 改为 `p-12`
- 区分"未选角色"与"无数据"两种空状态
- 其他保持

**API**: 已有 `/api/admin/role/{id}/menu-permission`

---

## 验证

每个页面改完后，HTTP 请求 `/admin/{page}` 检查：
1. 不报 500 错误
2. 包含 `<aside class="bg-gray-800">` 侧边栏
3. 不报 TypeScript/Vue 编译错误

---

## 工作流

1. **并行阶段 1**: 启动 3 个子 Agent（user / role / my-student）
2. **并行阶段 2**: 启动 3 个子 Agent（article / menu / setting）
3. **单独阶段 3**: 1 个子 Agent（menu-permission 小修）
4. **总验证**: 我本人执行

每完成一个子任务，汇报到父 Agent。

---

## 不做的事（避免过度工程）

- ❌ my-student 不实现画布拖拽
- ❌ 不重构后端 API
- ❌ 不修改其他无关页面（article.vue 涉及 article 列表但不重写前台 article 显示）
- ❌ 不引入新依赖（用现有 Com1 系列组件）
- ❌ 不写单元测试（用户未要求）
