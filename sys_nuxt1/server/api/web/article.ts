/**
 * 前台 - 文章相关数据
 *
 * GET /api/web/article
 *     ?categoryId=1    按分类筛选文章
 *     ?type=list       仅返回文章列表
 *     ?type=category   仅返回分类列表
 *     （无 type 参数）  同时返回文章列表和分类列表
 *
 * 仅返回未删除数据，文章按 sort 和 createdAt 倒序，分类按 sort 倒序
 */
import { getQuery } from 'h3'
import { db } from '~/server/db'
import { articleInfo, articleCategory } from '~/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

export default defineApiEventHandler('web.article', async (event) => {
  const query = getQuery(event) as { categoryId?: string; type?: string }
  const categoryId = query.categoryId ? Number(query.categoryId) : undefined
  const type = query.type as string | undefined

  const commonSelect = {
    id: articleInfo.id,
    title: articleInfo.title,
    content: articleInfo.content,
    sort: articleInfo.sort,
    categoryId: articleInfo.categoryId,
    createdAt: articleInfo.createdAt,
  }

  const categorySelect = {
    id: articleCategory.id,
    name: articleCategory.name,
    sort: articleCategory.sort,
    createdAt: articleCategory.createdAt,
  }

  if (type === 'list') {
    const where: any = eq(articleInfo.deleted, false)
    if (categoryId) Object.assign(where, eq(articleInfo.categoryId, categoryId))

    const articles = await db
      .select({
        ...commonSelect,
        category: categorySelect,
      })
      .from(articleInfo)
      .leftJoin(articleCategory, eq(articleInfo.categoryId, articleCategory.id))
      .where(where)
      .orderBy(desc(articleInfo.sort), desc(articleInfo.createdAt))

    return { code: 200, data: { articles } }
  }

  if (type === 'category') {
    const categories = await db
      .select(categorySelect)
      .from(articleCategory)
      .orderBy(desc(articleCategory.sort))

    return { code: 200, data: { categories } }
  }

  // 默认：同时返回文章列表和分类列表
  const where: any = eq(articleInfo.deleted, false)
  if (categoryId) Object.assign(where, eq(articleInfo.categoryId, categoryId))

  const [articles, categories] = await Promise.all([
    db
      .select({
        ...commonSelect,
        category: categorySelect,
      })
      .from(articleInfo)
      .leftJoin(articleCategory, eq(articleInfo.categoryId, articleCategory.id))
      .where(where)
      .orderBy(desc(articleInfo.sort), desc(articleInfo.createdAt)),

    db
      .select(categorySelect)
      .from(articleCategory)
      .orderBy(desc(articleCategory.sort)),
  ])

  return { code: 200, data: { articles, categories } }
})
