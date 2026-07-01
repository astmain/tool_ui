import { readFile } from 'node:fs/promises'

const filePath = 'app/pages/admin/my-student.vue'
const source = await readFile(filePath, 'utf8')

const dragBranch = source.match(/if \(isDragging\.value\) \{[\s\S]*?\n    return\n  \}/)?.[0] ?? ''
const mouseUpBlock = source.match(/function handleMouseUp\(\) \{[\s\S]*?\nfunction bindCardRef/)?.[0] ?? ''

const expectations = [
  {
    label: 'snapGrid always rounds to nearest grid point',
    ok: /function\s+snapGrid\(value:\s*number\)\s*\{[\s\S]*?Math\.round\(value\s*\/\s*GRID_SIZE\)\s*\*\s*GRID_SIZE/.test(source),
  },
  {
    label: 'drag snapping no longer uses a grid threshold',
    ok: !/GRID_THRESHOLD/.test(source),
  },
  {
    label: 'drag branch does not call snapAlign',
    ok: dragBranch.length > 0 && !/snapAlign\(/.test(dragBranch),
  },
  {
    label: 'drag transform offset is based on snapped main card position',
    ok: /const\s+offsetX\s*=\s*mainX\s*-\s*mainBase\.x/.test(dragBranch) && /const\s+offsetY\s*=\s*mainY\s*-\s*mainBase\.y/.test(dragBranch),
  },
  {
    label: 'align helper lines stay hidden during grid-only dragging',
    ok: /showEl\(alignLineHRef\.value,\s*false\)/.test(dragBranch) && /showEl\(alignLineVRef\.value,\s*false\)/.test(dragBranch),
  },
  {
    label: 'mouse up persists snapped grid coordinates',
    ok: /x:\s*snapGrid\(/.test(mouseUpBlock) && /y:\s*snapGrid\(/.test(mouseUpBlock),
  },
]

const failures = expectations.filter((item) => !item.ok)

if (failures.length > 0) {
  console.error('My student grid drag check failed:')
  for (const item of failures) {
    console.error(`- ${item.label}`)
  }
  process.exit(1)
}

console.log('My student grid drag check passed.')
