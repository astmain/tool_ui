/**
 * 管理员 - 菜单管理 GET + POST
 *
 * GET    /api/admin/menu           - 获取所有菜单
 * POST   /api/admin/menu          - 创建菜单
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { menu, role, roleMenuPermission } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq, desc, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const method = event.method

  if (method === 'GET') {
    const menus = await db
      .select()
      .from(menu)
      .orderBy(asc(menu.group), desc(menu.orderNum), asc(menu.id))

    return { code: 200, data: menus }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { name, path, icon, orderNum, group, status } = body

    if (!name) throw createError({ statusCode: 400, message: '菜单名称不能为空' })
    if (!group) throw createError({ statusCode: 400, message: '菜单组不能为空' })

    const [created] = await db
      .insert(menu)
      .values({
        name,
        path: path || null,
        icon: icon || null,
        orderNum: orderNum ?? 0,
        group,
        status: status ?? true,
      })
      .returning()

    // 为 USER_ADMIN0 自动授权
    const [admin0] = await db
      .select({ id: role.id })
      .from(role)
      .where(eq(role.key, 'USER_ADMIN0'))
      .limit(1)

    if (admin0) {
      await db
        .insert(roleMenuPermission)
        .values({ roleId: admin0.id, menuId: created.id, canAccess: true })
        .onConflictDoNothing()
    }

    return { code: 200, data: created }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
