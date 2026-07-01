/**
 * 认证 - 退出登录
 *
 * POST /api/auth/logout
 * 请求体: { role?: "admin" }
 *
 * role="admin" 时：清除 admin_token cookie
 * 默认（前台用户）：清除 token cookie
 */
import { readBody, setCookie, createError } from 'h3'
import { ADMIN_COOKIE_NAME, USER_COOKIE_NAME } from '~/server/utils/constants'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

export default defineApiEventHandler('auth.logout', async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const isAdmin = body?.role === 'admin'

  if (isAdmin) {
    setCookie(event, ADMIN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  } else {
    setCookie(event, USER_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  }

  return { code: 200, message: '已退出登录' }
})
