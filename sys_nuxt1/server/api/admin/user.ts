/**
 * 管理员 - 用户管理 CRUD + 当前管理员信息
 *
 * GET  /api/admin/user          - 获取当前管理员信息（需 admin_token，参数 self=1）
 * GET  /api/admin/user?self=   - 获取所有用户列表（参数 self 任意值则返回当前管理员信息）
 * POST   /api/admin/user         - 创建用户
 * PUT    /api/admin/user         - 更新用户（角色、描述）
 * DELETE /api/admin/user?id=     - 删除用户
 */
import { getQuery, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { db } from '~/server/db'
import { user, userRole, role } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq, inArray } from 'drizzle-orm'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

const userSelectBase = {
  id: user.id,
  nickname: user.nickname,
  email: user.email,
  avatar: user.avatar,
  remark: user.remark,
  createdAt: user.createdAt,
}

async function getUserWithRoles(where: any) {
  const [dbUser] = await db
    .select(userSelectBase)
    .from(user)
    .where(where)
    .limit(1)

  if (!dbUser) return null

  const roles = await db
    .select({ id: role.id, name: role.name, key: role.key })
    .from(role)
    .innerJoin(userRole, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, dbUser.id))

  return { ...dbUser, roles }
}

function getDbErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined

  const dbErr = err as {
    code?: string
    cause?: { code?: string }
  }
  return dbErr.code ?? dbErr.cause?.code
}

export default defineApiEventHandler('admin.user', async (event) => {
  await requireAdmin(event)

  const method = event.method
  const query = getQuery(event)
  const body = method !== 'GET' && method !== 'DELETE' ? await readBody(event).catch(() => ({})) : {}

  if (method === 'GET') {
    if (query.self !== undefined) {
      const payload = await requireAdmin(event)
      const admin = await getUserWithRoles(eq(user.id, payload.id))
      if (!admin) throw createError({ statusCode: 404, message: '用户不存在' })
      return { code: 200, data: admin }
    }
    const users = await db.select(userSelectBase).from(user).orderBy(user.createdAt)
    const userIds = users.map(u => u.id)
    const allUserRoles = userIds.length
      ? await db
          .select({ userId: userRole.userId, id: role.id, name: role.name, key: role.key })
          .from(userRole)
          .innerJoin(role, eq(userRole.roleId, role.id))
          .where(inArray(userRole.userId, userIds))
      : []
    const roleMap = new Map<number, { id: number; name: string; key: string }[]>()
    for (const ur of allUserRoles) {
      if (!roleMap.has(ur.userId)) roleMap.set(ur.userId, [])
      roleMap.get(ur.userId)!.push({ id: ur.id, name: ur.name, key: ur.key })
    }
    const result = users.map(u => ({ ...u, roles: roleMap.get(u.id) ?? [] }))
    return { code: 200, data: result }
  }

  if (method === 'POST') {
    const { nickname, email, password, roleIds, remark } = body

    if (!nickname || !email || !password || !roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
      throw createError({ statusCode: 400, message: '参数不完整或 roleIds 格式错误' })
    }

    const roleRecords = await db.select({ id: role.id }).from(role).where(inArray(role.id, roleIds))
    if (roleRecords.length !== roleIds.length) {
      throw createError({ statusCode: 400, message: '部分角色不存在' })
    }

    const hashed = await bcrypt.hash(password, 10)

    try {
      const [newUser] = await db
        .insert(user)
        .values({ nickname, email, password: hashed, remark, updatedAt: new Date() })
        .returning({ id: user.id, nickname: user.nickname, email: user.email, avatar: user.avatar, remark: user.remark })

      await db.insert(userRole).values(roleIds.map((rid: number) => ({ userId: newUser.id, roleId: rid })))

      return { code: 200, data: newUser }
    } catch (err: unknown) {
      if (getDbErrorCode(err) === '23505') {
        throw createError({ statusCode: 400, message: '用户名或邮箱已存在' })
      }
      if (getDbErrorCode(err) === '23502') {
        throw createError({ statusCode: 500, message: '用户数据缺少必填字段' })
      }
      throw createError({ statusCode: 500, message: '服务器异常' })
    }
  }

  if (method === 'PUT') {
    const { id, nickname, email, roleIds, remark } = body
    if (!id) throw createError({ statusCode: 400, message: '缺少id' })

    if (roleIds !== undefined) {
      if (!Array.isArray(roleIds) || roleIds.length === 0) {
        throw createError({ statusCode: 400, message: 'roleIds 必须为非空数组' })
      }
      const roleRecords = await db.select({ id: role.id }).from(role).where(inArray(role.id, roleIds))
      if (roleRecords.length !== roleIds.length) {
        throw createError({ statusCode: 400, message: '部分角色不存在' })
      }
    }

    try {
      await db
        .update(user)
        .set({
          ...(nickname !== undefined && { nickname }),
          ...(email !== undefined && { email }),
          ...(remark !== undefined && { remark: remark || null }),
          updatedAt: new Date(),
        })
        .where(eq(user.id, id))

      if (roleIds !== undefined) {
        await db.delete(userRole).where(eq(userRole.userId, id))
        await db.insert(userRole).values(roleIds.map((rid: number) => ({ userId: id, roleId: rid })))
      }
    } catch (err: unknown) {
      if (getDbErrorCode(err) === '23505') {
        throw createError({ statusCode: 400, message: '用户名或邮箱已存在' })
      }
      throw createError({ statusCode: 500, message: '服务器异常' })
    }

    const updated = await getUserWithRoles(eq(user.id, id))
    return { code: 200, data: updated }
  }

  if (method === 'DELETE') {
    const id = Number(query.id)
    if (!id) throw createError({ statusCode: 400, message: '缺少id' })

    try {
      await db.delete(user).where(eq(user.id, id))
      return { code: 200, message: '删除成功' }
    } catch (err: any) {
      if (err?.code === '22P02') {
        throw createError({ statusCode: 404, message: '用户不存在' })
      }
      throw createError({ statusCode: 500, message: '服务器异常' })
    }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
