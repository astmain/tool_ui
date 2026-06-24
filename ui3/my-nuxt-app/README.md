# 工具管理平台

基于 Nuxt + Drizzle + Tailwind 构建的全栈工具管理平台，支持 RBAC 权限管理、JWT 安全认证、后台管理与前台会员系统。

## 功能特点

- **RBAC 权限管理** - 四级角色体系：管理员0级（超级权限）、管理员1级、部分管理员权限，支持菜单级别的精细化权限控制
- **JWT 安全认证** - 基于 jose 库的 JSON Web Token 认证，支持登录、注册、邮件验证码、登出等完整流程
- **后台中控管理** - 用户管理、角色管理、菜单管理、文章管理、学生管理、系统设置等完整后台功能
- **前台会员系统** - 支持用户注册登录、文章浏览、产品图册等功能
- **邮件服务** - 集成 Nodemailer 实现邮件验证码发送
- **Redis 缓存** - 基于 ioredis 实现缓存加速
- **文件上传** - 支持用户头像上传至 OSS
- **逻辑删除** - 文章等数据支持软删除，保留数据完整性

## 安装与运行

```powershell
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 生产构建
npm run build

# 预览生产版本
npm run preview

# 数据库相关（需先配置 .env）
npm run db:generate   # 生成数据库迁移
npm run db:migrate    # 执行迁移
npm run db:push       # 推送 schema 到数据库
npm run db:studio     # 打开 Drizzle Studio 可视化数据库
```

## 技术栈

- **框架** - Nuxt 4（Vue 3 + TypeScript 全栈框架）
- **状态管理** - Pinia（@pinia/nuxt）
- **样式** - Tailwind CSS + SCSS
- **数据库** - PostgreSQL + Drizzle ORM
- **缓存** - Redis（ioredis）
- **认证** - JWT（jose）+ bcryptjs 密码加密
- **邮件** - Nodemailer
- **开发工具** - Drizzle Kit（数据库迁移管理）

## 项目结构

my-nuxt-app/
├── app/                            # Nuxt 4 App 目录（前端代码）
│   ├── app.vue                     # 根组件
│   ├── assets/                     # 静态资源
│   │   ├── css/tailwind.css        # Tailwind 入口样式
│   │   └── styles/                 # SCSS 样式
│   │       ├── main.scss           # 全局主样式
│   │       └── _variables.scss     # 样式变量
│   ├── components/                 # 公共组件（Com1 系列基础组件 + admin 业务组件）
│   │   ├── Com1Button.vue          # 按钮组件
│   │   ├── Com1Dialog.vue          # 对话框组件
│   │   ├── Com1Input.vue           # 输入框组件
│   │   └── admin/                  # 后台管理业务组件
│   │       ├── EditAvatarForm.vue  # 编辑头像表单
│   │       ├── EditEmailForm.vue   # 编辑邮箱表单
│   │       ├── EditNicknameForm.vue# 编辑昵称表单
│   │       ├── EditPasswordForm.vue# 编辑密码表单
│   │       └── ProfileContent.vue  # 个人资料内容
│   ├── layouts/                    # 布局文件
│   │   ├── admin.vue               # 后台管理布局
│   │   └── default.vue             # 默认布局
│   ├── pages/                      # 页面文件
│   │   ├── index.vue               # 首页（前台主页）
│   │   ├── admin/                  # 后台页面
│   │   │   ├── index.vue           # 管理后台首页/仪表盘
│   │   │   ├── login.vue           # 后台登录页
│   │   │   ├── user.vue            # 用户管理页
│   │   │   ├── role.vue            # 角色管理页
│   │   │   ├── menu.vue            # 菜单管理页
│   │   │   ├── article.vue         # 文章管理页
│   │   │   ├── my-student.vue      # 学生管理页（自由画布）
│   │   │   └── setting.vue         # 系统设置页
│   │   └── web/                    # 前台页面
│   │       ├── index.vue           # 前台首页
│   │       ├── login.vue           # 会员登录页
│   │       ├── register.vue        # 会员注册页
│   │       └── article.vue         # 文章详情页
│   └── utils/                      # 工具函数
├── server/                         # Nuxt Server 目录（后端代码）
│   ├── api/                        # API 路由
│   │   ├── auth/                   # 认证相关 API
│   │   │   ├── login.post.ts       # 登录接口
│   │   │   ├── logout.post.ts      # 登出接口
│   │   │   ├── profile.ts          # 获取用户资料
│   │   │   ├── register.post.ts    # 注册接口
│   │   │   └── send-code.post.ts   # 发送邮件验证码
│   │   ├── admin/                  # 后台管理 API
│   │   │   ├── user.ts             # 用户管理 CRUD
│   │   │   ├── role.ts             # 角色管理 CRUD
│   │   │   ├── menu.ts             # 菜单管理 CRUD
│   │   │   ├── article.ts          # 文章管理 CRUD
│   │   │   ├── my-student.ts       # 学生管理 CRUD
│   │   │   └── setting.ts          # 系统设置 CRUD
│   │   ├── upload/                # 文件上传 API
│   │   │   └── avatar.post.ts      # 头像上传
│   │   └── web/                   # 前台 API
│   │       └── article.ts          # 前台文章接口
│   ├── db/                         # 数据库层
│   │   ├── index.ts                # 数据库连接
│   │   └── schema.ts               # Drizzle 表结构定义（含 8 张表及关系）
│   │       ├── role               # 角色表（四级角色体系）
│   │       ├── menu               # 菜单表（扁平结构）
│   │       ├── roleMenuPermission # 角色菜单权限表
│   │       ├── userRole           # 用户角色关联表
│   │       ├── user               # 用户表
│   │       ├── setting            # 网站设置表（KV）
│   │       ├── articleCategory    # 文章分类表
│   │       ├── student            # 学生表（自由画布）
│   │       └── articleInfo        # 文章表（逻辑删除）
│   └── utils/                      # 服务端工具
│       ├── auth.ts                 # JWT 工具函数
│       ├── constants.ts            # 常量定义
│       ├── email_code.ts          # 邮件验证码生成与发送
│       ├── redis.ts                # Redis 连接与操作
│       └── requireAdmin.ts         # 管理员权限中间件
├── public/                         # 静态公共资源
├── nuxt.config.ts                  # Nuxt 配置
├── drizzle.config.ts               # Drizzle ORM 配置
├── tailwind.config.ts             # Tailwind CSS 配置
├── package.json                    # 项目依赖
└── .env                            # 环境变量（需从 .env.example 复制）

## 优化建议

### 代码结构封装归类优化

- p0 - 将 API 请求封装为 composables - 当前 `$fetch` 直接散落在各页面中，不利于统一错误处理、请求拦截、Loading 状态管理，建议在 `app/utils/composables/` 下封装 `useAuth`、`useArticle`、`useUser` 等 composables，统一处理接口调用逻辑
- p1 - 抽取 Com1 系列组件的 TypeScript 类型定义 - Com1 系列组件（Com1Input、Com1Dialog 等）目前 props 没有独立的类型文件，建议在 `app/components/types/` 下创建 `.ts` 类型定义文件集中管理，提升 TypeScript 智能提示和类型安全
- p1 - 统一响应格式封装 - 前后端通信的响应格式目前散落在各 API 中，建议在 `server/utils/response.ts` 中统一封装 `success` 和 `error` 工具函数，确保所有接口返回一致的数据结构
- p2 - 抽取 SCSS 变量到独立文件 - `main.scss` 中可能存在重复的颜色、字体等变量，应统一迁移到 `_variables.scss`，并确保 Tailwind 配置与 SCSS 变量保持同步

### 用户体验优化

- p0 - 完善文章详情页的富文本渲染 - 当前 `web/article.vue` 仅展示纯文本，建议增加文章目录导航、代码高亮（highlight.js）、图片灯箱等阅读增强功能，提升文章阅读体验
- p1 - 增加表单验证反馈 - Com1Input 等表单组件在提交校验失败时，建议通过红色边框 + 错误提示文字直观展示字段错误信息，而不是仅靠接口返回错误
- p1 - 前台登录注册页面添加记住密码/忘记密码功能 - 提升用户登录便利性
- p2 - 增加 Loading 骨架屏 - 文章列表、用户列表等数据加载场景建议添加骨架屏占位，避免白屏等待的焦虑感

### 残缺功能优化

- p0 - 菜单管理页面乱码与功能缺失 - `menu.vue` 页面存在中文乱码（编码问题），且仅支持删除菜单，缺少添加、编辑、排序等基本功能，与 schema 中 `orderNum`、`status` 等字段不匹配
- p0 - 用户管理页面功能过于简陋 - `user.vue` 仅支持列表展示和删除，缺少新增用户、编辑用户信息（昵称/邮箱/头像/密码）、批量操作等核心功能，与 ProfileContent.vue 中定义的编辑能力未衔接
- p0 - 角色管理页面无增改功能 - `role.vue` 仅支持删除角色，缺少新增角色、编辑角色名称/描述/权限分配（绑定菜单权限）等核心功能，schema 中定义的四级角色体系无法在界面上完整操作
- p0 - 学生管理名为画布实为列表 - `my-student.vue` 标注为"自由画布"但实际仅实现列表展示，schema 中定义了 `x`、`y` 坐标字段，页面却未实现画布拖拽交互功能，功能与文档严重不符
- p1 - 文章富文本编辑缺失 - `article.vue` 文章内容编辑使用原生 `<textarea>`，无富文本编辑器（如 TipTap、Quill），无法支持标题层级、列表、代码块、图片等常见排版需求
- p1 - 网站设置页面缺少交互引导 - `setting.vue` 页面仅展示 Key-Value 列表，缺少设置项的描述说明、新增自定义 Key 的入口，且 Key 值保存前缺乏格式校验

### 无用和重复代码优化


