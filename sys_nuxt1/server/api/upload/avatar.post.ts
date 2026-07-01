/**
 * 管理员 - 头像上传代理
 *
 * POST /api/upload/avatar
 * FormData: { file: File }
 *
 * 将图片转发到外部 Express 服务器进行上传，返回图片 URL。
 */
import { readMultipartFormData, createError } from 'h3'
import { defineApiEventHandler } from '~/server/utils/apiResponse'

export default defineApiEventHandler('upload.avatar', async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: '未上传文件' })
  }

  const file = formData[0]
  if (!file.data || !file.filename) {
    throw createError({ statusCode: 400, message: '文件无效' })
  }

  // 转发到外部上传服务器
  const uploadServer = 'http://103.119.2.223:3000/v1/upload_one'
  const form = new FormData()
  const blob = new Blob([file.data], { type: file.type || 'image/jpeg' })
  form.append('file', blob, file.filename)

  try {
    const res = await fetch(uploadServer, { method: 'POST', body: form })
    const data = await res.json()

    if (data.code !== 200 || !data.data?.url) {
      throw createError({ statusCode: 500, message: data.message || '图片上传失败' })
    }

    return { code: 200, data: { url: data.data.url } }
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 500, message: '图片上传失败' })
  }
})
