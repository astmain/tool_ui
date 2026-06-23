/**
 * 认证 - 登录
 *
 * POST /api/auth/login
 * 请求体: { email, password, role?: "admin" }
 *
 * role="admin" 时：
 *   - 验证 role.key 以 ADMIN_ROLE_PREFIX 前缀判断是否有后台访问权限
 *   - 设置 admin_token cookie（type: "admin"）
 * 默认（前台用户）：
 *   - 设置 token cookie（type: "user"）
 */
import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { db } from '~/server/db'
import { user, userRole, role } from '~/server/db/schema'
import { signToken } from '~/server/utils/auth'
import { ADMIN_COOKIE_NAME, USER_COOKIE_NAME, ADMIN_ROLE_PREFIX } from '~/server/utils/constants'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role: roleType } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: '参数不完整' })
  }

  const [dbUser] = await db
    .select({
      id: user.id,
      nickname: user.nickname,
      password: user.password,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!dbUser) {
    throw createError({ statusCode: 401, message: '用户不存在' })
  }

  const valid = await bcrypt.compare(password, dbUser.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: '邮箱或密码错误' })
  }

  const roles = await db
    .select({ id: role.id, name: role.name, key: role.key })
    .from(role)
    .innerJoin(userRole, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, dbUser.id))

  const roleKeys = roles.map((r) => r.key)
  const roleIds = roles.map((r) => r.id)
  const maxAge = 7 * 24 * 60 * 60

  const isAdmin = roleType === 'admin'

  if (isAdmin) {
    const canLoginAdmin = roleKeys.some((key) => key.startsWith(ADMIN_ROLE_PREFIX))
    if (!canLoginAdmin) {
      throw createError({ statusCode: 403, message: '非管理员身份，无后台访问权限' })
    }

    const token = await signToken({ id: dbUser.id, type: 'admin', nickname: dbUser.nickname, roleKeys, roleIds })
    setCookie(event, ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    })
  } else {
    const token = await signToken({ id: dbUser.id, type: 'user', nickname: dbUser.nickname, roleKeys, roleIds })
    setCookie(event, USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    })
  }

  return { code: 200, message: '登录成功' }
})
