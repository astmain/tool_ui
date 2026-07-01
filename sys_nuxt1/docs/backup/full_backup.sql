-- ============================================================
-- PostgreSQL 数据库备份（2026年6月12日之前最新数据）
-- 北京时间 2026-06-12 00:00:00 之前（含）的记录
-- 备份时间: 2026-06-24T10:06:05.365Z
-- 数据库: mydb
-- ============================================================

-- ================================================================
-- 表: user (1 条)
-- ================================================================
INSERT INTO "user" ("id", "nickname", "email", "password", "avatar", "remark", "created_at", "updated_at") VALUES (1, 'admin0', '1311192345@qq.com', '$2a$10$Bf5Do.EzRChIu2CBy6Zkd.5qQUHbrDa.QjXtv5cLj2DepK141F3fS', 'http://103.119.2.223:3000/v1/files/get_one/0acfdba9ec731c77.jpg', 'system seed', '2026-06-11 21:00:34', '2026-06-24 06:49:32');

-- 表 article_info: 2026-06-12 之前无记录

-- 表 article_category: 2026-06-12 之前无记录

-- ================================================================
-- 表: menu (12 条)
-- ================================================================
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (1, 'UI设计', '/admin/ui-design', 'Design', 999, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (2, '文章管理', '/admin/article', 'File', 119, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (3, '用户列表', '/admin/user', 'User', 118, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (4, '网站设置', '/admin/setting', 'Setting', 117, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (5, '角色管理', '/admin/role', 'Team', 90, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (6, '菜单管理', '/admin/menu', 'Menu', 11, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (7, '菜单权限', '/admin/menu-permission', 'Lock', 11, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (8, '学生管理', '/admin/my-student', NULL, 2, 'admin', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (9, '首页', '/web', NULL, 100, 'web', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (10, '技术文章', '/web/article', NULL, 90, 'web', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (11, '一键商品图', '/web/product_img', NULL, 80, 'web', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "menu" ("id", "name", "path", "icon", "order_num", "group", "status", "created_at", "updated_at") VALUES (12, '会员中心', '/web/profile', NULL, 70, 'web', true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');

-- ================================================================
-- 表: role (4 条)
-- ================================================================
INSERT INTO "role" ("id", "name", "key", "description", "status", "order_num", "created_at", "updated_at") VALUES (1, '超级管理员', 'USER_ADMIN0', '超级管理员0-拥有admin-全部权限', true, 100, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role" ("id", "name", "key", "description", "status", "order_num", "created_at", "updated_at") VALUES (2, '管理员', 'USER_ADMIN1', '管理员1-拥有admin-部分权限', true, 90, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role" ("id", "name", "key", "description", "status", "order_num", "created_at", "updated_at") VALUES (3, '终身会员0', 'USER_VIP0', '超级会员0级-拥有web-全部权限', true, 50, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role" ("id", "name", "key", "description", "status", "order_num", "created_at", "updated_at") VALUES (4, '普通会员1', 'USER_VIP1', '普通会员-拥有web-部分权限', true, 10, '2026-06-11 20:59:56', '2026-06-11 20:59:56');

-- ================================================================
-- 表: role_menu_permission (12 条)
-- ================================================================
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (13, 2, 1, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (14, 2, 2, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (15, 2, 3, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (16, 2, 4, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (17, 2, 5, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (18, 2, 6, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (19, 2, 7, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (20, 2, 8, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (21, 3, 9, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (22, 3, 10, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (23, 3, 11, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');
INSERT INTO "role_menu_permission" ("id", "role_id", "menu_id", "can_access", "created_at", "updated_at") VALUES (24, 3, 12, true, '2026-06-11 20:59:56', '2026-06-11 20:59:56');

-- 表 user_role: 2026-06-12 之前无记录

-- 表 student: 2026-06-12 之前无记录

-- ================================================================
-- 表: setting (1 条)
-- ================================================================
INSERT INTO "setting" ("id", "key", "value") VALUES (1, 'my_student_canvas_settings', '{"color":"#e5e7eb","lineWidth":0.5,"cardStateColors":{"normal":"#e5e7eb","hover":"#38bdf8","selected":"#2563eb","resizing":"#f59e0b","group":"#0078d7","locked":"#cbd5e1"}}');

-- 备份完成，共 30 条记录