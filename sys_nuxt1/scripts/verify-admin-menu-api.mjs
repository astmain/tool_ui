import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const menuApiPath = resolve(projectRoot, 'server/api/admin/menu.ts');
const menuItemApiPath = resolve(projectRoot, 'server/api/admin/menu/[id].ts');
const menuApi = readFileSync(menuApiPath, 'utf8');
const menuItemApi = readFileSync(menuItemApiPath, 'utf8');

const checks = [
  ['menu create sets createdAt', /\.insert\(menu\)[\s\S]*?\.values\(\{[\s\S]*?createdAt:\s*now[\s\S]*?\}\)/.test(menuApi)],
  ['menu create sets updatedAt', /\.insert\(menu\)[\s\S]*?\.values\(\{[\s\S]*?updatedAt:\s*now[\s\S]*?\}\)/.test(menuApi)],
  ['menu permission create sets createdAt', /\.insert\(roleMenuPermission\)[\s\S]*?\.values\(\{[\s\S]*?createdAt:\s*now[\s\S]*?\}\)/.test(menuApi)],
  ['menu permission create sets updatedAt', /\.insert\(roleMenuPermission\)[\s\S]*?\.values\(\{[\s\S]*?updatedAt:\s*now[\s\S]*?\}\)/.test(menuApi)],
  ['menu item update preserves updatedAt', /\.update\(menu\)[\s\S]*?updatedAt:\s*new Date\(\)/.test(menuItemApi)],
  ['menu item delete uses route id', /\.delete\(menu\)[\s\S]*?\.where\(eq\(menu\.id,\s*id\)\)/.test(menuItemApi)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('菜单管理接口验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('菜单管理接口结构验证通过');
