/**
 * 管理员 - 菜单管理 PUT + DELETE
 *
 * PUT    /api/admin/menu/:id  - 编辑菜单
 * DELETE /api/admin/menu/:id  - 删除菜单
 */
import { getRouterParam, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { menu } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/requireAdmin'
import { eq } from 'drizzle-orm'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

export default defineApiEventHandler('admin.menu.detail', async (event) => {
  await requireAdmin(event)
  const method = event.method
  const id = Number(getRouterParam(event, 'id'))

  if (!id) throw createError({ statusCode: 400, message: '缺少id' })

  if (method === 'PUT') {
    const body = await readBody(event)
    const { name, path, icon, orderNum, group, status } = body

    const [updated] = await db
      .update(menu)
      .set({
        ...(name !== undefined && { name }),
        ...(path !== undefined && { path }),
        ...(icon !== undefined && { icon }),
        ...(orderNum !== undefined && { orderNum }),
        ...(group !== undefined && { group }),
        ...(status !== undefined && { status }),
        updatedAt: new Date(),
      })
      .where(eq(menu.id, id))
      .returning()

    if (!updated) throw createError({ statusCode: 404, message: '菜单不存在' })
    return { code: 200, data: updated }
  }

  if (method === 'DELETE') {
    await db.delete(menu).where(eq(menu.id, id))
    return { code: 200, message: '删除成功' }
  }

  throw createError({ statusCode: 405, message: '不支持的请求方法' })
})
