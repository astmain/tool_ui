/**
 * 管理员路由鉴权中间件
 *
 * 保护所有 /admin/* 路由（/admin/login 除外），验证 admin_token JWT。
 * 无效或缺失 token 时重定向到 /admin/login。
 */
import { getCookie, defineEventHandler, createError, sendRedirect } from 'h3'
import { verifyToken } from '~/server/utils/auth'
import { ADMIN_COOKIE_NAME, ADMIN_ROLE_PREFIX } from '~/server/utils/constants'

export default defineEventHandler(async (event) => {
  const url = event.path || ''
  if (!url.startsWith('/admin') || url === '/admin/login') return

  const token = getCookie(event, ADMIN_COOKIE_NAME)
  if (!token) {
    return sendRedirect(event, '/admin/login', 302)
  }

  const payload = await verifyToken(token)
  if (!payload || payload.type !== 'admin') {
    return sendRedirect(event, '/admin/login', 302)
  }

  if (!payload.roleKeys?.some((key: string) => key.startsWith(ADMIN_ROLE_PREFIX))) {
    return sendRedirect(event, '/admin/login', 302)
  }
})
