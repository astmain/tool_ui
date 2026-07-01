import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const roleApiPath = resolve(projectRoot, 'server/api/admin/role.ts');
const permissionApiPath = resolve(projectRoot, 'server/api/admin/role/[id]/menu-permission.ts');
const roleApi = readFileSync(roleApiPath, 'utf8');
const permissionApi = readFileSync(permissionApiPath, 'utf8');

const checks = [
  ['role api has database error code helper', /function\s+getDbErrorCode/.test(roleApi)],
  ['role api reads nested cause code', /cause\?\.\s*code/.test(roleApi)],
  ['role create sets updatedAt', /\.insert\(role\)[\s\S]*?\.values\(\{[\s\S]*?updatedAt:\s*new Date\(\)[\s\S]*?\}\)/.test(roleApi)],
  ['role create maps duplicate key with helper', /getDbErrorCode\(err\)\s*===\s*'23505'[\s\S]*?角色标识已存在/.test(roleApi)],
  ['role create maps missing timestamp fields', /getDbErrorCode\(err\)\s*===\s*'23502'[\s\S]*?角色数据缺少必填字段/.test(roleApi)],
  ['role update accepts id from body or query', /const\s+roleId\s*=\s*Number\(id\s*\?\?\s*query\.id\)/.test(roleApi)],
  ['role update validates normalized role id', /if\s*\(!roleId\)\s*throw\s+createError\(\{\s*statusCode:\s*400,\s*message:\s*'缺少id'\s*\}\)/.test(roleApi)],
  ['role update uses normalized role id in where', /\.where\(eq\(role\.id,\s*roleId\)\)/.test(roleApi)],
  ['role update preserves updatedAt', /\.update\(role\)[\s\S]*?updatedAt:\s*new Date\(\)/.test(roleApi)],
  ['permission update runs delete and insert in transaction', /await\s+db\.transaction\(\s*async\s*\(tx\)\s*=>/.test(permissionApi)],
  ['permission transaction uses tx insert', /await\s+tx\.insert\(roleMenuPermission\)/.test(permissionApi)],
  ['permission insert sets updatedAt', /updatedAt:\s*new Date\(\)/.test(permissionApi)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('角色管理接口验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('角色管理接口结构验证通过');
