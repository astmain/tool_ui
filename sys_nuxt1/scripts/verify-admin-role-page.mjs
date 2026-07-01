import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const pagePath = resolve(projectRoot, 'app/pages/admin/role.vue');
const page = readFileSync(pagePath, 'utf8');

const checks = [
  ['has role list state', /roles\s*=\s*ref<Role\[\]>/.test(page)],
  ['fetches role api', /\$fetch<\{\s*code:\s*number;\s*data:\s*Role\[\]\s*\}>\('\/api\/admin\/role'\)/.test(page)],
  ['has add action', /function\s+openAdd/.test(page)],
  ['has edit action', /function\s+openEdit/.test(page)],
  ['has submit action', /function\s+handleSubmit/.test(page)],
  ['disables role key while editing', /:disabled="!!editId"/.test(page)],
  ['has preset role protection', /PRESET_ROLE_KEYS/.test(page) && /预设角色禁止删除/.test(page) && /预设角色禁止禁用/.test(page)],
  ['uses stable list branch after empty state', /<template\s+v-else>[\s\S]*?<tr\s+v-for="\([^"]*roles/.test(page)],
  ['does not combine v-for and v-else on role row', !/<tr[\s\S]*?v-for="\([^"]*roles[\s\S]*?v-else[\s\S]*?>/.test(page)],
  ['normalizes submitted role key', /key:\s*form\.value\.key\.trim\(\)\.toUpperCase\(\)/.test(page)],
  ['trims role name before submit', /name:\s*form\.value\.name\.trim\(\)/.test(page)],
  ['edit submit sends id in body', /const\s+payload[\s\S]*?\.\.\.\(isEditing\s*&&\s*editId\.value\s*!==\s*null\s*&&\s*\{\s*id:\s*editId\.value\s*\}\)/.test(page)],
  ['toggle status sends id in body', /body:\s*\{\s*id:\s*role\.id,\s*status:\s*!role\.status\s*\}/.test(page)],
  ['captures edit mode before closeForm', /const\s+isEditing\s*=\s*editId\.value\s*!==\s*null/.test(page)],
  ['shows correct success message after closeForm', /msgRef\.value\?\.success\(isEditing\s*\?\s*'保存成功'\s*:\s*'添加成功'\)/.test(page)],
  ['uses add confirm text when adding', /:confirm-text="editId\s*\?\s*'保存'\s*:\s*'添加'"/.test(page)],
  ['confirm button disabled until required fields exist', /:confirm-disabled="!form\.name\.trim\(\)\s*\|\|\s*!form\.key\.trim\(\)"/.test(page)],
  ['renders user count column', /用户数/.test(page) && /role\._count\?\.users/.test(page)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('角色管理页面验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('角色管理页面结构验证通过');
