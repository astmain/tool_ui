/**
 * 管理员 - 角色管理 CRUD
 *
 * GET    /api/admin/role         - 获取所有角色
 * POST   /api/admin/role        - 创建角色
 * PUT    /api/admin/role?id=    - 编辑角色
 * DELETE /api/admin/role?id=    - 删除角色
 */
import { getQuery, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { role, userRole } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq, inArray, sql, desc } from 'drizzle-orm'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

function getDbErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined

  const dbErr = err as {
    code?: string
    cause?: { code?: string }
  }
  return dbErr.code ?? dbErr.cause?.code
}

export default defineApiEventHandler('admin.role', async (event) => {
  await requireAdmin(event)
  const method = event.method
  const query = getQuery(event) as Record<string, any>

  if (method === 'GET') {
    const roles = await db
      .select({
        id: role.id,
        name: role.name,
        key: role.key,
        description: role.description,
        status: role.status,
        orderNum: role.orderNum,
        createdAt: role.createdAt,
      })
      .from(role)
      .orderBy(desc(role.orderNum))

    const roleIds = roles.map(r => r.id)
    const counts = roleIds.length
      ? await db
          .select({ roleId: userRole.roleId, count: sql<number>`count(*)` })
          .from(userRole)
          .where(inArray(userRole.roleId, roleIds))
          .groupBy(userRole.roleId)
      : []
    const countMap = new Map(counts.map(c => [c.roleId, Number(c.count)]))
    const result = roles.map(r => ({ ...r, _count: { users: countMap.get(r.id) ?? 0 } }))

    return { code: 200, data: result }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { name, key, description, status, orderNum } = body

    if (!name || !key) {
      throw createError({ statusCode: 400, message: '角色名称和标识不能为空' })
    }

    try {
      const [created] = await db
        .insert(role)
        .values({
          name,
          key: key.toUpperCase(),
          description,
          status: status ?? true,
          orderNum: orderNum ?? 0,
          updatedAt: new Date(),
        })
        .returning()

      return { code: 200, data: created }
    } catch (err: unknown) {
      if (getDbErrorCode(err) === '23505') {
        throw createError({ statusCode: 400, message: '角色标识已存在' })
      }
      if (getDbErrorCode(err) === '23502') {
        throw createError({ statusCode: 500, message: '角色数据缺少必填字段' })
      }
      throw createError({ statusCode: 500, message: '服务器异常' })
    }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const { id, name, key, description, status, orderNum } = body
    const roleId = Number(id ?? query.id)

    if (!roleId) throw createError({ statusCode: 400, message: '缺少id' })

    try {
      const [updated] = await db
        .update(role)
        .set({
          ...(name !== undefined && { name }),
          ...(key !== undefined && { key: key.toUpperCase() }),
          ...(description !== undefined && { description }),
          ...(status !== undefined && { status }),
          ...(orderNum !== undefined && { orderNum }),
          updatedAt: new Date(),
        })
        .where(eq(role.id, roleId))
        .returning()

      if (!updated) throw createError({ statusCode: 404, message: '角色不存在' })
      return { code: 200, data: updated }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'statusCode' in err) throw err
      if (getDbErrorCode(err) === '23505') {
        throw createError({ statusCode: 400, message: '角色标识已存在' })
      }
      throw createError({ statusCode: 500, message: '服务器异常' })
    }
  }

  if (method === 'DELETE') {
    const { id } = getQuery(event) as Record<string, any>
    if (!id) throw createError({ statusCode: 400, message: '缺少id' })

    try {
      await db.delete(role).where(eq(role.id, Number(id)))
      return { code: 200, message: '删除成功' }
    } catch (err: any) {
      if (err?.code === '23503') {
        throw createError({ statusCode: 400, message: '该角色有关联数据，无法删除' })
      }
      throw createError({ statusCode: 500, message: '服务器异常' })
    }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
