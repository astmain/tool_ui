<script setup lang="ts">
definePageMeta({ layout: 'admin' })

interface Role {
  id: number
  name: string
  key: string
  description: string | null
  status: boolean
  orderNum: number
  _count?: { users: number }
}

const PRESET_ROLE_KEYS = ['USER_ADMIN0', 'USER_ADMIN1', 'USER_VIP0', 'USER_VIP1']

const roles = ref<Role[]>([])
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const editId = ref<number | null>(null)
const form = ref({ name: '', key: '', description: '', status: true, orderNum: 0 })
const formError = ref('')
const confirmOpen = ref(false)
const confirmTarget = ref<Role | null>(null)
const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void } | null>(null)

async function fetchRoles() {
  loading.value = true
  try {
    const resp = await $fetch<{ code: number; data: Role[] }>('/api/admin/role')
    if (resp.ok) {
      roles.value = resp.data
    }
  } catch {
    msgRef.value?.error('加载角色失败')
  } finally {
    loading.value = false
  }
}

function openAdd() {
  editId.value = null
  form.value = { name: '', key: '', description: '', status: true, orderNum: 0 }
  formError.value = ''
  showForm.value = true
}

function openEdit(role: Role) {
  editId.value = role.id
  form.value = {
    name: role.name,
    key: role.key,
    description: role.description ?? '',
    status: role.status,
    orderNum: role.orderNum,
  }
  formError.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editId.value = null
  formError.value = ''
}

async function handleSubmit() {
  if (!form.value.name.trim() || !form.value.key.trim()) {
    formError.value = '请填写角色名称和标识'
    return
  }

  submitting.value = true
  formError.value = ''

  try {
    const isEditing = editId.value !== null
    const payload = {
      ...(isEditing && editId.value !== null && { id: editId.value }),
      name: form.value.name.trim(),
      key: form.value.key.trim().toUpperCase(),
      description: form.value.description.trim() || null,
      status: form.value.status,
      orderNum: form.value.orderNum,
    }
    const url = editId.value
      ? `/api/admin/role?id=${editId.value}`
      : '/api/admin/role'
    const method = isEditing ? 'PUT' : 'POST'

    const resp = await $fetch<{ code: number; message?: string }>(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })

    if (resp.ok) {
      closeForm()
      fetchRoles()
      msgRef.value?.success(isEditing ? '保存成功' : '添加成功')
    } else {
      formError.value = resp.message ?? '操作失败'
    }
  } catch (err: any) {
    formError.value = err?.data?.message ?? '操作失败'
  } finally {
    submitting.value = false
  }
}

function askDelete(role: Role) {
  if (PRESET_ROLE_KEYS.includes(role.key)) {
    msgRef.value?.error('预设角色禁止删除')
    return
  }
  confirmTarget.value = role
  confirmOpen.value = true
}

async function handleDelete() {
  if (!confirmTarget.value) return
  const id = confirmTarget.value.id
  confirmOpen.value = false
  confirmTarget.value = null

  try {
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/role?id=${id}`, {
      method: 'DELETE',
    })
    if (resp.ok) {
      fetchRoles()
      msgRef.value?.success('删除成功')
    } else {
      msgRef.value?.error(resp.message ?? '删除失败')
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? '删除失败')
  }
}

async function handleToggleStatus(role: Role) {
  if (PRESET_ROLE_KEYS.includes(role.key)) {
    msgRef.value?.error('预设角色禁止禁用')
    return
  }

  try {
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/role?id=${role.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { id: role.id, status: !role.status },
    })
    if (resp.ok) {
      fetchRoles()
      msgRef.value?.success(!role.status ? '已启用' : '已禁用')
    } else {
      msgRef.value?.error(resp.message ?? '操作失败')
    }
  } catch (err: any) {
    msgRef.value?.error(err?.data?.message ?? '操作失败')
  }
}

function isPreset(key: string) {
  return PRESET_ROLE_KEYS.includes(key)
}

onMounted(fetchRoles)
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto space-y-4">
    <Com1Card>
      <template #header-left>
        <span class="text-base font-semibold">角色管理</span>
      </template>
      <template #header-right>
        <Com1Button text="添加角色" variant="primary" size="small" @click="openAdd" />
      </template>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b bg-gray-50">
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">序号</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">角色名称</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">角色标识</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">描述</th>
              <th class="px-4 py-3 text-center text-sm font-medium text-gray-600">用户数</th>
              <th class="px-4 py-3 text-center text-sm font-medium text-gray-600">状态</th>
              <th class="px-4 py-3 text-center text-sm font-medium text-gray-600">排序</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-12 text-center text-gray-400">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  加载中...
                </div>
              </td>
            </tr>
            <tr v-else-if="roles.length === 0">
              <td colspan="8" class="px-4 py-12 text-center text-gray-400">暂无角色</td>
            </tr>
            <template v-else>
              <tr
                v-for="(role, i) in roles"
                :key="role.id"
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 text-sm text-gray-500">{{ i + 1 }}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="font-medium text-gray-800">{{ role.name }}</span>
                  <span
                    v-if="isPreset(role.key)"
                    class="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded"
                  >预设</span>
                </td>
                <td class="px-4 py-3 text-sm font-mono text-gray-600 bg-gray-50">{{ role.key }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ role.description ?? '—' }}</td>
                <td class="px-4 py-3 text-sm text-center">{{ role._count?.users ?? 0 }}</td>
                <td class="px-4 py-3 text-center">
                  <Com1Button
                    :text="role.status ? '启用' : '禁用'"
                    :variant="role.status ? 'success' : 'secondary'"
                    size="mini"
                    :disabled="isPreset(role.key)"
                    @click="handleToggleStatus(role)"
                  />
                </td>
                <td class="px-4 py-3 text-sm text-center text-gray-500">{{ role.orderNum }}</td>
                <td class="px-4 py-3 text-sm">
                  <Com1Button text="编辑" variant="primary" size="mini" @click="openEdit(role)" />
                  <Com1Button
                    text="删除"
                    variant="danger"
                    size="mini"
                    :disabled="isPreset(role.key)"
                    class="ml-2"
                    @click="askDelete(role)"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </Com1Card>

    <Com1Dialog
      :open="showForm"
      :title="editId ? '编辑角色' : '添加角色'"
      :confirm-text="editId ? '保存' : '添加'"
      width="max-w-xl"
      :confirm-loading="submitting"
      :confirm-disabled="!form.name.trim() || !form.key.trim()"
      :on-confirm="handleSubmit"
      @cancel="closeForm"
      @close="closeForm"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <Com1Input
            :value="form.name"
            :config="{ text: '角色名称', width: 'w-20' }"
            placeholder="例如：内容编辑"
            @change="(val) => (form.name = val)"
          />
          <Com1Input
            :value="form.key"
            :config="{ text: '角色标识', width: 'w-20' }"
            placeholder="例如：EDITOR"
            :disabled="!!editId"
            @change="(val) => (form.key = val.toUpperCase())"
          />
          <Com1Input
            :value="String(form.orderNum)"
            :config="{ text: '排序值', width: 'w-20' }"
            type="number"
            @change="(val) => (form.orderNum = Number(val))"
          />
          <Com1Select
            :value="form.status"
            :options="[{ value: true, label: '启用' }, { value: false, label: '禁用' }]"
            :config="{ text: '状态', width: 'w-20' }"
            @change="(val: string) => (form.status = val === 'true')"
          />
        </div>
        <Com1Input
          :value="form.description"
          :config="{ text: '描述', width: 'w-20' }"
          placeholder="角色的简要描述"
          @change="(val) => (form.description = val)"
        />
        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
      </div>
    </Com1Dialog>

    <Com1Confirm
      v-model:open="confirmOpen"
      message="确定删除该角色？"
      title="删除确认"
      confirm-text="删除"
      @confirm="handleDelete"
      @cancel="confirmTarget = null"
    />

    <Com1Message ref="msgRef" />
  </div>
</template>
