import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const apiPath = resolve(projectRoot, 'server/api/admin/my-student.ts');
const source = readFileSync(apiPath, 'utf8');

const checks = [
  ['has database error code helper', /function\s+getDbErrorCode/.test(source) && /cause\?\.\s*code/.test(source)],
  ['has student sequence repair helper', /function\s+syncStudentIdSequence/.test(source) && /setval\(pg_get_serial_sequence/.test(source)],
  ['create sets updatedAt', /\.insert\(student\)[\s\S]*?\.values\(\{[\s\S]*?updatedAt:\s*(?:new Date\(\)|now)[\s\S]*?\}\)/.test(source)],
  ['create retries after duplicate primary key', /getDbErrorCode\(err\)\s*!==\s*'23505'[\s\S]*?syncStudentIdSequence\(\)[\s\S]*?createStudent\(/.test(source)],
  ['batch update uses transaction callback', /await\s+db\.transaction\(\s*async\s*\(tx\)\s*=>/.test(source)],
  ['batch update uses tx update', /await\s+tx\s*[\r\n\s]*\.update\(student\)/.test(source)],
  ['batch update sets updatedAt', /Array\.isArray\(body\.items\)[\s\S]*?updatedAt:\s*(?:new Date\(\)|now)/.test(source)],
  ['single update validates normalized id', /const\s+studentId\s*=\s*Number\(id\)/.test(source) && /if\s*\(!studentId\)/.test(source)],
  ['single update uses normalized id', /\.where\(eq\(student\.id,\s*studentId\)\)/.test(source)],
  ['delete validates normalized id', /const\s+studentId\s*=\s*Number\(query\.id\)/.test(source) && /if\s*\(!studentId\)/.test(source)],
  ['delete uses normalized id', /\.delete\(student\)[\s\S]*?\.where\(eq\(student\.id,\s*studentId\)\)/.test(source)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('我的学生接口验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('我的学生接口结构验证通过');
