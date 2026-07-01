/**
 * 管理员鉴权装饰器
 *
 * 检查请求中的 admin_token cookie，验证身份。
 * 验证通过后返回 payload，失败则抛出 401/403 错误。
 */
import { getCookie, createError } from 'h3'
import { verifyToken } from './auth'
import { ADMIN_COOKIE_NAME, ADMIN_ROLE_PREFIX } from './constants'

export async function requireAdmin(event: any) {
  const token = getCookie(event, ADMIN_COOKIE_NAME)
  if (!token) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const payload = await verifyToken(token)
  if (!payload || payload.type !== 'admin') {
    throw createError({ statusCode: 401, message: '无效的 token' })
  }

  if (!payload.roleKeys.some((key: string) => key.startsWith(ADMIN_ROLE_PREFIX))) {
    throw createError({ statusCode: 403, message: '无后台访问权限' })
  }

  return payload
}
