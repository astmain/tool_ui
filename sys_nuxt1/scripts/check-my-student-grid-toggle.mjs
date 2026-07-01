import { readFile } from 'node:fs/promises'

const filePath = 'app/pages/admin/my-student.vue'
const source = await readFile(filePath, 'utf8')

const expectations = [
  {
    label: 'grid visibility state exists and defaults to visible',
    ok: /const\s+showGrid\s*=\s*ref\(true\)/.test(source),
  },
  {
    label: 'header renders a grid toggle button',
    ok: /data-testid="student-grid-toggle"/.test(source) && /@click="showGrid\s*=\s*!showGrid"/.test(source),
  },
  {
    label: 'toggle button text reflects grid state',
    ok: /showGrid\s*\?\s*'隐藏网格线'\s*:\s*'显示网格线'/.test(source),
  },
  {
    label: 'grid background is controlled by toggle state',
    ok: /<svg[^>]*v-show="showGrid"[^>]*data-testid="student-grid-bg"/.test(source),
  },
]

const failures = expectations.filter((item) => !item.ok)

if (failures.length > 0) {
  console.error('My student grid toggle check failed:')
  for (const item of failures) {
    console.error(`- ${item.label}`)
  }
  process.exit(1)
}

console.log('My student grid toggle check passed.')
