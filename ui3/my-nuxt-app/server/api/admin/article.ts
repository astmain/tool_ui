/**
 * 管理员 - 文章管理 CRUD
 *
 * GET    /api/admin/article          - 获取文章列表
 * POST   /api/admin/article          - 发布文章，或创建分类（resource: "category"）
 * PUT    /api/admin/article          - 更新文章，或更新分类
 * DELETE /api/admin/article?id=      - 逻辑删除文章，或删除分类
 */
import { defineEventHandler, getQuery, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { articleInfo, articleCategory } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq, and, desc } from 'drizzle-orm'

async function getArticleCategories() {
  return db
    .select({
      id: articleCategory.id,
      name: articleCategory.name,
      sort: articleCategory.sort,
      remark: articleCategory.remark,
      createdAt: articleCategory.createdAt,
    })
    .from(articleCategory)
    .orderBy(desc(articleCategory.sort))
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const method = event.method
  const query = getQuery(event) as Record<string, any>

  if (method === 'GET') {
    if (query.resource === 'category') {
      const categories = await getArticleCategories()
      return { code: 200, data: categories }
    }

    const categoryId = query.categoryId ? Number(query.categoryId) : undefined
    const conditions = [eq(articleInfo.deleted, false)]
    if (categoryId) conditions.push(eq(articleInfo.categoryId, categoryId))
    const where = conditions.length === 1 ? conditions[0] : and(...conditions)

    const articles = await db
      .select({
        id: articleInfo.id,
        title: articleInfo.title,
        content: articleInfo.content,
        sort: articleInfo.sort,
        categoryId: articleInfo.categoryId,
        createdAt: articleInfo.createdAt,
        category: {
          id: articleCategory.id,
          name: articleCategory.name,
        },
      })
      .from(articleInfo)
      .leftJoin(articleCategory, eq(articleInfo.categoryId, articleCategory.id))
      .where(where)
      .orderBy(desc(articleInfo.sort), desc(articleInfo.createdAt))

    return { code: 200, data: articles }
  }

  if (method === 'POST') {
    const body = await readBody(event)

    if (body.resource === 'category') {
      const { name, sort, remark } = body
      if (!name) throw createError({ statusCode: 400, message: '分类名称不能为空' })

      try {
        const [created] = await db
          .insert(articleCategory)
          .values({ name, sort: sort ?? 0, remark: remark ?? null })
          .returning()
        return { code: 200, data: created }
      } catch (err: any) {
        if (err?.code === '23505') throw createError({ statusCode: 400, message: '分类名称已存在' })
        throw createError({ statusCode: 500, message: '服务器异常' })
      }
    }

    const { title, content, categoryId, sort } = body
    if (!title || !content || !categoryId) {
      throw createError({ statusCode: 400, message: '标题、内容、分类不能为空' })
    }

    const [created] = await db
      .insert(articleInfo)
      .values({ title, content, categoryId: Number(categoryId), sort: sort ?? 0 })
      .returning()

    return { code: 200, data: created }
  }

  if (method === 'PUT') {
    const body = await readBody(event)

    if (body.resource === 'category') {
      const { id, name, sort, remark } = body
      if (!id) throw createError({ statusCode: 400, message: '缺少id' })

      const [updated] = await db
        .update(articleCategory)
        .set({
          ...(name !== undefined && { name }),
          ...(sort !== undefined && { sort }),
          ...(remark !== undefined && { remark }),
        })
        .where(eq(articleCategory.id, id))
        .returning()

      if (!updated) throw createError({ statusCode: 404, message: '分类不存在' })
      return { code: 200, data: updated }
    }

    const { id, title, content, categoryId, sort } = body
    if (!id) throw createError({ statusCode: 400, message: '缺少id' })

    const [updated] = await db
      .update(articleInfo)
      .set({
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
        ...(sort !== undefined && { sort }),
        updatedAt: new Date(),
      })
      .where(eq(articleInfo.id, id))
      .returning()

    if (!updated) throw createError({ statusCode: 404, message: '文章不存在' })
    return { code: 200, data: updated }
  }

  if (method === 'DELETE') {
    const id = Number(query.id)
    if (!id) throw createError({ statusCode: 400, message: '缺少id' })

    if (query.resource === 'category') {
      // 检查该分类下是否有未删除的文章
      const existing = await db
        .select({ id: articleInfo.id })
        .from(articleInfo)
        .where(and(eq(articleInfo.categoryId, id), eq(articleInfo.deleted, false)))
        .limit(1)

      if (existing.length > 0) {
        throw createError({ statusCode: 400, message: '该分类下有文章，无法删除' })
      }

      await db.delete(articleCategory).where(eq(articleCategory.id, id))
      return { code: 200, message: '删除成功' }
    }

    await db.update(articleInfo).set({ deleted: true, updatedAt: new Date() }).where(eq(articleInfo.id, id))
    return { code: 200, message: '删除成功' }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
