/**
 * 管理员 - 我的学生自由画布 API
 *
 * GET  /api/admin/my-student         - 获取所有学生
 * POST /api/admin/my-student         - 新增学生
 * PUT  /api/admin/my-student         - 更新学生（支持批量更新坐标）
 * DELETE /api/admin/my-student?id=   - 删除学生
 */
import { defineEventHandler, getQuery, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { student } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const method = event.method
  const query = getQuery(event)

  if (method === 'GET') {
    const students = await db.select().from(student).orderBy(student.id)
    return { code: 200, data: students }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { name, age, x = 0, y = 0 } = body

    if (!name || name.trim() === '') {
      throw createError({ statusCode: 400, message: '姓名不能为空' })
    }
    if (age === undefined || age === null || isNaN(Number(age))) {
      throw createError({ statusCode: 400, message: '年龄不能为空' })
    }

    const [created] = await db
      .insert(student)
      .values({
        name: name.trim(),
        age: Number(age),
        x: Number(x) || 0,
        y: Number(y) || 0,
      })
      .returning()

    return { code: 200, data: created, message: '新增成功' }
  }

  if (method === 'PUT') {
    const body = await readBody(event)

    // 批量更新坐标（事务保证原子性）
    if (Array.isArray(body.items)) {
      await db.transaction(
        body.items.map((item: any) =>
          db
            .update(student)
            .set({ x: Number(item.x), y: Number(item.y), updatedAt: new Date() })
            .where(eq(student.id, item.id)),
        ),
      )
      return { code: 200, message: '批量更新成功' }
    }

    // 单条更新
    const { id, name, age, x, y } = body
    if (!id) throw createError({ statusCode: 400, message: '缺少学生ID' })

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (age !== undefined) updateData.age = Number(age)
    if (x !== undefined) updateData.x = Number(x)
    if (y !== undefined) updateData.y = Number(y)
    updateData.updatedAt = new Date()

    const [updated] = await db
      .update(student)
      .set(updateData)
      .where(eq(student.id, Number(id)))
      .returning()

    if (!updated) throw createError({ statusCode: 404, message: '学生不存在' })
    return { code: 200, data: updated, message: '更新成功' }
  }

  if (method === 'DELETE') {
    const id = query.id
    if (!id) throw createError({ statusCode: 400, message: '缺少学生ID' })

    await db.delete(student).where(eq(student.id, Number(id)))
    return { code: 200, message: '删除成功' }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
