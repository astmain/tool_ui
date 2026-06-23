/**
 * 认证 - 发送邮箱验证码
 *
 * POST /api/auth/send-code
 * 请求体: { email: string, purpose?: "auth" | "admin" }
 *
 * purpose="auth"   - 前台用户注册/登录等（Redis key: email:code:）
 * purpose="admin"  - 管理员修改邮箱等（Redis key: admin:email:code:）
 *
 * 防抖: 同一邮箱 60 秒内只能发送一次
 * 验证码存入 Redis（TTL: 5 分钟）
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { redis } from '~/server/utils/redis'
import { sendEmailCode, generateCode } from '~/server/utils/email_code'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, purpose } = body

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, message: '无效的邮箱地址' })
  }

  const isAdmin = purpose === 'admin'
  const prefix = isAdmin ? 'admin:email:' : ''
  const keyLimit = `${prefix}email:send:limit:${email}`

  const blocked = await redis.get(keyLimit)
  if (blocked) {
    throw createError({ statusCode: 429, message: '发送过于频繁，请60秒后再试' })
  }

  const code = generateCode()
  await redis.setex(`${prefix}email:code:${email}`, 300, code)
  await redis.setex(keyLimit, 60, '1')

  await sendEmailCode(email, code)

  return { code: 200, message: '验证码已发送' }
})
