import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const pagePath = resolve(projectRoot, 'app/pages/admin/setting.vue');
const page = readFileSync(pagePath, 'utf8');

const checks = [
  ['has site name state', /siteName\s*=\s*ref/.test(page)],
  ['has database url state', /dbUrl\s*=\s*ref/.test(page)],
  ['fetches setting key-value object', /\$fetch<\{\s*code:\s*number;\s*data:\s*Record<string,\s*string>/.test(page)],
  ['loads site_name from settings object', /siteName\.value\s*=\s*resp\.data\.site_name\s*\?\?\s*''/.test(page)],
  ['fetches dbinfo resource', /resource=dbinfo/.test(page)],
  ['saves site_name key', /key:\s*'site_name'/.test(page)],
  ['has backup action', /function\s+handleBackup/.test(page)],
  ['downloads backup endpoint', /resource=backup/.test(page)],
  ['uses save file picker when available', /showSaveFilePicker/.test(page)],
  ['has browser download fallback', /fallbackDownloadBackup/.test(page)],
  ['uses fallback before blob fetch when picker is missing', /if\s*\(!pickerWindow\.showSaveFilePicker\)[\s\S]*?fallbackDownloadBackup\(\)/.test(page)],
  ['fallback uses direct backup endpoint', /href\s*=\s*'\/api\/admin\/setting\?resource=backup'/.test(page)],
  ['notifies fallback download mode', /当前浏览器不支持选择保存位置，已使用默认下载/.test(page)],
  ['handles cancelled save picker', /已取消保存/.test(page)],
  ['renders save site name button', /text="保存-网站名称"/.test(page)],
  ['renders download backup button', /text="下载-数据库备份"/.test(page)],
  ['does not treat settings response as array', !/settings\s*=\s*ref<Setting\[\]>/.test(page) && !/groupedSettings/.test(page)],
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error('网站设置页面验证失败:');
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log('网站设置页面结构验证通过');
