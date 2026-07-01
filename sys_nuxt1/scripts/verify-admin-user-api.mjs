import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const apiPath = resolve(projectRoot, 'server/api/admin/user.ts');
const source = readFileSync(apiPath, 'utf8');

const checks = [
  ['has database error code helper', /function\s+getDbErrorCode/.test(source)],
  ['reads nested cause code', /cause\?\.\s*code/.test(source)],
  ['sets updatedAt when creating user', /values\(\{[\s\S]*updatedAt:\s*new Date\(\)[\s\S]*\}\)/.test(source)],
  ['maps duplicate user to 400', /getDbErrorCode\(err\)\s*===\s*'23505'[\s\S]*?用户名或邮箱已存在/.test(source)],
  ['handles duplicate user in update', /if\s*\(method\s*===\s*'PUT'\)[\s\S]*?getDbErrorCode\(err\)\s*===\s*'23505'/.test(source)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('用户管理接口验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('用户管理接口结构验证通过');
