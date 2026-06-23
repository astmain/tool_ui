/** 允许登录中控后台的角色 key 前缀 */
export const ADMIN_ROLE_PREFIX = 'USER_ADMIN'

/** 默认注册用户角色 */
export const DEFAULT_USER_ROLE_KEY = 'USER_VIP1'

/** 前台用户 token cookie 名 */
export const USER_COOKIE_NAME = process.env.USER_COOKIE_NAME ?? 'token'

/** 管理员 token cookie 名 */
export const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? 'admin_token'

/** JWT 有效期（秒） */
export const JWT_EXPIRES_IN = 7 * 24 * 60 * 60 // 7 天
