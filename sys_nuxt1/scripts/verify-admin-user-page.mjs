import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const pagePath = resolve(projectRoot, 'app/pages/admin/user.vue');
const page = readFileSync(pagePath, 'utf8');

const checks = [
  ['has search keyword state', /searchKeyword\s*=\s*ref/.test(page)],
  ['has role filter state', /roleFilter\s*=\s*ref/.test(page)],
  ['renders filtered users', /filteredUsers/.test(page) && /v-for="\([^"]*filteredUsers/.test(page)],
  ['has edit dialog state', /showEditDialog\s*=\s*ref/.test(page)],
  ['has open edit action', /function\s+openEditDialog/.test(page)],
  ['has update user action', /function\s+handleUpdate/.test(page)],
  ['uses PUT for update user', /method:\s*'PUT'/.test(page)],
  ['renders edit button', /text="编辑"/.test(page)],
  ['renders search input', /placeholder="搜索/.test(page) || /placeholder="请输入.*搜索/.test(page)],
  ['extracts api error message', /function\s+getApiErrorMessage/.test(page)],
  ['add catch shows api error', /catch\s*\(\s*err[\s\S]*?formError\.value\s*=\s*getApiErrorMessage\(err,\s*'添加失败，请重试'\)/.test(page)],
  ['edit catch shows api error', /catch\s*\(\s*err[\s\S]*?formError\.value\s*=\s*getApiErrorMessage\(err,\s*'保存失败，请重试'\)/.test(page)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('用户管理页面验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('用户管理页面结构验证通过');
