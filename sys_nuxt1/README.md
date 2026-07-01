# 工具管理平台

本项目是一个基于 Nuxt 4 + Drizzle ORM + Tailwind CSS 构建的全栈工具管理平台，主要用于统一管理后台用户、角色、菜单权限、文章、学生等业务数据，支持 RBAC 权限模型、JWT 安全认证、Redis 缓存、邮件验证码、对象存储上传等功能。

## 核心功能

- **功能 1 - RBAC 权限管理**：四级角色体系（管理员0级 / 管理员1级 / 部分管理员 / 普通用户），菜单级精细化权限控制，支持角色菜单权限分配页面
- **功能 2 - JWT 安全认证**：基于 jose 库实现登录、注册、登出、邮件验证码等完整鉴权流程；后台与前台 Cookie 双 Token 隔离（admin_token / token）
- **功能 3 - 后台中控管理**：仪表盘、用户管理、角色管理、菜单管理、菜单权限分配、文章管理、学生管理、系统设置、UI 设计展示页
- **功能 4 - 前台会员系统**：用户注册 / 登录 / 文章浏览 / 产品图册等前台功能
- **功能 5 - 邮件与缓存**：集成 Nodemailer 发送验证码、Redis 缓存加速
- **功能 6 - 文件上传**：支持用户头像上传至 OSS（统一通过 lib/sdk_oss）
- **功能 7 - 逻辑删除**：文章等数据支持软删除，保留数据完整性
- **功能 8 - Com1 基础组件库**：按钮、输入框、选择器、对话框、确认框、卡片、消息提示、Markdown 预览等开箱即用组件

## 安装与运行和常用命令

```powershell
# 运行环境
node >= 20
npm install

# 复制环境变量模板（必填 JWT_SECRET / DATABASE_URL / REDIS_URL / SMTP_USER / SMTP_PASS）
Copy-Item .env.example .env

# 快速启动
npm run dev

# 常用命令
npm run build           # 构建生产版本
npm run preview         # 预览生产版本
npm run generate        # 静态站点生成
npm run db:generate     # 生成数据库迁移
npm run db:migrate      # 执行迁移
npm run db:push         # 推送 schema 到数据库
npm run db:studio       # 打开 Drizzle Studio 可视化数据库
```

## 技术栈

- **Nuxt 4** - Vue 3 + TypeScript 全栈框架（app/ 目录结构）
- **Pinia (@pinia/nuxt)** - 状态管理
- **Tailwind CSS + SCSS** - 样式方案
- **PostgreSQL + Drizzle ORM** - 数据库与 ORM
- **Redis (ioredis)** - 缓存层
- **jose + bcryptjs** - JWT 鉴权与密码加密
- **Nodemailer** - 邮件服务
- **Drizzle Kit** - 数据库迁移工具
- **dayjs** - 时间处理

## 项目结构

```
my-nuxt-app/
├── app/                              # Nuxt 4 App 目录（前端代码）
│   ├── app.vue                       # 根组件
│   ├── assets/                       # 静态资源
│   │   ├── css/tailwind.css          # Tailwind 入口样式
│   │   └── styles/                   # SCSS 样式
│   │       ├── main.scss             # 全局主样式
│   │       └── _variables.scss       # 样式变量
│   ├── components/                   # 公共组件（Com1 基础组件 + admin 业务组件）
│   │   ├── Com1Button.vue            # 基础按钮组件
│   │   ├── Com1Card.vue              # 基础卡片组件
│   │   ├── Com1Confirm.vue           # 基础确认弹框组件
│   │   ├── Com1Dialog.vue            # 基础对话框组件
│   │   ├── Com1Input.vue             # 基础输入框组件
│   │   ├── Com1Message.vue           # 基础消息提示组件
│   │   ├── Com1Select.vue            # 基础选择器组件
│   │   ├── MarkdownPreview.vue       # Markdown 预览组件
│   │   └── admin/                    # 后台管理业务组件
│   │       ├── EditAvatarForm.vue    # 编辑头像表单
│   │       ├── EditEmailForm.vue     # 编辑邮箱表单
│   │       ├── EditNicknameForm.vue  # 编辑昵称表单
│   │       ├── EditPasswordForm.vue  # 编辑密码表单
│   │       └── ProfileContent.vue    # 个人资料内容
│   ├── composables/                  # 组合式函数（自动注册）
│   │   └── useCom1Confirm.ts         # Com1Confirm 异步调用封装（Promise 风格）
│   ├── layouts/                      # 布局文件
│   │   ├── admin.vue                 # 后台管理布局
│   │   └── default.vue               # 默认布局
│   ├── pages/                        # 页面文件
│   │   ├── index.vue                 # 首页（前台主页）
│   │   ├── admin/                    # 后台页面
│   │   │   ├── index.vue             # 管理后台首页/仪表盘
│   │   │   ├── login.vue             # 后台登录页
│   │   │   ├── user.vue              # 用户管理页
│   │   │   ├── role.vue              # 角色管理页
│   │   │   ├── menu.vue              # 菜单管理页
│   │   │   ├── menu-permission.vue   # 角色菜单权限分配页
│   │   │   ├── article.vue           # 文章管理页
│   │   │   ├── my-student.vue        # 学生管理页（自由画布）
│   │   │   ├── setting.vue           # 系统设置页
│   │   │   └── ui-design.vue         # UI 设计展示页
│   │   └── web/                      # 前台页面
│   │       ├── index.vue             # 前台首页
│   │       ├── login.vue             # 会员登录页
│   │       ├── register.vue          # 会员注册页
│   │       ├── article.vue           # 文章详情页
│   │       └── product_img.vue       # 产品图册页
│   └── utils/                        # 前端工具（自动注册）
├── server/                           # Nuxt Server 目录（后端代码）
│   ├── api/                          # API 路由
│   │   ├── auth/                     # 认证相关 API
│   │   │   ├── login.post.ts         # 登录接口
│   │   │   ├── logout.post.ts        # 登出接口
│   │   │   ├── profile.ts            # 获取用户资料
│   │   │   ├── register.post.ts      # 注册接口
│   │   │   └── send-code.post.ts     # 发送邮件验证码
│   │   ├── admin/                    # 后台管理 API
│   │   │   ├── user.ts               # 用户管理 CRUD
│   │   │   ├── role.ts               # 角色管理 CRUD
│   │   │   ├── role/[id]/            # 单角色操作（含权限绑定）
│   │   │   ├── menu.ts               # 菜单管理 CRUD
│   │   │   ├── menu/[id].ts          # 单菜单操作（更新 / 删除）
│   │   │   ├── article.ts            # 文章管理 CRUD
│   │   │   ├── my-student.ts         # 学生管理 CRUD
│   │   │   ├── setting.ts            # 系统设置 CRUD
│   │   │   ├── ui-design.get.ts      # UI 设计目录列表
│   │   │   └── ui-design/content.get.ts # UI 设计内容获取
│   │   ├── upload/                   # 文件上传 API
│   │   │   └── avatar.post.ts        # 头像上传
│   │   └── web/                      # 前台 API
│   │       └── article.ts            # 前台文章接口
│   ├── db/                           # 数据库层
│   │   ├── index.ts                  # 数据库连接
│   │   └── schema.ts                 # Drizzle 表结构（8 张表及关系）
│   │       ├── role                  # 角色表（四级角色体系）
│   │       ├── menu                  # 菜单表（支持 group / orderNum / status）
│   │       ├── roleMenuPermission    # 角色菜单权限表
│   │       ├── userRole              # 用户角色关联表
│   │       ├── user                  # 用户表
│   │       ├── setting               # 网站设置表（KV）
│   │       ├── articleCategory       # 文章分类表
│   │       ├── student               # 学生表（自由画布，含 x / y 坐标）
│   │       └── articleInfo           # 文章表（支持逻辑删除）
│   ├── middleware/                   # 服务端中间件
│   │   └── admin-auth.ts             # /admin/* 路由鉴权中间件（校验 admin_token）
│   └── utils/                        # 服务端工具
│       ├── auth.ts                   # JWT 工具函数（签名 / 验签）
│       ├── constants.ts              # 常量定义（Cookie 名 / 角色前缀）
│       ├── email_code.ts             # 邮件验证码生成与发送
│       ├── redis.ts                  # Redis 连接与操作
│       └── requireAdmin.ts           # 管理员权限校验工具
├── public/                           # 静态公共资源
├── nuxt.config.ts                    # Nuxt 配置（运行时配置 / 别名 / SCSS 注入）
├── drizzle.config.ts                 # Drizzle ORM 配置
├── tailwind.config.ts                # Tailwind CSS 配置
├── package.json                      # 项目依赖
├── .env                              # 环境变量（需从 .env.example 复制）
└── docs/
    └── sql/full_backup.sql           # 数据库备份
```

## 重要目录说明

```
app/composables/   # Vue 组合式函数（Nuxt 自动注册），用于封装 Com1 组件的 Promise 异步调用
app/components/    # 基础组件库 Com1 系列 + 业务组件；新增组件建议以 Com1 前缀命名保持一致
app/utils/         # 前端工具函数与响应格式封装
server/middleware/ # Nitro 中间件，统一处理 /admin/* 鉴权
server/utils/      # 后端公共工具：JWT、Redis、邮件验证码、权限校验
server/db/         # Drizzle ORM Schema 与连接，是所有业务表的唯一来源
lib/               # 核心封装（如 sdk_oss 统一文件上传 / 删除），禁止在各页面直连 OSS
```

## 优化建议

### 代码结构封装归类优化

- p0 - 抽取 `lib/sdk_oss` 统一上传入口 - 当前上传相关代码可能散落在各 API 中，按规范文件上传与删除应统一使用 `lib/sdk_oss.ts`，避免硬编码 OSS 配置
- p0 - 抽取 Com1 系列组件的 TypeScript 类型 - Com1 系列组件（Com1Input / Com1Dialog / Com1Select 等）目前 props 类型就近写在 `.vue` 中，建议在 `app/components/types/` 下集中定义 `.d.ts`，提升复用与 IDE 智能提示
- p1 - 封装 API composables - 当前 `$fetch` 直接散落在各页面中，建议在 `app/composables/` 下封装 `useAuth`、`useArticle`、`useUser`、`useMenu` 等 composables，统一错误处理、Loading 状态管理
- p1 - 统一响应格式封装 - 前后端通信的响应格式（`{ code, data, message }`）散落在各 API 中，建议在 `server/utils/response.ts` 中统一封装 `success`、`error` 工具函数
- p2 - 抽取 SCSS 变量到独立文件 - `main.scss` 中的颜色、字体、间距等变量应统一迁移到 `_variables.scss`，并与 Tailwind 配置保持同步，避免双份维护

### 用户体验优化

- p0 - 完善文章详情页的富文本渲染 - 当前 `web/article.vue` 已接入 `MarkdownPreview.vue` 组件，建议进一步增加文章目录导航、代码高亮（highlight.js / shiki）、图片灯箱等阅读增强功能
- p0 - 统一使用 Com1Confirm 替代浏览器原生 confirm - 部分删除操作仍可能使用 `window.confirm`，建议所有危险操作统一改用 `useCom1Confirm()` 的 Promise 风格调用，保持交互一致性
- p1 - 完善表单验证反馈 - Com1Input / Com1Select 等组件提交校验失败时，建议通过红色边框 + 错误提示文字直观展示字段错误信息，而不仅靠接口返回错误
- p1 - 前台登录注册添加记住密码 / 忘记密码 - 提升前台用户登录便利性
- p2 - 增加 Loading 骨架屏 - 文章列表、用户列表等数据加载场景建议添加骨架屏占位，避免白屏等待的焦虑感
- p2 - UI 设计展示页支持 iframe 预览 - `admin/ui-design.vue` 加载本地组件库演示页时，建议支持多 tab 切换、新窗口打开等操作

### 残缺功能优化

- p0 - 学生管理页面仅列表展示 - `my-student.vue` 标注为"自由画布"，但当前仅实现列表，schema 中 `x` / `y` 坐标字段未在页面使用，建议补全自由画布拖拽交互能力
- p1 - 文章富文本编辑缺失 - `article.vue` 文章内容编辑使用原生 `<textarea>`，无富文本编辑器（如 TipTap / Quill），无法支持标题层级、列表、代码块、图片等排版需求
- p1 - 网站设置页面缺少交互引导 - `setting.vue` 仅展示 Key-Value 列表，缺少设置项说明、新增自定义 Key 入口、Key 值格式校验
- p1 - 菜单权限分配页权限粒度 - `menu-permission.vue` 已支持按角色分配菜单访问权限，建议进一步支持单菜单"读 / 写 / 删"等更细粒度操作
- p2 - 产品图册页面仅占位 - `web/product_img.vue` 当前仅为占位页（"功能开发中"），需补充实际产品图册展示 / 上传功能
- p2 - 后台首页仪表盘数据可视化 - `admin/index.vue` 仪表盘建议接入用户、文章、登录等关键指标图表（ECharts / Chart.js）

### 无用和重复代码优化（必须严格检查）

- p0 - 清理根目录数据库备份 SQL：`full_backup.sql`、`recovered_data.sql` 为恢复过程临时产物，不应保留在源码仓库中（如需备份请移至 `docs/sql/` 并明确版本）
- p1 - `server/api/admin/` 下 `menu.ts` 与 `menu/[id].ts`、`role.ts` 与 `role/[id]/` 存在重复校验逻辑，应在 `server/utils/` 抽取 `validateMenuPayload`、`validateRolePayload` 等公共校验函数
- p1 - 部分 `app/pages/admin/*.vue` 仍使用旧版 Tailwind class 与 Com1 组件混用，建议全量替换为 Com1 系列，保证 UI 一致性
- p2 - 检查并合并 `lib/` 下潜在的重复 OSS / 上传工具（如有），按规范仅保留 `sdk_oss.ts` 作为唯一入口
