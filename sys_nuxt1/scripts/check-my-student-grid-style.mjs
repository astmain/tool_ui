import { readFile } from 'node:fs/promises'

const filePath = 'app/pages/admin/my-student.vue'
const source = await readFile(filePath, 'utf8')

const expectations = [
  {
    label: 'grid opacity',
    pattern: /data-testid="student-grid-bg"[\s\S]*?style="opacity:\s*0\.75"/,
  },
  {
    label: 'grid stroke color',
    pattern: /stroke="#cbd5e1"/,
  },
  {
    label: 'grid stroke width',
    pattern: /stroke-width="0\.8"/,
  },
]

const failures = expectations.filter((item) => !item.pattern.test(source))

if (failures.length > 0) {
  console.error('My student grid style check failed:')
  for (const item of failures) {
    console.error(`- missing ${item.label}`)
  }
  process.exit(1)
}

console.log('My student grid style check passed.')
