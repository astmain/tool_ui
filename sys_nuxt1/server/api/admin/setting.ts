/**
 * 管理员 - 网站设置 + 数据库备份
 *
 * GET  /api/admin/setting              - 获取所有设置（返回 key-value 对象）
 * GET  /api/admin/setting?resource=backup  - 导出数据库备份 SQL 文件
 * GET  /api/admin/setting?resource=dbinfo  - 获取数据库连接信息（密码脱敏）
 * PUT  /api/admin/setting             - 更新设置（key-value）
 */
import { getQuery, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { setting, user, role, menu, articleCategory, articleInfo, userRole, roleMenuPermission, student } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq } from 'drizzle-orm'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

export default defineApiEventHandler('admin.setting', async (event) => {
  const method = event.method
  const query = getQuery(event)

  if (method === 'GET') {
    await requireAdmin(event)
    if (query.resource === 'backup') {
      return handleBackup(event)
    }
    if (query.resource === 'dbinfo') {
      return handleDbInfo(event)
    }

    const settings = await db.select().from(setting)
    const data: Record<string, string> = {}
    for (const s of settings) {
      data[s.key] = s.value
    }
    return { code: 200, data }
  }

  if (method === 'PUT') {
    await requireAdmin(event)

    const body = await readBody(event)
    const { key, value } = body

    if (!key || value === undefined) {
      throw createError({ statusCode: 400, message: 'key 和 value 不能为空' })
    }
    if (key.length > 50 || String(value).length > 255) {
      throw createError({ statusCode: 400, message: '参数长度超出限制（key≤50，value≤255）' })
    }

    const existing = await db.select().from(setting).where(eq(setting.key, key)).limit(1)

    if (existing.length > 0) {
      const [updated] = await db
        .update(setting)
        .set({ value })
        .where(eq(setting.key, key))
        .returning()
      return { code: 200, data: updated }
    } else {
      const [created] = await db.insert(setting).values({ key, value }).returning()
      return { code: 200, data: created }
    }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})

// ===================== 数据库信息 =====================
function handleDbInfo() {
  const raw = process.env.DATABASE_URL ?? ''
  const masked = raw.replace(/\/\/([^:]+):([^@]+)@/, (_match, user) => `//${user}:***@`)
  return { code: 200, data: { url: masked } }
}

// ===================== 数据库备份 =====================

function valueToSql(value: unknown): string {
  if (value === null) return 'NULL'
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  if (typeof value === 'number') return String(value)
  if (value instanceof Date) return `'${value.toISOString()}'`
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`
  }
  return `'${JSON.stringify(value).replace(/'/g, "''")}'`
}

async function handleBackup(event: any) {
  const payload = await requireAdmin(event)

  const lines: string[] = []
  lines.push('-- ============================================================')
  lines.push('-- 数据库备份文件')
  lines.push(`-- 备份时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`)
  lines.push(`-- 操作用户: ${payload.nickname}`)
  lines.push('-- ============================================================')
  lines.push('')
  lines.push('BEGIN;')
  lines.push('')

  const modelDefs: Array<{ table: string; select: any; skip?: boolean }> = [
    { table: 'role', select: db.select().from(role) },
    { table: 'menu', select: db.select().from(menu) },
    { table: 'user', select: db.select().from(user) },
    { table: 'setting', select: db.select().from(setting) },
    { table: 'article_category', select: db.select().from(articleCategory) },
    { table: 'article_info', select: db.select().from(articleInfo) },
    { table: 'student', select: db.select().from(student) },
    { table: 'user_role', select: db.select().from(userRole) },
    { table: 'role_menu_permission', select: db.select().from(roleMenuPermission) },
  ]

  for (const def of modelDefs) {
    const rows = await def.select
    lines.push(`-- 表: ${def.table}`)
    lines.push(`TRUNCATE TABLE "${def.table}" RESTART IDENTITY CASCADE;`)

    if (rows.length > 0) {
      const firstRow = rows[0] as Record<string, unknown>
      const columns = Object.keys(firstRow)
      for (const row of rows as Record<string, unknown>[]) {
        const values = columns.map((col) => valueToSql(row[col]))
        lines.push(`INSERT INTO "${def.table}" ("${columns.join('", "')}") VALUES (${values.join(', ')});`)
      }
    }
    lines.push('')
  }

  lines.push('COMMIT;')
  lines.push('-- 备份完成')

  const sqlContent = lines.join('\n')
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')

  event.node.res.setHeader('Content-Type', 'application/sql; charset=utf-8')
  event.node.res.setHeader('Content-Disposition', `attachment; filename="backup-${timestamp}.sql"`)
  return sqlContent
}
