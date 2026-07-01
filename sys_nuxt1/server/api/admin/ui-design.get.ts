import * as fs from 'fs';
import * as path from 'path';
import { defineApiEventHandler } from '~/server/utils/apiResponse'

export default defineApiEventHandler('admin.uiDesign', async (event) => {
  try {
    const baseDir = path.join(process.cwd(), 'public', 'ui-design');

    if (!fs.existsSync(baseDir)) {
      return { code: 200, data: [] };
    }

    const result: { dir: string; name: string; path: string; type: 'html' | 'markdown' }[] = [];

    const entries = fs.readdirSync(baseDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const dirName = entry.name;
      const dirPath = path.join(baseDir, dirName);

      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.html' || ext === '.md') {
          result.push({
            dir: dirName,
            name: file,
            path: `${dirName}/${file}`,
            type: ext === '.html' ? 'html' : 'markdown'
          });
        }
      }
    }

    result.sort((a, b) => {
      if (a.dir !== b.dir) return a.dir.localeCompare(b.dir);
      if (a.type !== b.type) return a.type === 'html' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return { code: 200, data: result };
  } catch (error) {
    console.error('Error scanning ui-design directory:', error);
    return { code: 500, message: '服务器异常' };
  }
});
