<script setup lang="ts">
import { U1Message, U1Confirm } from 'tool_ui1'

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

const statusOptions = [
  { value: 'true', label: '启用' },
  { value: 'false', label: '禁用' },
]

const columns = [
  { type: 'index', label: '序号', width: 70, align: 'center' },
  { prop: 'name', label: '角色名称', minWidth: 160 },
  { prop: 'key', label: '角色标识', minWidth: 140 },
  { prop: 'description', label: '描述', minWidth: 180 },
  { prop: 'userCount', label: '用户数', width: 90, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center' },
  { prop: 'orderNum', label: '排序', width: 80, align: 'center' },
  { type: 'action', label: '操作', width: 170, align: 'center' },
]

async function fetchRoles() {
  loading.value = true
  try {
    const resp = await $fetch<{ code: number; data: Role[] }>('/api/admin/role')
    if (resp.ok) {
      roles.value = resp.data
    }
  } catch {
    U1Message.error('加载角色失败')
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
      U1Message.success(isEditing ? '保存成功' : '添加成功')
    } else {
      formError.value = resp.message ?? '操作失败'
    }
  } catch (err: any) {
    formError.value = err?.data?.message ?? '操作失败'
  } finally {
    submitting.value = false
  }
}

async function askDelete(role: Role) {
  if (PRESET_ROLE_KEYS.includes(role.key)) {
    U1Message.error('预设角色禁止删除')
    return
  }

  const ok = await U1Confirm({
    title: '删除确认',
    message: `确定删除角色「${role.name}」吗?`,
    type: 'danger',
    confirmText: '删除',
  })
  if (!ok) return

  try {
    const resp = await $fetch<{ code: number; message?: string }>(`/api/admin/role?id=${role.id}`, {
      method: 'DELETE',
    })
    if (resp.ok) {
      fetchRoles()
      U1Message.success('删除成功')
    } else {
      U1Message.error(resp.message ?? '删除失败')
    }
  } catch (err: any) {
    U1Message.error(err?.data?.message ?? '删除失败')
  }
}

async function handleToggleStatus(role: Role) {
  if (PRESET_ROLE_KEYS.includes(role.key)) {
    U1Message.error('预设角色禁止禁用')
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
      U1Message.success(!role.status ? '已启用' : '已禁用')
    } else {
      U1Message.error(resp.message ?? '操作失败')
    }
  } catch (err: any) {
    U1Message.error(err?.data?.message ?? '操作失败')
  }
}

function isPreset(key: string) {
  return PRESET_ROLE_KEYS.includes(key)
}

onMounted(fetchRoles)
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto space-y-4">
    <U1Card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold">角色管理</span>
          <U1Button type="primary" size="small" @click="openAdd">添加角色</U1Button>
        </div>
      </template>

      <U1Table :columns="columns" :data="roles" row-key="id" :loading="loading" empty-text="暂无角色">
        <template #cell-name="{ row }">
          <span class="font-medium text-gray-800">{{ row.name }}</span>
          <U1Tag v-if="isPreset(row.key)" type="warning" class="ml-2">预设</U1Tag>
        </template>
        <template #cell-key="{ row }">
          <span class="font-mono text-gray-600">{{ row.key }}</span>
        </template>
        <template #cell-description="{ row }">{{ row.description ?? '—' }}</template>
        <template #cell-userCount="{ row }">{{ row._count?.users ?? 0 }}</template>
        <template #cell-status="{ row }">
          <U1Button
            :type="row.status ? 'success' : 'info'"
            size="mini"
            :disabled="isPreset(row.key)"
            @click="handleToggleStatus(row)"
          >{{ row.status ? '启用' : '禁用' }}</U1Button>
        </template>
        <template #action="{ row }">
          <U1Button type="primary" size="mini" @click="openEdit(row)">编辑</U1Button>
          <U1Button
            type="danger"
            size="mini"
            :disabled="isPreset(row.key)"
            class="ml-2"
            @click="askDelete(row)"
          >删除</U1Button>
        </template>
      </U1Table>
    </U1Card>

    <U1Dialog v-model="showForm" :title="editId ? '编辑角色' : '添加角色'" width="580px" @close="closeForm">
      <div class="flex flex-col gap-4">
        <U1InputLabel v-model="form.name" label="角色名称" label-width="80px" input-width="360px" placeholder="例如：内容编辑" />
        <U1InputLabel
          :model-value="form.key"
          label="角色标识"
          label-width="80px"
          input-width="360px"
          placeholder="例如：EDITOR"
          :disabled="!!editId"
          @update:model-value="(v) => (form.key = String(v).toUpperCase())"
        />
        <U1InputLabel v-model="form.orderNum" type="number" label="排序值" label-width="80px" input-width="360px" />
        <label class="flex items-center gap-2">
          <span class="w-20 text-right text-sm text-gray-600 shrink-0">状态</span>
          <U1Select :model-value="String(form.status)" :options="statusOptions" @change="(v) => (form.status = v === 'true')" />
        </label>
        <U1InputLabel v-model="form.description" label="描述" label-width="80px" input-width="360px" placeholder="角色的简要描述" />

        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

        <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <U1Button size="small" @click="closeForm">取消</U1Button>
          <U1Button
            type="primary"
            size="small"
            :loading="submitting"
            :disabled="!form.name.trim() || !form.key.trim()"
            @click="handleSubmit"
          >{{ editId ? '保存' : '添加' }}</U1Button>
        </div>
      </div>
    </U1Dialog>
  </div>
</template>
