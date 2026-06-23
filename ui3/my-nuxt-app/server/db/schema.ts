import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  real,
  timestamp,
  unique,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================
// 角色表
// key 字段用于程序中判断权限等级:
//   USER_ADMIN0  管理员0级-拥有全部权限-超级权限（零表示超级权限）
//   USER_ADMIN1  管理员1级-拥有部分权限
//   USER_VIP0    会员0级-终身超级用户-拥有超级用户权限
//   USER_VIP1    会员1级-默认注册用户-拥有部分权限
// ============================================================
export const role = pgTable('role', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  key: varchar('key', { length: 30 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  status: boolean('status').default(true).notNull(),
  orderNum: integer('order_num').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// 菜单表（扁平结构，按 group 分组展示）
// group: "admin"=后台中控菜单, "web"=前台会员菜单
// 所有菜单均为一级菜单，无父子层级关系
// ============================================================
export const menu = pgTable('menu', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  path: varchar('path', { length: 200 }),
  icon: varchar('icon', { length: 100 }),
  orderNum: integer('order_num').default(0).notNull(),
  group: varchar('group', { length: 20 }).default('admin').notNull(),
  status: boolean('status').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// 角色菜单权限表（每个角色对每个菜单的访问权限）
// canAccess: 该角色是否能访问此菜单（用于菜单显示/隐藏）
// ============================================================
export const roleMenuPermission = pgTable(
  'role_menu_permission',
  {
    id: serial('id').primaryKey(),
    roleId: integer('role_id').notNull(),
    menuId: integer('menu_id').notNull(),
    canAccess: boolean('can_access').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    uniq: unique().on(table.roleId, table.menuId),
  }),
)

// ============================================================
// 用户角色关联表（用户-角色多对多）
// ============================================================
export const userRole = pgTable(
  'user_role',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    roleId: integer('role_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniq: unique().on(table.userId, table.roleId),
  }),
)

// ============================================================
// 用户表（统一管理所有用户）
// ============================================================
export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  nickname: varchar('nickname', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  remark: varchar('remark', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// 网站设置表（key-value 键值对）
// ============================================================
export const setting = pgTable('setting', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).notNull().unique(),
  value: varchar('value', { length: 255 }).notNull(),
})

// ============================================================
// 文章分类表
// sort 字段控制排序，数字越大越靠前
// ============================================================
export const articleCategory = pgTable('article_category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  sort: integer('sort').default(0).notNull(),
  remark: varchar('remark', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================
// 学生表（自由画布用）
// name: 姓名
// age: 年龄
// x, y: 画布坐标
// ============================================================
export const student = pgTable('student', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  age: integer('age').notNull(),
  x: real('x').default(0).notNull(),
  y: real('y').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// 文章表
// deleted 字段实现逻辑删除，true=已删除
// ============================================================
export const articleInfo = pgTable('article_info', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  sort: integer('sort').default(0).notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  categoryId: integer('category_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// 关系定义
// ============================================================
export const roleRelations = relations(role, ({ many }) => ({
  userRoles: many(userRole),
  menuPermissions: many(roleMenuPermission),
}))

export const userRelations = relations(user, ({ many }) => ({
  userRoles: many(userRole),
}))

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, { fields: [userRole.userId], references: [user.id] }),
  role: one(role, { fields: [userRole.roleId], references: [role.id] }),
}))

export const menuRelations = relations(menu, ({ many }) => ({
  rolePermissions: many(roleMenuPermission),
}))

export const roleMenuPermissionRelations = relations(roleMenuPermission, ({ one }) => ({
  role: one(role, { fields: [roleMenuPermission.roleId], references: [role.id] }),
  menu: one(menu, { fields: [roleMenuPermission.menuId], references: [menu.id] }),
}))

export const articleCategoryRelations = relations(articleCategory, ({ many }) => ({
  articles: many(articleInfo),
}))

export const articleInfoRelations = relations(articleInfo, ({ one }) => ({
  category: one(articleCategory, { fields: [articleInfo.categoryId], references: [articleCategory.id] }),
}))
