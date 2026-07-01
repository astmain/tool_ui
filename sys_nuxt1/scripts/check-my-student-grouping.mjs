import { readFile } from 'node:fs/promises'

const pagePath = 'app/pages/admin/my-student.vue'
const schemaPath = 'server/db/schema.ts'
const apiPath = 'server/api/admin/my-student.ts'

const [page, schema, api] = await Promise.all([
  readFile(pagePath, 'utf8'),
  readFile(schemaPath, 'utf8'),
  readFile(apiPath, 'utf8'),
])

const groupHandleMatch = page.match(/<div[\s\S]*?data-testid="student-group-handle"[\s\S]*?>/)
const groupHandleClass = groupHandleMatch?.[1] ?? ''
const detachStudentFromGroupMatch = page.match(/function\s+detachStudentFromGroup\(studentId:\s*number\)[\s\S]*?\n}\n\nfunction\s+handleGroupConfirm/)
const detachStudentFromGroupSource = detachStudentFromGroupMatch?.[0] ?? ''

const checks = [
  {
    label: 'student schema persists groupName',
    ok: /groupName:\s*varchar\('groupName',\s*\{\s*length:\s*50\s*\}\)/.test(schema),
  },
  {
    label: 'student type includes optional groupName',
    ok: /interface\s+Student[\s\S]*groupName\?:\s*string\s*\|\s*null/.test(page),
  },
  {
    label: 'save positions submits groupName with each item',
    ok: /groupName:\s*s\.groupName\s*\?\?\s*null/.test(page),
  },
  {
    label: 'batch update persists groupName when supplied',
    ok: /'groupName'\s+in\s+item/.test(api) && /groupName:\s*normalizeGroupName\(item\.groupName\)/.test(api),
  },
  {
    label: 'box selection marks selection source for grouping',
    ok: /selectionSource\s*=\s*ref<'none'\s*\|\s*'box'\s*\|\s*'card'>/.test(page) && /selectionSource\.value\s*=\s*'box'/.test(page),
  },
  {
    label: 'group dialog and action exist',
    ok: /showGroupDialog\s*=\s*ref\(false\)/.test(page) && /function\s+openGroupDialog\(\)/.test(page) && /function\s+handleGroupConfirm\(\)/.test(page),
  },
  {
    label: 'group button only appears for box selection',
    ok: /v-if="selectionSource === 'box' && selectedIds\.size > 0"/.test(page) && /归类组/.test(page),
  },
  {
    label: 'box selection stores matched group handle name for prefill',
    ok:
      /selectedGroupName\s*=\s*ref\(''\)/.test(page) &&
      /function\s+findSelectedGroupName\(left:\s*number,\s*top:\s*number,\s*right:\s*number,\s*bottom:\s*number\)/.test(page) &&
      /studentGroups\.value\.find\(\(item\)\s*=>/.test(page) &&
      /item\.x\s*\+\s*item\.width\s*>\s*left/.test(page) &&
      /item\.y\s*\+\s*GROUP_HANDLE_HEIGHT\s*>\s*top/.test(page) &&
      /selectedGroupName\.value\s*=\s*findSelectedGroupName\(left,\s*top,\s*right,\s*bottom\)/.test(page),
  },
  {
    label: 'group dialog pre-fills from selected group handle name',
    ok:
      /function\s+openGroupDialog\(\)/.test(page) &&
      /groupNameInput\.value\s*=\s*selectedGroupName\.value/.test(page),
  },
  {
    label: 'non-box selection clears selected group handle name',
    ok:
      /function\s+clearSelection\(\)[\s\S]*?selectedGroupName\.value\s*=\s*''/.test(page) &&
      /function\s+handleCardHandleMouseDown[\s\S]*?selectionSource\.value\s*=\s*'card'[\s\S]*?selectedGroupName\.value\s*=\s*''/.test(page) &&
      /function\s+handleCardBodyMouseDown[\s\S]*?selectionSource\.value\s*=\s*'card'[\s\S]*?selectedGroupName\.value\s*=\s*''/.test(page) &&
      /moved\.x\s*<\s*5[\s\S]*?selectedGroupName\.value\s*=\s*''/.test(page),
  },
  {
    label: 'canvas renders draggable group handles',
    ok: /data-testid="student-group-handle"/.test(page) && /handleGroupHandleMouseDown\(event,\s*group\)/.test(page),
  },
  {
    label: 'group handle stays below global dialog layer',
    ok:
      /function\s+getGroupHandleZClass\(group:\s*StudentGroup\)/.test(page) &&
      /return\s+'z-30'/.test(page) &&
      /return\s+'z-\[45\]'/.test(page) &&
      !/\bz-50\b/.test(groupHandleClass),
  },
  {
    label: 'group handle height spans two grid cells',
    ok:
      /const\s+GROUP_HANDLE_HEIGHT\s*=\s*GRID_SIZE\s*\*\s*2/.test(page) &&
      /height:\s*`\$\{GROUP_HANDLE_HEIGHT\}px`/.test(page),
  },
  {
    label: 'group handle exposes edit button without starting drag',
    ok:
      /data-testid="student-group-edit"/.test(page) &&
      /@mousedown\.stop/.test(page) &&
      /@click\.stop="openEditGroupDialog\(group\.name\)"/.test(page),
  },
  {
    label: 'group handle exposes collapse toggle without starting drag',
    ok:
      /collapsedGroupNames\s*=\s*ref<Set<string>>\(new Set\(\)\)/.test(page) &&
      /function\s+toggleGroupCollapsed\(groupName:\s*string\)/.test(page) &&
      /data-testid="student-group-toggle"/.test(page) &&
      /@mousedown\.stop/.test(page) &&
      /@click\.stop="toggleGroupCollapsed\(group\.name\)"/.test(page) &&
      /isGroupCollapsed\(group\.name\)\s*\?\s*'展开组'\s*:\s*'收起组'/.test(page),
  },
  {
    label: 'collapsed group hides grouped student cards only',
    ok:
      /function\s+isStudentHiddenByCollapsedGroup\(student:\s*Student\)/.test(page) &&
      /collapsedGroupNames\.value\.has\(name\)/.test(page) &&
      /v-show="!isStudentHiddenByCollapsedGroup\(student\)"/.test(page),
  },
  {
    label: 'group dialog supports rename mode',
    ok:
      /editingGroupName\s*=\s*ref<string\s*\|\s*null>\(null\)/.test(page) &&
      /function\s+openEditGroupDialog\(groupName:\s*string\)/.test(page) &&
      /editingGroupName\.value\s*=\s*groupName/.test(page),
  },
  {
    label: 'group rename updates current state only',
    ok:
      /const\s+oldName\s*=\s*editingGroupName\.value/.test(page) &&
      /student\.groupName\?\.trim\(\)\s*===\s*oldName/.test(page) &&
      /groupName:\s*name/.test(page) &&
      /保存位置持久化/.test(page),
  },
  {
    label: 'edit group dialog lists current group members',
    ok:
      /editingGroupStudents\s*=\s*computed<Student\[\]>\(\(\)\s*=>/.test(page) &&
      /student\.groupName\?\.trim\(\)\s*===\s*editingGroupName\.value/.test(page) &&
      /v-if="editingGroupName"/.test(page) &&
      /v-for="student in editingGroupStudents"/.test(page) &&
      /data-testid="student-group-member"/.test(page),
  },
  {
    label: 'edit group dialog can detach a member without API persistence',
    ok:
      /function\s+detachStudentFromGroup\(studentId:\s*number\)/.test(page) &&
      /student\.id\s*===\s*studentId\s*\?\s*\{\s*\.\.\.student,\s*groupName:\s*null\s*\}/.test(page) &&
      /data-testid="student-group-member-detach"/.test(page) &&
      /@click="detachStudentFromGroup\(student\.id\)"/.test(page) &&
      /已脱离分组，请点击保存位置持久化/.test(page) &&
      detachStudentFromGroupSource.length > 0 &&
      !/\$fetch/.test(detachStudentFromGroupSource),
  },
  {
    label: 'group drag moves grouped cards by grid offset',
    ok: /isGroupDragging\s*=\s*ref\(false\)/.test(page) && /groupDragIds/.test(page) && /snapGrid/.test(page),
  },
  {
    label: 'group drag offset is reactive for instant handle preview',
    ok: /groupDragOffset\s*=\s*reactive\(\{\s*x:\s*0,\s*y:\s*0\s*\}\)/.test(page),
  },
  {
    label: 'active group drag raises the whole group below dialog layer',
    ok:
      /function\s+getGroupHandleZClass\(group:\s*StudentGroup\)/.test(page) &&
      /isGroupDragging\.value\s*&&\s*groupDragName\.value\s*===\s*group\.name[\s\S]*?return\s+'z-\[45\]'/.test(page) &&
      /return\s+'z-30'/.test(page) &&
      /function\s+getStudentZClass\(student:\s*Student\)/.test(page) &&
      /isGroupDragging\.value\s*&&\s*groupDragIds\.has\(student\.id\)[\s\S]*?return\s+'z-\[44\]'/.test(page) &&
      /getGroupHandleZClass\(group\)/.test(page) &&
      /getStudentZClass\(student\)/.test(page),
  },
  {
    label: 'card dragging tracks selected ids and offset for group handle preview',
    ok:
      /cardDragIds\s*=\s*new Set<number>\(\)/.test(page) &&
      /cardDragOffset\s*=\s*reactive\(\{\s*x:\s*0,\s*y:\s*0\s*\}\)/.test(page) &&
      /cardDragIds\.clear\(\)/.test(page) &&
      /cardDragOffset\.x\s*=\s*offsetX/.test(page) &&
      /cardDragOffset\.y\s*=\s*offsetY/.test(page),
  },
  {
    label: 'active group handle recalculates layout from dragged card preview without delay',
    ok:
      /function\s+getPreviewStudentPosition\(student:\s*Student\)/.test(page) &&
      /cardDragIds\.has\(student\.id\)/.test(page) &&
      /student\.groupName\?\.trim\(\)\s*===\s*group\.name/.test(page) &&
      /function\s+getGroupHandleStyle\(group:\s*StudentGroup\)/.test(page) &&
      /left:\s*`\$\{layout\.x\}px`/.test(page) &&
      /top:\s*`\$\{layout\.y\}px`/.test(page) &&
      /:style="getGroupHandleStyle\(group\)"/.test(page),
  },
]

const failures = checks.filter((item) => !item.ok)

if (failures.length > 0) {
  console.error('My student grouping check failed:')
  for (const item of failures) {
    console.error(`- ${item.label}`)
  }
  process.exit(1)
}

console.log('My student grouping check passed.')
