/**
 * 前台 - 获取网站设置
 *
 * GET /api/web/setting
 * 返回所有 key-value 设置项
 */
import { defineEventHandler } from 'h3'
import { db } from '~/server/db'
import { setting } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const settings = await db.select().from(setting)
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return { code: 200, data: map }
})
