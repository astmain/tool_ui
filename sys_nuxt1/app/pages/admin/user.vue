<script setup lang="ts">
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
const showConfirmDelete = ref(false)
const deleteTargetId = ref<number | null>(null)

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
const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void } | null>(null)

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
    msgRef.value?.error(getApiErrorMessage(err, '加载用户列表失败'))
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
    msgRef.value?.error(getApiErrorMessage(err, '加载角色列表失败'))
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
      msgRef.value?.success('添加成功')
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
      msgRef.value?.success('保存成功')
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

function confirmDelete(id: number) {
  deleteTargetId.value = id
  showConfirmDelete.value = true
}

async function handleDelete() {
  if (deleteTargetId.value === null) return
  const id = deleteTargetId.value
  showConfirmDelete.value = false
  deleteTargetId.value = null

  try {
    const resp = await $fetch<ApiResponse<null>>(`/api/admin/user?id=${id}`, { method: 'DELETE' })
    if (resp.ok) {
      msgRef.value?.success('删除成功')
      fetchUsers()
    } else {
      msgRef.value?.error(resp.message || '删除失败')
    }
  } catch (err) {
    msgRef.value?.error(getApiErrorMessage(err, '删除失败，请重试'))
  }
}

// ─── Role Checkbox Helpers ────────────────────────────────────────────────────
function isRoleChecked(user: User, roleId: number): boolean {
  return user.roles?.some(r => r.id === roleId) ?? false
}

function getRoleNameById(roleId: number): string {
  return roles.value.find(r => r.id === roleId)?.name ?? ''
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
        msgRef.value?.error(resp.message || '修改角色失败')
      }
    } catch (err) {
      fetchUsers()
      msgRef.value?.error(getApiErrorMessage(err, '修改角色失败，请重试'))
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
    <Com1Card>
      <template #header-left>
        <span class="text-base font-semibold">用户列表</span>
      </template>
      <template #header-right>
        <Com1Button text="添加用户" variant="primary" size="small" @click="openAddDialog" />
      </template>

      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div class="relative w-full md:max-w-xs">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索用户名、邮箱、描述或角色"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            v-model="roleFilter"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-44"
          >
            <option value="all">全部角色</option>
            <option
              v-for="role in roles"
              :key="role.id"
              :value="String(role.id)"
            >
              {{ role.name }}
            </option>
          </select>
        </div>
        <p class="text-sm text-gray-500">
          共 {{ filteredUsers.length }} / {{ users.length }} 个用户
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 flex flex-col items-center justify-center gap-3">
        <div class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p class="text-sm text-gray-500">加载中...</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">序号</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">用户名</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">邮箱</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">角色</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">描述</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in filteredUsers"
              :key="user.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition"
            >
              <!-- 序号 -->
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ index + 1 }}</td>

              <!-- 用户名 -->
              <td class="px-4 py-3 text-gray-800 whitespace-nowrap">{{ user.nickname }}</td>

              <!-- 邮箱 -->
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ user.email }}</td>

              <!-- 角色 (inline checkbox) -->
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="role in roles"
                    :key="role.id"
                    :class="['inline-flex items-center gap-1.5 text-xs', pendingRoleToggles.has(getRolePendingKey(user.id, role.id)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
                  >
                    <input
                      type="checkbox"
                      class="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                      :checked="isRoleChecked(user, role.id)"
                      :disabled="pendingRoleToggles.has(getRolePendingKey(user.id, role.id))"
                      @change="toggleUserRole(user.id, role.id, ($event.target as HTMLInputElement).checked)"
                    />
                    <span :class="{
                      'font-medium text-blue-700': isRoleChecked(user, role.id),
                      'text-gray-500': !isRoleChecked(user, role.id),
                    }">
                      <component :is="getRoleIcon(role.key)" class="inline w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                      {{ role.name }}
                    </span>
                  </label>
                </div>
              </td>

              <!-- 描述 -->
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">
                {{ user.remark ?? '-' }}
              </td>

              <!-- 操作 -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <Com1Button
                    text="编辑"
                    variant="secondary"
                    size="mini"
                    @click="openEditDialog(user)"
                  />
                  <Com1Button
                    text="删除"
                    variant="danger"
                    size="mini"
                    @click="confirmDelete(user.id)"
                  />
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-4 py-16 text-center">
                <div class="flex flex-col items-center gap-2 text-gray-400">
                  <svg class="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p class="text-sm">{{ users.length === 0 ? '暂无用户数据' : '没有匹配的用户' }}</p>
                  <Com1Button
                    v-if="users.length === 0"
                    text="添加用户"
                    variant="secondary"
                    size="mini"
                    @click="openAddDialog"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Com1Card>

    <!-- Add Dialog -->
    <Com1Dialog
      :open="showAddDialog"
      title="添加用户"
      confirm-text="提交"
      width="max-w-md"
      :confirm-loading="saving"
      :on-confirm="handleAdd"
      @cancel="showAddDialog = false"
      @close="showAddDialog = false"
    >
      <div class="space-y-4">
        <Com1Input
          :value="form.nickname"
          :config="{ text: '用户名' }"
          placeholder="请输入用户名"
          required
          @change="(val: string) => { form.nickname = val }"
        />
        <Com1Input
          :value="form.email"
          :config="{ text: '邮箱' }"
          type="email"
          placeholder="请输入邮箱"
          required
          @change="(val: string) => { form.email = val }"
        />
        <Com1Input
          :value="form.password"
          :config="{ text: '密码' }"
          type="password"
          placeholder="请输入密码"
          required
          @change="(val: string) => { form.password = val }"
        />
        <Com1Input
          :value="form.remark"
          :config="{ text: '描述' }"
          placeholder="可选"
          @change="(val: string) => { form.remark = val }"
        />

        <!-- Role Checkboxes -->
        <div class="flex items-start gap-3">
          <label class="w-20 text-right pt-2 text-sm font-medium text-gray-700 shrink-0">
            角色
          </label>
          <div class="flex-1 flex flex-wrap gap-3 pt-1">
            <label
              v-for="role in roles"
              :key="role.id"
              class="inline-flex items-center gap-1.5 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                :checked="form.roleIds.includes(role.id)"
                @change="toggleFormRole(role.id, ($event.target as HTMLInputElement).checked)"
              />
              <span class="text-gray-700">
                <component :is="getRoleIcon(role.key)" class="inline w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                {{ role.name }}
              </span>
            </label>
          </div>
        </div>

        <p v-if="formError" class="text-red-500 text-sm pl-[96px]">{{ formError }}</p>
      </div>
    </Com1Dialog>

    <!-- Edit Dialog -->
    <Com1Dialog
      :open="showEditDialog"
      title="编辑用户"
      confirm-text="保存"
      width="max-w-md"
      :confirm-loading="saving"
      :on-confirm="handleUpdate"
      @cancel="showEditDialog = false"
      @close="showEditDialog = false"
    >
      <div class="space-y-4">
        <Com1Input
          :value="editForm.nickname"
          :config="{ text: '用户名' }"
          placeholder="请输入用户名"
          required
          @change="(val: string) => { editForm.nickname = val }"
        />
        <Com1Input
          :value="editForm.email"
          :config="{ text: '邮箱' }"
          type="email"
          placeholder="请输入邮箱"
          required
          @change="(val: string) => { editForm.email = val }"
        />
        <Com1Input
          :value="editForm.remark"
          :config="{ text: '描述' }"
          placeholder="可选"
          @change="(val: string) => { editForm.remark = val }"
        />

        <!-- Role Checkboxes -->
        <div class="flex items-start gap-3">
          <label class="w-20 text-right pt-2 text-sm font-medium text-gray-700 shrink-0">
            角色
          </label>
          <div class="flex-1 flex flex-wrap gap-3 pt-1">
            <label
              v-for="role in roles"
              :key="role.id"
              class="inline-flex items-center gap-1.5 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                :checked="editForm.roleIds.includes(role.id)"
                @change="toggleEditFormRole(role.id, ($event.target as HTMLInputElement).checked)"
              />
              <span class="text-gray-700">
                <component :is="getRoleIcon(role.key)" class="inline w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                {{ role.name }}
              </span>
            </label>
          </div>
        </div>

        <p v-if="formError" class="text-red-500 text-sm pl-[96px]">{{ formError }}</p>
      </div>
    </Com1Dialog>

    <!-- Delete Confirm -->
    <Com1Confirm
      v-model:open="showConfirmDelete"
      message="确定删除该用户？删除后无法恢复。"
      title="确认删除"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="handleDelete"
      @cancel="deleteTargetId = null"
    />

    <!-- Message Toast -->
    <Com1Message ref="msgRef" />
  </div>
</template>
