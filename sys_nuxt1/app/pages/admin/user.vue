<script setup lang="ts">
import { U1Message, U1Confirm } from 'tool_ui1'

definePageMeta({ layout: 'admin' })

// ─── Inline SVG Icons (Lucide-style, no extra package) ───────────────────────
function IconShield() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' })]); }
function IconFileText() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }), h('polyline', { points: '14 2 14 8 20 8' }), h('line', { x1: 16, y1: 13, x2: 8, y2: 13 }), h('line', { x1: 16, y1: 17, x2: 8, y2: 17 }), h('polyline', { points: '10 9 9 9 8 9' })]); }
function IconUser() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }), h('circle', { cx: 12, cy: 7, r: 4 })]); }
function IconCircle() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('circle', { cx: 12, cy: 12, r: 10 })]); }

// ─── Types ───────────────────────────────────────────────────────────────────
interface Role {
  id: number
  name: string
  key: string
}

interface User {
  id: number
  nickname: string
  email: string
  remark: string | null
  roles: Role[]
}

interface UserForm {
  nickname: string
  email: string
  password: string
  remark: string
  roleIds: number[]
}

interface EditUserForm extends Omit<UserForm, 'password'> {
  id: number | null
}

interface ApiResponse<T> {
  code: number
  data?: T
  message?: string
}

// ─── State ───────────────────────────────────────────────────────────────────
const users = ref<User[]>([])
const roles = ref<Role[]>([])
const loading = ref(true)
const saving = ref(false)

const searchKeyword = ref('')
const roleFilter = ref('all')
const pendingRoleToggles = ref<Set<string>>(new Set())

const showAddDialog = ref(false)
const showEditDialog = ref(false)

const form = ref<UserForm>({
  nickname: '',
  email: '',
  password: '',
  remark: '',
  roleIds: [] as number[],
})
const editForm = ref<EditUserForm>({
  id: null,
  nickname: '',
  email: '',
  remark: '',
  roleIds: [],
})
const formError = ref('')

// 用户表格列
const columns = [
  { type: 'index', label: '序号', width: 70, align: 'center' },
  { prop: 'nickname', label: '用户名', minWidth: 120 },
  { prop: 'email', label: '邮箱', minWidth: 160 },
  { prop: 'roles', label: '角色', minWidth: 260 },
  { prop: 'remark', label: '描述', minWidth: 120 },
  { type: 'action', label: '操作', width: 150, align: 'center' },
]

const roleFilterOptions = computed(() => [
  { value: 'all', label: '全部角色' },
  ...roles.value.map((role) => ({ value: String(role.id), label: role.name })),
])

const filteredUsers = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  const selectedRoleId = roleFilter.value === 'all' ? null : Number(roleFilter.value)

  return users.value.filter((item) => {
    const matchKeyword = !keyword
      || item.nickname.toLowerCase().includes(keyword)
      || item.email.toLowerCase().includes(keyword)
      || (item.remark ?? '').toLowerCase().includes(keyword)
      || item.roles.some(itemRole => itemRole.name.toLowerCase().includes(keyword))

    const matchRole = selectedRoleId === null
      || item.roles.some(itemRole => itemRole.id === selectedRoleId)

    return matchKeyword && matchRole
  })
})

const emptyText = computed(() => (users.value.length === 0 ? '暂无用户数据' : '没有匹配的用户'))

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!err || typeof err !== 'object') return fallback

  const error = err as {
    data?: { message?: string; statusMessage?: string }
    response?: { _data?: { message?: string; statusMessage?: string } }
    message?: string
    statusMessage?: string
  }
  return error.data?.message
    || error.data?.statusMessage
    || error.response?._data?.message
    || error.response?._data?.statusMessage
    || error.statusMessage
    || error.message
    || fallback
}

// ─── Fetch Data ──────────────────────────────────────────────────────────────
async function fetchUsers() {
  loading.value = true
  try {
    const resp = await $fetch<ApiResponse<User[]>>('/api/admin/user')
    if (resp.ok) {
      users.value = resp.data ?? []
    }
  } catch (err) {
    U1Message.error(getApiErrorMessage(err, '加载用户列表失败'))
  } finally {
    loading.value = false
  }
}

async function fetchRoles() {
  try {
    const resp = await $fetch<ApiResponse<Role[]>>('/api/admin/role')
    if (resp.ok) {
      roles.value = resp.data ?? []
      const defaultRole = roles.value.find(r => r.key === 'USER_VIP1')
      if (defaultRole) {
        form.value.roleIds = [defaultRole.id]
      }
    }
  } catch (err) {
    U1Message.error(getApiErrorMessage(err, '加载角色列表失败'))
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────
function openAddDialog() {
  formError.value = ''
  const defaultRole = roles.value.find(r => r.key === 'USER_VIP1')
  form.value = {
    nickname: '',
    email: '',
    password: '',
    remark: '',
    roleIds: defaultRole ? [defaultRole.id] : [],
  }
  showAddDialog.value = true
}

async function handleAdd() {
  formError.value = ''
  if (!form.value.nickname.trim()) {
    formError.value = '请输入用户名'
    return
  }
  if (!form.value.email.trim()) {
    formError.value = '请输入邮箱'
    return
  }
  if (!form.value.password.trim()) {
    formError.value = '请输入密码'
    return
  }
  if (form.value.roleIds.length === 0) {
    formError.value = '请至少选择一个角色'
    return
  }

  saving.value = true
  try {
    const payload: Record<string, unknown> = {
      nickname: form.value.nickname.trim(),
      email: form.value.email.trim(),
      roleIds: form.value.roleIds,
    }
    if (form.value.remark.trim()) {
      payload.remark = form.value.remark.trim()
    }
    if (form.value.password.trim()) {
      payload.password = form.value.password
    }

    const resp = await $fetch<ApiResponse<User>>('/api/admin/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (resp.ok) {
      U1Message.success('添加成功')
      showAddDialog.value = false
      fetchUsers()
    } else {
      formError.value = resp.message || '添加失败'
    }
  } catch (err) {
    formError.value = getApiErrorMessage(err, '添加失败，请重试')
  } finally {
    saving.value = false
  }
}

function openEditDialog(user: User) {
  formError.value = ''
  editForm.value = {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    remark: user.remark ?? '',
    roleIds: user.roles.map(itemRole => itemRole.id),
  }
  showEditDialog.value = true
}

async function handleUpdate() {
  formError.value = ''
  if (!editForm.value.id) {
    formError.value = '缺少用户ID'
    return
  }
  if (!editForm.value.nickname.trim()) {
    formError.value = '请输入用户名'
    return
  }
  if (!editForm.value.email.trim()) {
    formError.value = '请输入邮箱'
    return
  }
  if (editForm.value.roleIds.length === 0) {
    formError.value = '请至少选择一个角色'
    return
  }

  saving.value = true
  try {
    const resp = await $fetch<ApiResponse<User>>('/api/admin/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editForm.value.id,
        nickname: editForm.value.nickname.trim(),
        email: editForm.value.email.trim(),
        remark: editForm.value.remark.trim() || null,
        roleIds: editForm.value.roleIds,
      }),
    })

    if (resp.ok) {
      U1Message.success('保存成功')
      showEditDialog.value = false
      fetchUsers()
    } else {
      formError.value = resp.message || '保存失败'
    }
  } catch (err) {
    formError.value = getApiErrorMessage(err, '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

async function askDelete(id: number) {
  const ok = await U1Confirm({
    title: '确认删除',
    message: '确定删除该用户？删除后无法恢复。',
    type: 'danger',
    confirmText: '删除',
  })
  if (!ok) return

  try {
    const resp = await $fetch<ApiResponse<null>>(`/api/admin/user?id=${id}`, { method: 'DELETE' })
    if (resp.ok) {
      U1Message.success('删除成功')
      fetchUsers()
    } else {
      U1Message.error(resp.message || '删除失败')
    }
  } catch (err) {
    U1Message.error(getApiErrorMessage(err, '删除失败，请重试'))
  }
}

// ─── Role Checkbox Helpers ────────────────────────────────────────────────────
function isRoleChecked(user: User, roleId: number): boolean {
  return user.roles?.some(r => r.id === roleId) ?? false
}

function getRolePendingKey(userId: number, roleId: number): string {
  return `${userId}:${roleId}`
}

function toggleUserRole(userId: number, roleId: number, checked: boolean) {
  const pendingKey = getRolePendingKey(userId, roleId)
  if (pendingRoleToggles.value.has(pendingKey)) return
  const user = users.value.find(u => u.id === userId)
  if (!user) return

  const currentIds = user.roles.map(r => r.id)
  const newIds = checked
    ? [...currentIds, roleId]
    : currentIds.filter(id => id !== roleId)

  // Optimistic update
  const roleObj = roles.value.find(r => r.id === roleId)
  const optimisticRoles: Role[] = checked
    ? [...user.roles, { id: roleId, name: roleObj?.name ?? '', key: roleObj?.key ?? '' }]
    : user.roles.filter(r => r.id !== roleId)

  const idx = users.value.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users.value[idx] = { ...user, roles: optimisticRoles }
  }

  // Sync to server
  pendingRoleToggles.value.add(pendingKey)
  ;(async () => {
    try {
      const resp = await $fetch<ApiResponse<User>>('/api/admin/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, roleIds: newIds }),
      })
      if (resp.code !== 200) {
        // Rollback
        fetchUsers()
        U1Message.error(resp.message || '修改角色失败')
      }
    } catch (err) {
      fetchUsers()
      U1Message.error(getApiErrorMessage(err, '修改角色失败，请重试'))
    } finally {
      pendingRoleToggles.value.delete(pendingKey)
    }
  })()
}

function toggleRoleIds(roleIds: number[], roleId: number, checked: boolean): number[] {
  if (checked) {
    return roleIds.includes(roleId) ? roleIds : [...roleIds, roleId]
  }
  return roleIds.filter(id => id !== roleId)
}

function toggleFormRole(roleId: number, checked: boolean) {
  form.value.roleIds = toggleRoleIds(form.value.roleIds, roleId, checked)
}

function toggleEditFormRole(roleId: number, checked: boolean) {
  editForm.value.roleIds = toggleRoleIds(editForm.value.roleIds, roleId, checked)
}

function getRoleIcon(key: string) {
  if (key.startsWith('USER_ADMIN0')) return IconShield
  if (key.startsWith('USER_ADMIN')) return IconFileText
  if (key.startsWith('USER_VIP')) return IconUser
  return IconCircle
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>

<template>
  <div class="p-4 max-w-6xl mx-auto space-y-4">
    <!-- Header Card -->
    <U1Card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold">用户列表</span>
          <U1Button type="primary" size="small" @click="openAddDialog">添加用户</U1Button>
        </div>
      </template>

      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <U1Input v-model="searchKeyword" placeholder="搜索用户名、邮箱、描述或角色" clearable />
          <U1Select v-model="roleFilter" :options="roleFilterOptions" />
        </div>
        <p class="text-sm text-gray-500">
          共 {{ filteredUsers.length }} / {{ users.length }} 个用户
        </p>
      </div>

      <U1Table :columns="columns" :data="filteredUsers" row-key="id" :loading="loading" :empty-text="emptyText">
        <!-- 角色: 行内多选 -->
        <template #cell-roles="{ row }">
          <div class="flex flex-wrap gap-2">
            <U1Checkbox
              v-for="role in roles"
              :key="role.id"
              :model-value="isRoleChecked(row, role.id)"
              :disabled="pendingRoleToggles.has(getRolePendingKey(row.id, role.id))"
              @change="(v) => toggleUserRole(row.id, role.id, v === true)"
            >
              <span :class="isRoleChecked(row, role.id) ? 'font-medium text-blue-700' : 'text-gray-500'">
                <component :is="getRoleIcon(role.key)" class="inline w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                {{ role.name }}
              </span>
            </U1Checkbox>
          </div>
        </template>

        <template #cell-remark="{ row }">{{ row.remark ?? '-' }}</template>

        <template #action="{ row }">
          <U1Button type="info" size="mini" @click="openEditDialog(row)">编辑</U1Button>
          <U1Button type="danger" size="mini" class="ml-2" @click="askDelete(row.id)">删除</U1Button>
        </template>
      </U1Table>
    </U1Card>

    <!-- Add Dialog -->
    <U1Dialog v-model="showAddDialog" title="添加用户" width="460px" @close="showAddDialog = false">
      <div class="flex flex-col gap-4">
        <U1InputLabel v-model="form.nickname" label="用户名" label-width="72px" input-width="320px" placeholder="请输入用户名" />
        <U1InputLabel v-model="form.email" label="邮箱" label-width="72px" input-width="320px" placeholder="请输入邮箱" />
        <label class="flex items-center gap-2">
          <span class="w-[72px] text-right text-sm text-gray-600 shrink-0">密码</span>
          <U1Input v-model="form.password" show-password placeholder="请输入密码" />
        </label>
        <U1InputLabel v-model="form.remark" label="描述" label-width="72px" input-width="320px" placeholder="可选" />

        <!-- Role Checkboxes -->
        <div class="flex items-start gap-2">
          <span class="w-[72px] text-right pt-1 text-sm text-gray-600 shrink-0">角色</span>
          <div class="flex-1 flex flex-wrap gap-3">
            <U1Checkbox
              v-for="role in roles"
              :key="role.id"
              :model-value="form.roleIds.includes(role.id)"
              @change="(v) => toggleFormRole(role.id, v === true)"
            >
              <span class="text-gray-700">
                <component :is="getRoleIcon(role.key)" class="inline w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                {{ role.name }}
              </span>
            </U1Checkbox>
          </div>
        </div>

        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

        <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <U1Button size="small" @click="showAddDialog = false">取消</U1Button>
          <U1Button type="primary" size="small" :loading="saving" @click="handleAdd">提交</U1Button>
        </div>
      </div>
    </U1Dialog>

    <!-- Edit Dialog -->
    <U1Dialog v-model="showEditDialog" title="编辑用户" width="460px" @close="showEditDialog = false">
      <div class="flex flex-col gap-4">
        <U1InputLabel v-model="editForm.nickname" label="用户名" label-width="72px" input-width="320px" placeholder="请输入用户名" />
        <U1InputLabel v-model="editForm.email" label="邮箱" label-width="72px" input-width="320px" placeholder="请输入邮箱" />
        <U1InputLabel v-model="editForm.remark" label="描述" label-width="72px" input-width="320px" placeholder="可选" />

        <!-- Role Checkboxes -->
        <div class="flex items-start gap-2">
          <span class="w-[72px] text-right pt-1 text-sm text-gray-600 shrink-0">角色</span>
          <div class="flex-1 flex flex-wrap gap-3">
            <U1Checkbox
              v-for="role in roles"
              :key="role.id"
              :model-value="editForm.roleIds.includes(role.id)"
              @change="(v) => toggleEditFormRole(role.id, v === true)"
            >
              <span class="text-gray-700">
                <component :is="getRoleIcon(role.key)" class="inline w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                {{ role.name }}
              </span>
            </U1Checkbox>
          </div>
        </div>

        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

        <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <U1Button size="small" @click="showEditDialog = false">取消</U1Button>
          <U1Button type="primary" size="small" :loading="saving" @click="handleUpdate">保存</U1Button>
        </div>
      </div>
    </U1Dialog>
  </div>
</template>
