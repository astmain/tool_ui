/**
 * 管理员 - 我的学生自由画布 API
 *
 * GET  /api/admin/my-student         - 获取所有学生
 * POST /api/admin/my-student         - 新增学生
 * PUT  /api/admin/my-student         - 更新学生（支持批量更新坐标）
 * DELETE /api/admin/my-student?id=   - 删除学生
 */
import { getQuery, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { student } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq } from 'drizzle-orm'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

function getDbErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined

  const dbErr = err as {
    code?: string
    cause?: { code?: string }
  }
  return dbErr.code ?? dbErr.cause?.code
}

async function syncStudentIdSequence() {
  await db.execute(
    `select setval(pg_get_serial_sequence('"student"', 'id'), (select coalesce(max(id), 1) from "student"), true)`,
  )
}

function normalizeGroupName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

async function createStudent(data: { name: string; age: number; x: number; y: number; groupName?: string | null }) {
  const now = new Date()
  const [created] = await db
    .insert(student)
    .values({
      name: data.name,
      age: data.age,
      x: data.x,
      y: data.y,
      groupName: data.groupName ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return created
}

export default defineApiEventHandler('admin.myStudent', async (event) => {
  await requireAdmin(event)
  const method = event.method
  const query = getQuery(event)

  if (method === 'GET') {
    const students = await db.select().from(student).orderBy(student.id)
    return { code: 200, data: students }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { name, age, x = 0, y = 0, groupName = null } = body

    if (!name || name.trim() === '') {
      throw createError({ statusCode: 400, message: '姓名不能为空' })
    }
    if (age === undefined || age === null || isNaN(Number(age))) {
      throw createError({ statusCode: 400, message: '年龄不能为空' })
    }

    let created
    try {
      created = await createStudent({
        name: name.trim(),
        age: Number(age),
        x: Number(x) || 0,
        y: Number(y) || 0,
        groupName: normalizeGroupName(groupName),
      })
    } catch (err: unknown) {
      if (getDbErrorCode(err) !== '23505') throw err
      await syncStudentIdSequence()
      created = await createStudent({
        name: name.trim(),
        age: Number(age),
        x: Number(x) || 0,
        y: Number(y) || 0,
        groupName: normalizeGroupName(groupName),
      })
    }

    return { code: 200, data: created, message: '新增成功' }
  }

  if (method === 'PUT') {
    const body = await readBody(event)

    // 批量更新坐标（事务保证原子性）
    if (Array.isArray(body.items)) {
      const now = new Date()
      await db.transaction(async (tx) => {
        for (const item of body.items) {
          await tx
            .update(student)
            .set({
              x: Number(item.x),
              y: Number(item.y),
              ...('groupName' in item ? { groupName: normalizeGroupName(item.groupName) } : {}),
              updatedAt: now,
            })
            .where(eq(student.id, Number(item.id)))
        }
      })
      return { code: 200, message: '批量更新成功' }
    }

    // 单条更新
    const { id, name, age, x, y, groupName } = body
    const studentId = Number(id)
    if (!studentId) throw createError({ statusCode: 400, message: '缺少学生ID' })

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (age !== undefined) updateData.age = Number(age)
    if (x !== undefined) updateData.x = Number(x)
    if (y !== undefined) updateData.y = Number(y)
    if (groupName !== undefined) updateData.groupName = normalizeGroupName(groupName)
    updateData.updatedAt = new Date()

    const [updated] = await db
      .update(student)
      .set(updateData)
      .where(eq(student.id, studentId))
      .returning()

    if (!updated) throw createError({ statusCode: 404, message: '学生不存在' })
    return { code: 200, data: updated, message: '更新成功' }
  }

  if (method === 'DELETE') {
    const studentId = Number(query.id)
    if (!studentId) throw createError({ statusCode: 400, message: '缺少学生ID' })

    await db.delete(student).where(eq(student.id, studentId))
    return { code: 200, message: '删除成功' }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
