/**
 * JWT 认证工具
 *
 * 使用 jose 库签发和验证 JWT token，有效期 7 天。
 * - 前台用户登录后签发 type="user" 的 token，cookie 名 token
 * - 管理员登录后签发 type="admin" 的 token，cookie 名 admin_token
 *
 * 安全: JWT_SECRET 必须通过环境变量配置，不存在 fallback。
 */
import { SignJWT, jwtVerify } from 'jose'
import { ADMIN_COOKIE_NAME, USER_COOKIE_NAME, JWT_EXPIRES_IN } from './constants'

const config = useRuntimeConfig()
const jwtSecret = config.jwtSecret ?? process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('[auth] 环境变量 JWT_SECRET 未配置，请设置后再启动服务')
}

function getSecretKey() {
  return new TextEncoder().encode(jwtSecret)
}

export interface JwtPayload {
  id: number
  type: 'user' | 'admin'
  nickname: string
  roleKeys: string[]
  roleIds: number[]
}

export async function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  const secretKey = getSecretKey()
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRES_IN}s`)
    .sign(secretKey)
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  const secretKey = getSecretKey()
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}
