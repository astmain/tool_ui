/**
 * 管理员 - 角色菜单权限管理
 *
 * GET    /api/admin/role/:id/menu-permission - 获取某个角色的菜单权限
 *         ?showAll=true  返回全部菜单
 *         默认只返回 status=true 的菜单
 * PUT    /api/admin/role/:id/menu-permission - 批量更新某个角色的菜单权限
 */
import { defineEventHandler, getRouterParam, getQuery, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { menu, role, roleMenuPermission } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq, desc, asc, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const method = event.method
  const roleId = Number(getRouterParam(event, 'id'))

  if (!roleId) throw createError({ statusCode: 400, message: '缺少角色id' })

  const [roleRecord] = await db.select().from(role).where(eq(role.id, roleId)).limit(1)
  if (!roleRecord) throw createError({ statusCode: 404, message: '角色不存在' })

  if (method === 'GET') {
    const { showAll } = getQuery(event)
    const whereMenu = showAll === 'true' ? {} : eq(menu.status, true)

    const permissions = await db
      .select()
      .from(roleMenuPermission)
      .where(eq(roleMenuPermission.roleId, roleId))

    const allMenus = await db
      .select()
      .from(menu)
      .where(whereMenu)
      .orderBy(asc(menu.group), desc(menu.orderNum))

    const menusWithPermission = allMenus.map((m) => {
      const perm = permissions.find((p) => p.menuId === m.id)
      return {
        ...m,
        permission: { canAccess: perm ? perm.canAccess : false },
      }
    })

    return { code: 200, data: { role: roleRecord, permissions: menusWithPermission } }
  }

  if (method === 'PUT') {
    const { permissions } = await readBody(event)
    if (!Array.isArray(permissions)) {
      throw createError({ statusCode: 400, message: '权限数据格式错误' })
    }

    // 删除旧权限
    await db.delete(roleMenuPermission).where(eq(roleMenuPermission.roleId, roleId))

    // 插入新权限（只保留 canAccess=true 的记录）
    const createData = permissions
      .filter((p: any) => p.menuId && p.canAccess)
      .map((p: any) => ({
        roleId,
        menuId: p.menuId,
        canAccess: p.canAccess ?? false,
      }))

    if (createData.length > 0) {
      await db.insert(roleMenuPermission).values(createData)
    }

    return { code: 200, message: '权限更新成功' }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
