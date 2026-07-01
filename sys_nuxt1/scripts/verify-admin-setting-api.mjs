import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const apiPath = resolve(projectRoot, 'server/api/admin/setting.ts');
const source = readFileSync(apiPath, 'utf8');

const checks = [
  ['documents dbinfo endpoint', /resource=dbinfo/.test(source)],
  ['routes dbinfo query', /query\.resource\s*===\s*'dbinfo'/.test(source)],
  ['has dbinfo handler', /function\s+handleDbInfo/.test(source)],
  ['masks database password', source.includes(':***@')],
  ['dbinfo returns url data', /data:\s*\{\s*url:\s*masked\s*\}/.test(source)],
  ['requires admin for dbinfo', /await\s+requireAdmin\(event\)[\s\S]*?handleDbInfo/.test(source) || /handleDbInfo[\s\S]*?requireAdmin\(event\)/.test(source)],
  ['updates setting by key', /where\(eq\(setting\.key,\s*key\)\)/.test(source)],
  ['creates missing setting by key', /insert\(setting\)\.values\(\{\s*key,\s*value\s*\}\)/.test(source)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('网站设置接口验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('网站设置接口结构验证通过');
