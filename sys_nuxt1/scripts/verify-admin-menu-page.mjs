import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const pagePath = resolve(projectRoot, 'app/pages/admin/menu.vue');
const page = readFileSync(pagePath, 'utf8');

const checks = [
  ['has menu list state', /menus\s*=\s*ref<Menu\[\]>/.test(page)],
  ['fetches menu api', /\$fetch<\{\s*code:\s*number;\s*data:\s*Menu\[\]\s*\}>\('\/api\/admin\/menu'\)/.test(page)],
  ['has add action', /function\s+openAdd/.test(page)],
  ['has edit action', /function\s+openEdit/.test(page)],
  ['has submit action', /function\s+handleSubmit/.test(page)],
  ['captures edit mode before closeForm', /const\s+isEditing\s*=\s*editId\.value\s*!==\s*null/.test(page)],
  ['edit submit uses item route', /const\s+url\s*=\s*isEditing\s*\?\s*`\/api\/admin\/menu\/\$\{editId\.value\}`\s*:\s*'\/api\/admin\/menu'/.test(page)],
  ['delete uses item route', /\$fetch<\{\s*code:\s*number;\s*message\?:\s*string\s*\}>\(`\/api\/admin\/menu\/\$\{id\}`/.test(page)],
  ['toggle status uses item route', /\$fetch<\{\s*code:\s*number;\s*message\?:\s*string\s*\}>\(`\/api\/admin\/menu\/\$\{menu\.id\}`/.test(page)],
  ['shows correct success message after closeForm', /msgRef\.value\?\.success\(isEditing\s*\?\s*'保存成功'\s*:\s*'添加成功'\)/.test(page)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('菜单管理页面验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('菜单管理页面结构验证通过');
