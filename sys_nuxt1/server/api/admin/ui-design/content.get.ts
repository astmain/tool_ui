import * as fs from 'fs';
import * as path from 'path';
import { getQuery } from 'h3';
import { defineApiEventHandler } from '~/server/utils/apiResponse'

export default defineApiEventHandler('admin.uiDesign.content', async (event) => {
  try {
    const query = getQuery(event);
    const filePath = query.path as string;

    if (!filePath) {
      return { code: 400, message: '缺少文件路径' };
    }

    const normalizedPath = filePath.replace(/\\/g, '/');

    if (normalizedPath.includes('..') || path.isAbsolute(normalizedPath)) {
      return { code: 403, message: '非法路径' };
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    if (ext !== '.html' && ext !== '.md') {
      return { code: 403, message: '非法路径' };
    }

    const baseDir = path.join(process.cwd(), 'public', 'ui-design');
    const fullPath = path.join(baseDir, normalizedPath);

    const resolvedPath = path.resolve(fullPath);
    if (!resolvedPath.startsWith(baseDir)) {
      return { code: 403, message: '非法路径' };
    }

    if (!fs.existsSync(resolvedPath)) {
      return { code: 404, message: '文件不存在' };
    }

    const content = fs.readFileSync(resolvedPath, 'utf-8');

    return { code: 200, data: { content } };
  } catch (error) {
    console.error('Error reading ui-design file:', error);
    return { code: 500, message: '服务器异常' };
  }
});
