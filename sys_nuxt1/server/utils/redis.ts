/**
 * Redis 客户端单例
 *
 * 使用 ioredis 连接 Redis（127.0.0.1:6379），用于存储邮箱验证码及发送频率限制。
 */
import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

function createRedis() {
  const config = useRuntimeConfig()
  const url = config.redisUrl ?? process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'
  return new Redis(url, {
    maxRetriesPerRequest: 3,
  })
}

export const redis = globalForRedis.redis ?? createRedis()

redis.on('error', (err) => {
  console.error('[redis] 连接错误:', err.message)
})

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}
