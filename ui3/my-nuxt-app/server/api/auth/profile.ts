/**
 * 认证 - 用户个人信息
 *
 * GET /api/auth/profile          - 通过请求头 cookie 中的 token 获取当前用户信息（前台用户）
 * PUT /api/auth/profile          - 修改当前用户的账户信息
 *    field="nickname" | "email" | "password" | "avatar"
 *    role="admin" 时使用 admin_token，修改管理员账户信息
 */
import { defineEventHandler, getCookie, readBody, setCookie, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { db } from '~/server/db'
import { user, userRole, role } from '~/server/db/schema'
import { verifyToken, signToken } from '~/server/utils/auth'
import { ADMIN_COOKIE_NAME } from '~/server/utils/constants'
import { redis } from '~/server/utils/redis'
import { eq } from 'drizzle-orm'

const userSelect = {
  id: user.id,
  nickname: user.nickname,
  email: user.email,
  avatar: user.avatar,
  remark: user.remark,
  createdAt: user.createdAt,
}

async function getCurrentUser(event: any, cookieName: string, expectedType: 'user' | 'admin') {
  const token = getCookie(event, cookieName)
  if (!token) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const payload = await verifyToken(token)
  if (!payload || payload.type !== expectedType) {
    throw createError({ statusCode: 401, message: '无效的 token' })
  }

  return payload
}

async function getUserWithRoles(event: any, cookieName: string, expectedType: 'user' | 'admin') {
  const payload = await getCurrentUser(event, cookieName, expectedType)

  const [dbUser] = await db
    .select(userSelect)
    .from(user)
    .where(eq(user.id, payload.id))
    .limit(1)

  if (!dbUser) {
    throw createError({ statusCode: 404, message: '用户不存在' })
  }

  const roles = await db
    .select({ id: role.id, name: role.name, key: role.key })
    .from(role)
    .innerJoin(userRole, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, payload.id))

  return { ...dbUser, roles }
}

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const payload = await getCurrentUser(event, 'token', 'user')
    const dbUser = await getUserWithRoles(event, 'token', 'user')
    return { code: 200, data: dbUser }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const { role: roleType, field, email, code } = body

    if (roleType === 'admin') {
      const payload = await getCurrentUser(event, ADMIN_COOKIE_NAME, 'admin')

      if (field !== 'avatar' && (!email || !code)) {
        throw createError({ statusCode: 400, message: '参数不完整' })
      }

      if (field !== 'avatar') {
        const stored = await redis.get(`admin:email:code:${email}`)
        if (!stored || stored !== code) {
          throw createError({ statusCode: 400, message: '验证码错误或已过期' })
        }
        await redis.del(`admin:email:code:${email}`)
      }

      switch (field) {
        case 'nickname':
          return handleUpdateNickname(event, body, payload.id)
        case 'email':
          return handleUpdateEmail(event, body, payload)
        case 'password':
          return handleUpdatePassword(event, body, payload.id)
        case 'avatar':
          return handleUpdateAvatar(event, body, payload.id)
        default:
          throw createError({ statusCode: 400, message: '无效的 field' })
      }
    }

    throw createError({ statusCode: 400, message: '暂不支持该操作' })
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})

async function handleUpdateNickname(event: any, body: any, userId: number) {
  const { nickname } = body
  if (!nickname) {
    throw createError({ statusCode: 400, message: '昵称不能为空' })
  }

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.nickname, nickname))
    .limit(1)
  if (existing) {
    throw createError({ statusCode: 400, message: '该用户名已存在' })
  }

  const [updated] = await db
    .update(user)
    .set({ nickname, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning({ id: user.id, nickname: user.nickname, email: user.email })

  return { code: 200, message: '昵称修改成功', data: updated }
}

async function handleUpdateEmail(event: any, body: any, payload: any) {
  const { newEmail } = body
  if (!newEmail || !newEmail.includes('@')) {
    throw createError({ statusCode: 400, message: '无效的新邮箱地址' })
  }

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, newEmail))
    .limit(1)
  if (existing) {
    throw createError({ statusCode: 400, message: '该邮箱已被注册' })
  }

  const [updated] = await db
    .update(user)
    .set({ email: newEmail, updatedAt: new Date() })
    .where(eq(user.id, payload.id))
    .returning({ id: user.id, nickname: user.nickname, email: user.email })

  const roles = await db
    .select({ id: role.id, key: role.key })
    .from(role)
    .innerJoin(userRole, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, payload.id))

  const roleKeys = roles.map((r) => r.key)
  const roleIds = roles.map((r) => r.id)

  const newToken = await signToken({
    id: updated.id,
    type: 'admin',
    nickname: updated.nickname,
    roleKeys,
    roleIds,
  })

  setCookie(event, ADMIN_COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return { code: 200, message: '邮箱修改成功', data: updated }
}

async function handleUpdatePassword(event: any, body: any, userId: number) {
  const { newPassword } = body
  if (!newPassword || newPassword.length < 6) {
    throw createError({ statusCode: 400, message: '新密码长度不能少于6位' })
  }

  const hashed = await bcrypt.hash(newPassword, 10)
  await db.update(user).set({ password: hashed, updatedAt: new Date() }).where(eq(user.id, userId))

  return { code: 200, message: '密码修改成功' }
}

async function handleUpdateAvatar(event: any, body: any, userId: number) {
  const { avatar } = body
  if (!avatar || typeof avatar !== 'string') {
    throw createError({ statusCode: 400, message: '头像 URL 无效' })
  }

  const [updated] = await db
    .update(user)
    .set({ avatar, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning({ id: user.id, nickname: user.nickname, avatar: user.avatar })

  return { code: 200, message: '头像修改成功', data: updated }
}
