/**
 * 前台 - 用户注册
 *
 * POST /api/auth/register
 * 请求体: { email, code, nickname, password }
 *
 * 流程: 校验验证码 -> 检查邮箱/用户名是否已存在 -> bcrypt 加密密码 -> 创建用户 -> 签发 token。
 * 安全: Token 通过 Set-Cookie 写入 HttpOnly cookie，防止 XSS 攻击窃取。
 */
import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { db } from '~/server/db'
import { user, userRole, role } from '~/server/db/schema'
import { signToken } from '~/server/utils/auth'
import { USER_COOKIE_NAME } from '~/server/utils/constants'
import { redis } from '~/server/utils/redis'
import { eq } from 'drizzle-orm'
import { DEFAULT_USER_ROLE_KEY } from '~/server/utils/constants'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, code, nickname, password } = body

  if (!email || !code || !nickname || !password) {
    throw createError({ statusCode: 400, message: '参数不完整' })
  }

  const stored = await redis.get(`email:code:${email}`)
  if (!stored || stored !== code) {
    throw createError({ statusCode: 400, message: '验证码错误或已过期' })
  }
  await redis.del(`email:code:${email}`)

  const [existingEmail] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)
  if (existingEmail) {
    throw createError({ statusCode: 400, message: '该邮箱已注册' })
  }

  const [existingNickname] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.nickname, nickname))
    .limit(1)
  if (existingNickname) {
    throw createError({ statusCode: 400, message: '该用户名已存在' })
  }

  const hashed = await bcrypt.hash(password, 10)

  const [defaultRole] = await db
    .select({ id: role.id, key: role.key })
    .from(role)
    .where(eq(role.key, DEFAULT_USER_ROLE_KEY))
    .limit(1)

  if (!defaultRole) {
    throw createError({ statusCode: 500, message: '默认角色不存在' })
  }

  const [newUser] = await db
    .insert(user)
    .values({ email, nickname, password: hashed })
    .returning({ id: user.id, nickname: user.nickname })

  await db.insert(userRole).values({ userId: newUser.id, roleId: defaultRole.id })

  const token = await signToken({
    id: newUser.id,
    type: 'user',
    nickname: newUser.nickname,
    roleKeys: [defaultRole.key],
    roleIds: [defaultRole.id],
  })

  setCookie(event, USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return { code: 200, message: '注册成功' }
})
