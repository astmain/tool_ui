<script setup lang="ts">
definePageMeta({ layout: 'admin' })

interface Student {
  id: number
  name: string
  age: number
  x: number
  y: number
  groupName?: string | null
}

interface StudentForm {
  name: string
  age: string
}

interface StudentGroup {
  name: string
  studentIds: number[]
  x: number
  y: number
  width: number
  height: number
}

interface GroupLayout {
  x: number
  y: number
  width: number
  height: number
}

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 800
const CARD_WIDTH = 140
const CARD_HEIGHT = 100
const HANDLE_HEIGHT = 32
const GRID_SIZE = 20
const ALIGN_THRESHOLD = 10
const GROUP_HANDLE_HEIGHT = GRID_SIZE * 2

const students = ref<Student[]>([])
const loading = ref(true)
const selectedIds = ref<Set<number>>(new Set())
const showGrid = ref(true)
const showDialog = ref(false)
const showGroupDialog = ref(false)
const dialogLoading = ref(false)
const saveLoading = ref(false)
const isEdit = ref(false)
const editingStudent = ref<Student | null>(null)
const form = ref<StudentForm>({ name: '', age: '' })
const groupNameInput = ref('')
const editingGroupName = ref<string | null>(null)
const groupError = ref('')
const formError = ref('')
const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void } | null>(null)
const { Com1Confirm } = useCom1Confirm()
const collapsedGroupNames = ref<Set<string>>(new Set())

const canvasRef = ref<HTMLDivElement | null>(null)
const guideLineHRef = ref<HTMLDivElement | null>(null)
const guideLineVRef = ref<HTMLDivElement | null>(null)
const gridLineHRef = ref<HTMLDivElement | null>(null)
const gridLineVRef = ref<HTMLDivElement | null>(null)
const alignLineHRef = ref<HTMLDivElement | null>(null)
const alignLineVRef = ref<HTMLDivElement | null>(null)
const coordTipRef = ref<HTMLDivElement | null>(null)
const selBoxRef = ref<HTMLDivElement | null>(null)

const cardRefs = new Map<number, HTMLDivElement>()
const isDragging = ref(false)
const dragStart = { x: 0, y: 0 }
const dragBase = new Map<number, { x: number; y: number }>()
const curOffset = new Map<number, { x: number; y: number }>()
const cardDragIds = new Set<number>()
const cardDragOffset = reactive({ x: 0, y: 0 })
const selectedIdsRef = ref<Set<number>>(new Set())
const selectionSource = ref<'none' | 'box' | 'card'>('none')
const selectedGroupName = ref('')
const selBoxData = ref<{ startX: number; startY: number } | null>(null)
const selBoxEnd = ref<{ x: number; y: number } | null>(null)
const dragDistance = ref<{ x: number; y: number } | null>(null)
const previewIds = new Set<number>()
const isGroupDragging = ref(false)
const groupDragName = ref('')
const groupDragIds = new Set<number>()
const groupDragStart = { x: 0, y: 0 }
const groupDragBase = new Map<number, { x: number; y: number }>()
const groupDragOffset = reactive({ x: 0, y: 0 })

function createGroupLayout(groupStudents: Student[]): GroupLayout {
  const left = Math.min(...groupStudents.map((student) => student.x))
  const top = Math.min(...groupStudents.map((student) => student.y))
  const right = Math.max(...groupStudents.map((student) => student.x + CARD_WIDTH))
  const bottom = Math.max(...groupStudents.map((student) => student.y + CARD_HEIGHT))
  return {
    x: left,
    y: Math.max(0, top - GROUP_HANDLE_HEIGHT - 4),
    width: right - left,
    height: bottom - top,
  }
}

const studentGroups = computed<StudentGroup[]>(() => {
  const map = new Map<string, Student[]>()
  students.value.forEach((student) => {
    const name = student.groupName?.trim()
    if (!name) return
    const groupStudents = map.get(name) ?? []
    groupStudents.push(student)
    map.set(name, groupStudents)
  })

  return Array.from(map.entries()).map(([name, groupStudents]) => {
    const layout = createGroupLayout(groupStudents)
    return {
      name,
      studentIds: groupStudents.map((student) => student.id),
      ...layout,
    }
  })
})

const editingGroupStudents = computed<Student[]>(() => {
  if (!editingGroupName.value) return []
  return students.value.filter((student) => student.groupName?.trim() === editingGroupName.value)
})

function findNextSlot(existingStudents: Student[]): { x: number; y: number } {
  const occupied = new Set(existingStudents.map((s) => `${Math.round(s.x)},${Math.round(s.y)}`))
  const cols = Math.floor(CANVAS_WIDTH / CARD_WIDTH)
  const rows = Math.floor(CANVAS_HEIGHT / CARD_HEIGHT)

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = col * CARD_WIDTH
      const y = row * CARD_HEIGHT
      if (!occupied.has(`${x},${y}`)) return { x, y }
    }
  }

  return { x: 0, y: 0 }
}

async function fetchStudents() {
  loading.value = true
  try {
    const resp = await $fetch<{ code: number; data: Student[] }>('/api/admin/my-student')
    if (resp.ok) {
      students.value = resp.data.map((s) => ({
        ...s,
        x: Number(s.x) || 0,
        y: Number(s.y) || 0,
        groupName: s.groupName?.trim() || null,
      }))
    }
  } catch {
    msgRef.value?.error('获取学生列表失败')
  } finally {
    loading.value = false
  }
}

function openAddDialog() {
  isEdit.value = false
  editingStudent.value = null
  form.value = { name: '', age: '' }
  formError.value = ''
  showDialog.value = true
}

function openEditDialog(student: Student) {
  isEdit.value = true
  editingStudent.value = student
  form.value = { name: student.name, age: String(student.age) }
  formError.value = ''
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  editingStudent.value = null
  formError.value = ''
}

function clearSelection() {
  selectedIds.value = new Set()
  selectedIdsRef.value = new Set()
  selectionSource.value = 'none'
  selectedGroupName.value = ''
}

function openGroupDialog() {
  if (selectedIds.value.size === 0 || selectionSource.value !== 'box') return
  editingGroupName.value = null
  groupNameInput.value = selectedGroupName.value
  groupError.value = ''
  showGroupDialog.value = true
}

function openEditGroupDialog(groupName: string) {
  editingGroupName.value = groupName
  groupNameInput.value = groupName
  groupError.value = ''
  showGroupDialog.value = true
}

function closeGroupDialog() {
  showGroupDialog.value = false
  editingGroupName.value = null
  groupNameInput.value = ''
  groupError.value = ''
}

function detachStudentFromGroup(studentId: number) {
  students.value = students.value.map((student) => (
    student.id === studentId ? { ...student, groupName: null } : student
  ))
  msgRef.value?.success('已脱离分组，请点击保存位置持久化')
}

function handleGroupConfirm() {
  const name = groupNameInput.value.trim()
  if (!name) {
    groupError.value = '请输入组名称'
    return
  }

  const oldName = editingGroupName.value
  if (oldName) {
    students.value = students.value.map((student) => (
      student.groupName?.trim() === oldName ? { ...student, groupName: name } : student
    ))
    msgRef.value?.success('组名称已修改，请点击保存位置持久化')
  } else {
    const ids = selectedIds.value
    students.value = students.value.map((student) => (ids.has(student.id) ? { ...student, groupName: name } : student))
    msgRef.value?.success('归类组已设置，请点击保存位置持久化')
  }
  closeGroupDialog()
}

async function handleConfirm() {
  formError.value = ''
  if (!form.value.name.trim()) {
    formError.value = '请输入姓名'
    return
  }

  dialogLoading.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      age: Number(form.value.age) || 18,
    }

    if (isEdit.value && editingStudent.value) {
      const resp = await $fetch<{ code: number; data?: Student; message?: string }>('/api/admin/my-student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: { id: editingStudent.value.id, ...payload },
      })

      if (resp.ok && resp.data) {
        students.value = students.value.map((s) => (s.id === editingStudent.value?.id ? resp.data as Student : s))
        msgRef.value?.success('保存成功')
        closeDialog()
      } else {
        msgRef.value?.error(resp.message ?? '保存失败')
      }
    } else {
      const slot = findNextSlot(students.value)
      const resp = await $fetch<{ code: number; data?: Student; message?: string }>('/api/admin/my-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { ...payload, x: slot.x, y: slot.y },
      })

      if (resp.ok && resp.data) {
        students.value = [...students.value, resp.data]
        msgRef.value?.success('添加成功')
        closeDialog()
      } else {
        msgRef.value?.error(resp.message ?? '添加失败')
      }
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? (isEdit.value ? '保存失败' : '添加失败'))
  } finally {
    dialogLoading.value = false
  }
}

async function handleDeleteStudent(student: Student) {
  const confirmed = await Com1Confirm({ message: `确定要删除学生「${student.name}」吗？`, title: '确认删除' })
  if (!confirmed) return

  dialogLoading.value = true
  try {
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/my-student?id=${student.id}`, {
      method: 'DELETE',
    })
    if (resp.ok) {
      students.value = students.value.filter((s) => s.id !== student.id)
      const next = new Set(selectedIds.value)
      next.delete(student.id)
      selectedIds.value = next
      selectedIdsRef.value = new Set(next)
      msgRef.value?.success('删除成功')
      if (editingStudent.value?.id === student.id) closeDialog()
    } else {
      msgRef.value?.error(resp.message ?? '删除失败')
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? '删除失败')
  } finally {
    dialogLoading.value = false
  }
}

async function handleSavePositions() {
  if (students.value.length === 0) return
  saveLoading.value = true
  try {
    const items = students.value.map((s) => ({
      id: s.id,
      x: Math.round(s.x),
      y: Math.round(s.y),
      groupName: s.groupName ?? null,
    }))
    const resp = await $fetch<{ code: number; message?: string }>('/api/admin/my-student', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { items },
    })
    if (resp.ok) {
      msgRef.value?.success('位置保存成功')
    } else {
      msgRef.value?.error(resp.message ?? '位置保存失败')
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? '位置保存失败')
  } finally {
    saveLoading.value = false
  }
}

function getCanvasRel(clientX: number, clientY: number) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  return { x: clientX - rect.left, y: clientY - rect.top }
}

function snapGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

function snapAlign(nx: number, ny: number, others: Student[]) {
  let rx = nx
  let ry = ny
  let h: number | null = null
  let v: number | null = null
  const cp = { l: nx, cx: nx + CARD_WIDTH / 2, r: nx + CARD_WIDTH, t: ny, cy: ny + CARD_HEIGHT / 2, b: ny + CARD_HEIGHT }

  for (const other of others) {
    const op = {
      l: other.x,
      cx: other.x + CARD_WIDTH / 2,
      r: other.x + CARD_WIDTH,
      t: other.y,
      cy: other.y + CARD_HEIGHT / 2,
      b: other.y + CARD_HEIGHT,
    }
    const horizontalPairs: [number, number][] = [
      [cp.t, op.t], [cp.t, op.cy], [cp.t, op.b],
      [cp.cy, op.t], [cp.cy, op.cy], [cp.cy, op.b],
      [cp.b, op.t], [cp.b, op.cy], [cp.b, op.b],
    ]
    for (const [a, b] of horizontalPairs) {
      if (Math.abs(a - b) < ALIGN_THRESHOLD) {
        ry = ny + (b - a)
        h = b
        break
      }
    }

    const verticalPairs: [number, number][] = [
      [cp.l, op.l], [cp.l, op.cx], [cp.l, op.r],
      [cp.cx, op.l], [cp.cx, op.cx], [cp.cx, op.r],
      [cp.r, op.l], [cp.r, op.cx], [cp.r, op.r],
    ]
    for (const [a, b] of verticalPairs) {
      if (Math.abs(a - b) < ALIGN_THRESHOLD) {
        rx = nx + (b - a)
        v = b
        break
      }
    }
  }

  return { x: rx, y: ry, h, v }
}

function showEl(el: HTMLDivElement | null, visible: boolean) {
  if (!el) return
  el.style.display = visible ? 'block' : 'none'
}

function setLineH(el: HTMLDivElement | null, top: number) {
  if (!el) return
  el.style.top = `${top}px`
}

function setLineV(el: HTMLDivElement | null, left: number) {
  if (!el) return
  el.style.left = `${left}px`
}

function highlightCard(id: number, active: boolean) {
  const el = cardRefs.get(id)
  if (!el) return
  if (active) {
    el.classList.add('border-cyan-400', 'shadow-md', 'z-40')
    el.classList.remove('border-gray-200')
  } else if (!selectedIdsRef.value.has(id)) {
    el.classList.remove('border-cyan-400', 'shadow-md', 'z-40')
    el.classList.add('border-gray-200')
  }
}

function clearPreview() {
  previewIds.forEach((id) => highlightCard(id, false))
  previewIds.clear()
}

function getGroupHandleTransform(group: StudentGroup) {
  if (isGroupDragging.value && groupDragName.value === group.name) {
    return `translate(${groupDragOffset.x}px, ${groupDragOffset.y}px)`
  }
  return ''
}

function getGroupHandleZClass(group: StudentGroup) {
  if (isGroupDragging.value && groupDragName.value === group.name) return 'z-[45]'
  return 'z-30'
}

function getStudentZClass(student: Student) {
  if (isGroupDragging.value && groupDragIds.has(student.id)) return 'z-[44]'
  if (selectedIds.value.has(student.id)) return 'z-40'
  return ''
}

function isGroupCollapsed(groupName: string) {
  return collapsedGroupNames.value.has(groupName)
}

function toggleGroupCollapsed(groupName: string) {
  const next = new Set(collapsedGroupNames.value)
  if (next.has(groupName)) {
    next.delete(groupName)
  } else {
    next.add(groupName)
  }
  collapsedGroupNames.value = next
}

function isStudentHiddenByCollapsedGroup(student: Student) {
  const name = student.groupName?.trim()
  return Boolean(name && collapsedGroupNames.value.has(name))
}

function findSelectedGroupName(left: number, top: number, right: number, bottom: number) {
  const group = studentGroups.value.find((item) => (
    item.x + item.width > left &&
    item.x < right &&
    item.y + GROUP_HANDLE_HEIGHT > top &&
    item.y < bottom
  ))
  return group?.name ?? ''
}

function getPreviewStudentPosition(student: Student): Student {
  if (!isDragging.value || !cardDragIds.has(student.id)) return student
  return {
    ...student,
    x: student.x + cardDragOffset.x,
    y: student.y + cardDragOffset.y,
  }
}

function getGroupHandleStyle(group: StudentGroup) {
  const previewStudents = students.value
    .filter((student) => student.groupName?.trim() === group.name)
    .map((student) => getPreviewStudentPosition(student))
  const layout = previewStudents.length > 0 ? createGroupLayout(previewStudents) : group
  return {
    left: `${layout.x}px`,
    top: `${layout.y}px`,
    minWidth: `${Math.min(Math.max(layout.width, 80), CANVAS_WIDTH - layout.x)}px`,
    height: `${GROUP_HANDLE_HEIGHT}px`,
    transform: getGroupHandleTransform(group),
  }
}

function handleCardHandleMouseDown(event: MouseEvent, student: Student) {
  event.preventDefault()
  event.stopPropagation()

  const ids = selectedIds.value.has(student.id) ? new Set(selectedIds.value) : new Set([student.id])
  selectedIds.value = ids
  selectedIdsRef.value = new Set(ids)
  selectionSource.value = 'card'
  selectedGroupName.value = ''

  dragBase.clear()
  students.value.forEach((s) => {
    if (ids.has(s.id)) dragBase.set(s.id, { x: s.x, y: s.y })
  })
  curOffset.clear()
  cardDragIds.clear()
  ids.forEach((id) => {
    curOffset.set(id, { x: 0, y: 0 })
    cardDragIds.add(id)
  })
  cardDragOffset.x = 0
  cardDragOffset.y = 0

  isDragging.value = true
  dragStart.x = event.clientX
  dragStart.y = event.clientY
  showEl(guideLineHRef.value, false)
  showEl(guideLineVRef.value, false)
  showEl(gridLineHRef.value, false)
  showEl(gridLineVRef.value, false)
  showEl(alignLineHRef.value, false)
  showEl(alignLineVRef.value, false)
  showEl(coordTipRef.value, false)
}

function handleCardBodyMouseDown(event: MouseEvent, student: Student) {
  event.preventDefault()
  event.stopPropagation()
  if (!selectedIds.value.has(student.id)) {
    const ids = new Set([student.id])
    selectedIds.value = ids
    selectedIdsRef.value = new Set(ids)
    selectionSource.value = 'card'
    selectedGroupName.value = ''
  }
}

function handleGroupHandleMouseDown(event: MouseEvent, group: StudentGroup) {
  event.preventDefault()
  event.stopPropagation()

  isGroupDragging.value = true
  groupDragName.value = group.name
  groupDragIds.clear()
  group.studentIds.forEach((id) => groupDragIds.add(id))
  groupDragBase.clear()
  students.value.forEach((student) => {
    if (groupDragIds.has(student.id)) groupDragBase.set(student.id, { x: student.x, y: student.y })
  })
  groupDragOffset.x = 0
  groupDragOffset.y = 0
  groupDragStart.x = event.clientX
  groupDragStart.y = event.clientY
  showEl(guideLineHRef.value, false)
  showEl(guideLineVRef.value, false)
  showEl(gridLineHRef.value, false)
  showEl(gridLineVRef.value, false)
  showEl(alignLineHRef.value, false)
  showEl(alignLineVRef.value, false)
  showEl(coordTipRef.value, false)
}

function handleCanvasMouseDown(event: MouseEvent) {
  const pos = getCanvasRel(event.clientX, event.clientY)
  selBoxData.value = { startX: pos.x, startY: pos.y }
  selBoxEnd.value = null
  dragDistance.value = { x: 0, y: 0 }
  showEl(selBoxRef.value, true)
  if (selBoxRef.value) {
    selBoxRef.value.style.left = `${pos.x}px`
    selBoxRef.value.style.top = `${pos.y}px`
    selBoxRef.value.style.width = '0'
    selBoxRef.value.style.height = '0'
  }
}

function handleMouseMove(event: MouseEvent) {
  if (isGroupDragging.value) {
    const dx = event.clientX - groupDragStart.x
    const dy = event.clientY - groupDragStart.y
    const bases = Array.from(groupDragBase.values())
    if (bases.length === 0) return

    const minX = Math.min(...bases.map((base) => base.x))
    const minY = Math.min(...bases.map((base) => base.y))
    const maxX = Math.max(...bases.map((base) => base.x + CARD_WIDTH))
    const maxY = Math.max(...bases.map((base) => base.y + CARD_HEIGHT))
    const nextMinX = Math.max(0, Math.min(snapGrid(Math.max(0, Math.min(minX + dx, CANVAS_WIDTH - (maxX - minX)))), CANVAS_WIDTH - (maxX - minX)))
    const nextMinY = Math.max(0, Math.min(snapGrid(Math.max(0, Math.min(minY + dy, CANVAS_HEIGHT - (maxY - minY)))), CANVAS_HEIGHT - (maxY - minY)))
    const offsetX = nextMinX - minX
    const offsetY = nextMinY - minY
    groupDragOffset.x = offsetX
    groupDragOffset.y = offsetY

    groupDragBase.forEach((_, id) => {
      const el = cardRefs.get(id)
      if (!el) return
      el.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    })
    showEl(gridLineHRef.value, true)
    showEl(gridLineVRef.value, true)
    setLineH(gridLineHRef.value, nextMinY)
    setLineV(gridLineVRef.value, nextMinX)
    showEl(coordTipRef.value, true)
    if (coordTipRef.value) {
      coordTipRef.value.style.left = `${nextMinX + maxX - minX + 8}px`
      coordTipRef.value.style.top = `${nextMinY}px`
      coordTipRef.value.textContent = `x: ${Math.round(nextMinX)}, y: ${Math.round(nextMinY)}`
    }
    return
  }

  if (isDragging.value) {
    const dx = event.clientX - dragStart.x
    const dy = event.clientY - dragStart.y
    const ids = selectedIdsRef.value
    const mainId = Array.from(ids)[0]
    const mainBase = dragBase.get(mainId)
    if (!mainBase) return

    let mainX = Math.max(0, Math.min(mainBase.x + dx, CANVAS_WIDTH - CARD_WIDTH))
    let mainY = Math.max(0, Math.min(mainBase.y + dy, CANVAS_HEIGHT - CARD_HEIGHT))
    mainX = Math.max(0, Math.min(snapGrid(mainX), CANVAS_WIDTH - CARD_WIDTH))
    mainY = Math.max(0, Math.min(snapGrid(mainY), CANVAS_HEIGHT - CARD_HEIGHT))
    const offsetX = mainX - mainBase.x
    const offsetY = mainY - mainBase.y

    dragBase.forEach((_, id) => {
      const el = cardRefs.get(id)
      if (!el) return
      el.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      curOffset.set(id, { x: offsetX, y: offsetY })
    })
    cardDragOffset.x = offsetX
    cardDragOffset.y = offsetY

    showEl(guideLineHRef.value, true)
    showEl(guideLineVRef.value, true)
    setLineH(guideLineHRef.value, mainY + CARD_HEIGHT / 2)
    setLineV(guideLineVRef.value, mainX + CARD_WIDTH / 2)
    showEl(gridLineHRef.value, true)
    showEl(gridLineVRef.value, true)
    setLineH(gridLineHRef.value, mainY)
    setLineV(gridLineVRef.value, mainX)
    showEl(alignLineHRef.value, false)
    showEl(alignLineVRef.value, false)

    showEl(coordTipRef.value, true)
    if (coordTipRef.value) {
      coordTipRef.value.style.left = `${mainX + CARD_WIDTH + 8}px`
      coordTipRef.value.style.top = `${mainY}px`
      coordTipRef.value.textContent = `x: ${Math.round(mainX)}, y: ${Math.round(mainY)}`
    }
    return
  }

  if (selBoxData.value) {
    const pos = getCanvasRel(event.clientX, event.clientY)
    const start = selBoxData.value
    const left = Math.min(start.startX, pos.x)
    const top = Math.min(start.startY, pos.y)
    const right = Math.max(start.startX, pos.x)
    const bottom = Math.max(start.startY, pos.y)
    selBoxEnd.value = { x: pos.x, y: pos.y }
    dragDistance.value = { x: Math.abs(pos.x - start.startX), y: Math.abs(pos.y - start.startY) }

    if (selBoxRef.value) {
      selBoxRef.value.style.left = `${left}px`
      selBoxRef.value.style.top = `${top}px`
      selBoxRef.value.style.width = `${right - left}px`
      selBoxRef.value.style.height = `${bottom - top}px`
    }

    const nextPreview = new Set<number>()
    students.value.forEach((s) => {
      if (s.x + CARD_WIDTH > left && s.x < right && s.y + CARD_HEIGHT > top && s.y < bottom) {
        nextPreview.add(s.id)
      }
    })
    previewIds.forEach((id) => {
      if (!nextPreview.has(id)) highlightCard(id, false)
    })
    nextPreview.forEach((id) => highlightCard(id, true))
    previewIds.clear()
    nextPreview.forEach((id) => previewIds.add(id))
  }
}

function handleMouseUp() {
  if (isGroupDragging.value) {
    isGroupDragging.value = false
    const ids = new Set(groupDragIds)
    const offsetX = groupDragOffset.x
    const offsetY = groupDragOffset.y

    students.value = students.value.map((student) => {
      if (!ids.has(student.id)) return student
      return {
        ...student,
        x: snapGrid(Math.max(0, Math.min(student.x + offsetX, CANVAS_WIDTH - CARD_WIDTH))),
        y: snapGrid(Math.max(0, Math.min(student.y + offsetY, CANVAS_HEIGHT - CARD_HEIGHT))),
      }
    })

    ids.forEach((id) => {
      const el = cardRefs.get(id)
      if (el) el.style.transform = ''
    })
    groupDragName.value = ''
    groupDragIds.clear()
    groupDragBase.clear()
    groupDragOffset.x = 0
    groupDragOffset.y = 0
    showEl(guideLineHRef.value, false)
    showEl(guideLineVRef.value, false)
    showEl(gridLineHRef.value, false)
    showEl(gridLineVRef.value, false)
    showEl(alignLineHRef.value, false)
    showEl(alignLineVRef.value, false)
    showEl(coordTipRef.value, false)
  }

  if (isDragging.value) {
    isDragging.value = false
    const ids = selectedIdsRef.value

    students.value = students.value.map((s) => {
      if (!ids.has(s.id)) return s
      const offset = curOffset.get(s.id)
      if (!offset) return s
      return {
        ...s,
        x: snapGrid(Math.max(0, Math.min(s.x + offset.x, CANVAS_WIDTH - CARD_WIDTH))),
        y: snapGrid(Math.max(0, Math.min(s.y + offset.y, CANVAS_HEIGHT - CARD_HEIGHT))),
      }
    })

    ids.forEach((id) => {
      const el = cardRefs.get(id)
      if (el) el.style.transform = ''
    })
    dragBase.clear()
    curOffset.clear()
    cardDragIds.clear()
    cardDragOffset.x = 0
    cardDragOffset.y = 0
    showEl(guideLineHRef.value, false)
    showEl(guideLineVRef.value, false)
    showEl(gridLineHRef.value, false)
    showEl(gridLineVRef.value, false)
    showEl(alignLineHRef.value, false)
    showEl(alignLineVRef.value, false)
    showEl(coordTipRef.value, false)
  }

  if (selBoxData.value) {
    showEl(selBoxRef.value, false)
    const moved = dragDistance.value
    if (!moved || (moved.x < 5 && moved.y < 5)) {
      selectedIds.value = new Set()
      selectedIdsRef.value = new Set()
      selectionSource.value = 'none'
      selectedGroupName.value = ''
      selBoxData.value = null
      selBoxEnd.value = null
      dragDistance.value = null
      clearPreview()
      return
    }

    const start = selBoxData.value
    const end = selBoxEnd.value
    if (end) {
      const left = Math.min(start.startX, end.x)
      const right = Math.max(start.startX, end.x)
      const top = Math.min(start.startY, end.y)
      const bottom = Math.max(start.startY, end.y)
      const ids = new Set<number>()
      students.value.forEach((s) => {
        if (s.x + CARD_WIDTH > left && s.x < right && s.y + CARD_HEIGHT > top && s.y < bottom) {
          ids.add(s.id)
        }
      })
      selectedIds.value = ids
      selectedIdsRef.value = new Set(ids)
      selectionSource.value = 'box'
      selectedGroupName.value = findSelectedGroupName(left, top, right, bottom)
    }

    selBoxData.value = null
    selBoxEnd.value = null
    dragDistance.value = null
    clearPreview()
  }
}

function bindCardRef(id: number, el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLDivElement) {
    cardRefs.set(id, el)
  } else {
    cardRefs.delete(id)
  }
}

onMounted(() => {
  fetchStudents()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="p-4">
    <Com1Card>
      <template #header-left>
        <span class="text-base font-semibold">我的学生 - 自由画布</span>
      </template>
      <template #header-right>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-blue-100">已选中: {{ selectedIds.size }} 个</span>
          <button
            v-if="selectionSource === 'box' && selectedIds.size > 0"
            type="button"
            class="rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-600"
            @click="openGroupDialog"
          >
            归类组
          </button>
          <button
            data-testid="student-grid-toggle"
            type="button"
            class="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/25"
            @click="showGrid = !showGrid"
          >
            {{ showGrid ? '隐藏网格线' : '显示网格线' }}
          </button>
          <Com1Button text="新增学生" variant="success" size="mini" @click="openAddDialog" />
          <Com1Button text="保存位置" variant="secondary" size="mini" :loading="saveLoading" @click="handleSavePositions" />
          <button
            v-if="selectedIds.size > 0"
            class="text-xs text-white underline hover:text-blue-100"
            @click="clearSelection"
          >
            取消选择
          </button>
        </div>
      </template>
    </Com1Card>

    <div v-if="loading" class="mt-4 flex justify-center items-center h-64 text-gray-500">
      加载中...
    </div>

    <div v-else class="mt-4">
      <div
        ref="canvasRef"
        class="relative overflow-hidden border-2 border-gray-200 rounded-xl bg-white select-none"
        :style="{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }"
        @mousedown="handleCanvasMouseDown"
      >
        <!-- 网格背景 -->
        <svg v-show="showGrid" data-testid="student-grid-bg" class="absolute inset-0 pointer-events-none" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT" style="opacity: 0.75">
          <defs>
            <pattern id="student-grid" :width="GRID_SIZE" :height="GRID_SIZE" patternUnits="userSpaceOnUse">
              <path :d="`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`" fill="none" stroke="#cbd5e1" stroke-width="0.8" />
            </pattern>
          </defs>
          <rect :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT" fill="url(#student-grid)" />
        </svg>

        <div data-testid="student-selection-box" ref="selBoxRef" class="absolute pointer-events-none border border-cyan-400 bg-cyan-400/10" style="display: none; left: 0; top: 0; width: 0; height: 0" />
        <div data-testid="student-guide-line-h" ref="guideLineHRef" class="absolute pointer-events-none bg-slate-400" :style="{ display: 'none', left: '0', height: '1px', width: `${CANVAS_WIDTH}px` }" />
        <div data-testid="student-guide-line-v" ref="guideLineVRef" class="absolute pointer-events-none bg-slate-400" :style="{ display: 'none', top: '0', width: '1px', height: `${CANVAS_HEIGHT}px` }" />
        <div data-testid="student-grid-line-h" ref="gridLineHRef" class="absolute pointer-events-none border-t border-dashed border-gray-300" :style="{ display: 'none', left: '0', height: '1px', width: `${CANVAS_WIDTH}px` }" />
        <div data-testid="student-grid-line-v" ref="gridLineVRef" class="absolute pointer-events-none border-l border-dashed border-gray-300" :style="{ display: 'none', top: '0', width: '1px', height: `${CANVAS_HEIGHT}px` }" />
        <div data-testid="student-align-line-h" ref="alignLineHRef" class="absolute pointer-events-none border-t border-dashed border-cyan-500" :style="{ display: 'none', left: '0', height: '1px', width: `${CANVAS_WIDTH}px` }" />
        <div data-testid="student-align-line-v" ref="alignLineVRef" class="absolute pointer-events-none border-l border-dashed border-cyan-500" :style="{ display: 'none', top: '0', width: '1px', height: `${CANVAS_HEIGHT}px` }" />
        <div data-testid="student-coord-tip" ref="coordTipRef" class="absolute pointer-events-none bg-gray-800 text-white text-xs px-2 py-1 rounded" style="display: none; left: 0; top: 0" />

        <div
          v-for="group in studentGroups"
          :key="group.name"
          data-testid="student-group-handle"
          :class="[
            'absolute flex cursor-grab items-center justify-between gap-2 rounded-t-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow',
            getGroupHandleZClass(group),
          ]"
          :style="getGroupHandleStyle(group)"
          @mousedown="(event) => handleGroupHandleMouseDown(event, group)"
        >
          <span class="min-w-0 flex-1 truncate">{{ group.name }}</span>
          <button
            type="button"
            data-testid="student-group-toggle"
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/80 transition hover:bg-white/15 hover:text-white"
            :title="isGroupCollapsed(group.name) ? '展开组' : '收起组'"
            :aria-label="isGroupCollapsed(group.name) ? '展开组' : '收起组'"
            @mousedown.stop
            @click.stop="toggleGroupCollapsed(group.name)"
          >
            <svg
              v-if="isGroupCollapsed(group.name)"
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16M12 4v16" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
            </svg>
          </button>
          <button
            type="button"
            data-testid="student-group-edit"
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/80 transition hover:bg-white/15 hover:text-white"
            title="编辑组名"
            aria-label="编辑组名"
            @mousedown.stop
            @click.stop="openEditGroupDialog(group.name)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div
          v-for="student in students"
          :key="student.id"
          v-show="!isStudentHiddenByCollapsedGroup(student)"
          :ref="(el) => bindCardRef(student.id, el)"
          :class="[
            'absolute rounded-lg border-2 bg-white overflow-hidden',
            selectedIds.has(student.id) ? 'border-cyan-400 shadow-md' : 'border-gray-200 hover:border-cyan-300',
            getStudentZClass(student),
          ]"
          :style="{
            left: `${student.x}px`,
            top: `${student.y}px`,
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            boxShadow: selectedIds.has(student.id) ? '0 2px 8px rgba(6, 182, 212, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
            userSelect: 'none',
            willChange: 'transform',
          }"
        >
          <div
            class="absolute left-0 top-0 right-0 flex items-center justify-between px-2 bg-gray-50 border-b border-gray-200 cursor-grab"
            :style="{ height: `${HANDLE_HEIGHT}px` }"
            @mousedown="(event) => handleCardHandleMouseDown(event, student)"
          >
            <div class="grid grid-cols-3 gap-[3px]" aria-label="拖拽句柄">
              <span v-for="index in 6" :key="index" class="w-1 h-1 rounded-full bg-gray-400" />
            </div>
            <button
              class="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition"
              title="编辑"
              @mousedown.stop
              @click.stop="openEditDialog(student)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          <div
            class="absolute left-0 right-0 bottom-0 flex flex-col justify-center items-center px-3 cursor-default"
            :style="{ top: `${HANDLE_HEIGHT}px` }"
            @mousedown="(event) => handleCardBodyMouseDown(event, student)"
          >
            <div class="text-base font-semibold text-gray-800 max-w-full truncate">{{ student.name }}</div>
            <div class="text-sm text-gray-500 mt-1">年龄: {{ student.age }}</div>
          </div>
        </div>

        <div v-if="students.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
          <div class="text-sm">暂无学生</div>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div class="flex items-center gap-2"><div class="w-6 h-0 border-t border-dashed border-gray-300" /><span>网格吸附线</span></div>
        <div class="flex items-center gap-2"><div class="w-6 h-0 bg-gray-400" /><span>位置指示线</span></div>
        <div class="flex items-center gap-2"><div class="w-6 h-0 border-t border-dashed border-cyan-500" /><span>对齐辅助线</span></div>
        <div class="flex items-center gap-2"><div class="w-6 h-3 border border-cyan-400 bg-cyan-400/10" /><span>框选范围</span></div>
      </div>
    </div>

    <Com1Dialog
      :open="showDialog"
      :title="isEdit ? '编辑学生' : '新增学生'"
      :confirm-text="isEdit ? '保存' : '添加'"
      :confirm-loading="dialogLoading"
      :confirm-disabled="!form.name.trim()"
      @confirm="handleConfirm"
      @cancel="closeDialog"
      @close="closeDialog"
    >
      <div class="space-y-4">
        <Com1Input
          :value="form.name"
          :config="{ text: '姓名', width: 'w-20' }"
          placeholder="请输入姓名"
          required
          :error="formError"
          @change="(value: string) => { form.name = value; formError = '' }"
          @enter="handleConfirm"
        />
        <Com1Input
          :value="form.age"
          :config="{ text: '年龄', width: 'w-20' }"
          type="number"
          placeholder="请输入年龄"
          @change="(value: string) => (form.age = value)"
          @enter="handleConfirm"
        />
      </div>
      <template #footer>
        <div v-if="isEdit && editingStudent" class="flex w-full items-center justify-between gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="dialogLoading"
            @click="handleDeleteStudent(editingStudent)"
          >
            删除学生
          </button>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              :disabled="dialogLoading"
              @click="closeDialog"
            >
              取消
            </button>
            <button
              type="button"
              :class="[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
                (dialogLoading || !form.name.trim()) ? 'opacity-50 cursor-not-allowed' : '',
              ]"
              :disabled="dialogLoading || !form.name.trim()"
              @click="handleConfirm"
            >
              <span v-if="dialogLoading" class="inline-flex items-center gap-1.5">
                <span class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                处理中...
              </span>
              <span v-else>保存</span>
            </button>
          </div>
        </div>
        <div v-else class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            :disabled="dialogLoading"
            @click="closeDialog"
          >
            取消
          </button>
          <button
            type="button"
            :class="[
              'rounded-lg px-3 py-1.5 text-sm font-medium transition',
              'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
              (dialogLoading || !form.name.trim()) ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            :disabled="dialogLoading || !form.name.trim()"
            @click="handleConfirm"
          >
            <span v-if="dialogLoading" class="inline-flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              处理中...
            </span>
            <span v-else>添加</span>
          </button>
        </div>
      </template>
    </Com1Dialog>

    <Com1Dialog
      :open="showGroupDialog"
      :title="editingGroupName ? '编辑组名' : '归类组'"
      :confirm-text="editingGroupName ? '保存' : '确定'"
      :confirm-disabled="!groupNameInput.trim()"
      @confirm="handleGroupConfirm"
      @cancel="closeGroupDialog"
      @close="closeGroupDialog"
    >
      <div class="space-y-4">
        <Com1Input
          :value="groupNameInput"
          :config="{ text: '组名称', width: 'w-20' }"
          placeholder="请输入组名称"
          required
          :error="groupError"
          @change="(value: string) => { groupNameInput = value; groupError = '' }"
          @enter="handleGroupConfirm"
        />
        <div v-if="editingGroupName" class="space-y-2">
          <div class="text-sm font-medium text-gray-700">组内学生</div>
          <div class="max-h-56 overflow-y-auto rounded-lg border border-gray-200">
            <div
              v-for="student in editingGroupStudents"
              :key="student.id"
              data-testid="student-group-member"
              class="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-2 last:border-b-0"
            >
              <span class="min-w-0 flex-1 truncate text-sm text-gray-800">{{ student.name }}</span>
              <button
                type="button"
                data-testid="student-group-member-detach"
                class="shrink-0 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                @click="detachStudentFromGroup(student.id)"
              >
                脱离分组
              </button>
            </div>
            <div v-if="editingGroupStudents.length === 0" class="px-3 py-4 text-sm text-gray-400">
              暂无学生
            </div>
          </div>
        </div>
      </div>
    </Com1Dialog>

    <Com1Message ref="msgRef" />
  </div>
</template>
