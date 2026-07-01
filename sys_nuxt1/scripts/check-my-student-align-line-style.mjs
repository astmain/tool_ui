import { readFile } from 'node:fs/promises'

const filePath = 'app/pages/admin/my-student.vue'
const source = await readFile(filePath, 'utf8')

const expectations = [
  {
    label: 'horizontal align helper line uses dashed cyan border',
    ok: /data-testid="student-align-line-h"[^>]*class="[^"]*border-t[^"]*border-dashed[^"]*border-cyan-500/.test(source),
  },
  {
    label: 'vertical align helper line uses dashed cyan border',
    ok: /data-testid="student-align-line-v"[^>]*class="[^"]*border-l[^"]*border-dashed[^"]*border-cyan-500/.test(source),
  },
  {
    label: 'align helper legend uses dashed cyan border',
    ok: /<div class="flex items-center gap-2"><div class="w-6 h-0 border-t border-dashed border-cyan-500" \/><span>对齐辅助线<\/span><\/div>/.test(source),
  },
  {
    label: 'align helper line no longer uses solid background color',
    ok: !/data-testid="student-align-line-[hv]"[^>]*bg-cyan-500/.test(source),
  },
]

const failures = expectations.filter((item) => !item.ok)

if (failures.length > 0) {
  console.error('My student align line style check failed:')
  for (const item of failures) {
    console.error(`- ${item.label}`)
  }
  process.exit(1)
}

console.log('My student align line style check passed.')
