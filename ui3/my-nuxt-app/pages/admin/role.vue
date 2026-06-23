<template>
  <div class="p-4 flex flex-col gap-2">
    <Com1Card
      :config="{
        left: h('h1', { class: 'text-base font-bold' }, '角色管理'),
        right: h(Com1Button, {
          text: '添加角色', variant: 'primary', size: 'medium',
          onClick: () => { setEdit(null); showForm = true; formMsg = '' },
        }),
      }"
    />

    <Com1Dialog
      :open="showForm"
      :title="editId ? '编辑角色' : '添加角色'"
      :confirm-text="editId ? '保存' : '添加'"
      :on-confirm="handleSubmit"
      :confirm-disabled="!form.name || !form.key"
      width="max-w-xl"
      @close="showForm = false"
    >
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <Com1Input :value="form.name" config-text="角色名称" placeholder="例如：内容编辑" @change="(v) => (form.name = v)" />
          <Com1Input :value="form.key" config-text="角色标识" placeholder="例如：EDITOR" :disabled="!!editId" @change="(v) => (form.key = v.toUpperCase())" />
          <Com1Input :value="String(form.orderNum)" config-text="排序值" type="number" @change="(v) => (form.orderNum = Number(v))" />
          <Com1Select
            :value="form.status ? 'true' : 'false'"
            :options="[{ value: 'true', label: '启用' }, { value: 'false', label: '禁用' }]"
            config-text="状态"
            @change="(v) => (form.status = v === 'true')"
          />
        </div>
        <Com1Input :value="form.description" config-text="描述" placeholder="角色的简要描述" @change="(v) => (form.description = v)" />
        <p v-if="formMsg" class="text-red-500 text-sm">{{ formMsg }}</p>
      </div>
    </Com1Dialog>

    <Com1Card>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b bg-gray-50">
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">序号</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">角色名称</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">角色标识</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">描述</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">用户数</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">排序</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr><td colspan="8" class="px-4 py-6 text-center text-gray-400">加载中...</td></tr>
            </template>
            <template v-else-if="roles.length === 0">
              <tr><td colspan="8" class="px-4 py-6 text-center text-gray-400">暂无角色</td></tr>
            </template>
            <template v-else>
              <tr v-for="(role, i) in roles" :key="role.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">{{ i + 1 }}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="font-medium">{{ role.name }}</span>
                  <span v-if="PRESET_ROLE_KEYS.includes(role.key)" class="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">预设</span>
                </td>
                <td class="px-4 py-3 text-sm font-mono text-xs text-gray-600">{{ role.key }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ role.description ?? '-' }}</td>
                <td class="px-4 py-3 text-sm text-center">{{ role._count?.users ?? 0 }}</td>
                <td class="px-4 py-3 text-sm">
                  <Com1Button
                    :text="role.status ? '启用' : '禁用'"
                    :variant="role.status ? 'success' : 'secondary'"
                    size="mini"
                    :disabled="PRESET_ROLE_KEYS.includes(role.key)"
                    @click="handleToggleStatus(role)"
                  />
                </td>
                <td class="px-4 py-3 text-sm">{{ role.orderNum }}</td>
                <td class="px-4 py-3 text-sm">
                  <Com1Button text="编辑" variant="primary" size="mini" @click="setEdit(role)" />
                  <Com1Button
                    text="删除" variant="danger" size="mini" class="ml-2"
                    :disabled="PRESET_ROLE_KEYS.includes(role.key)"
                    @click="handleDelete(role.id, role.key)"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </Com1Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { Com1Confirm } from '~/components/Com1Confirm'

const PRESET_ROLE_KEYS = ['USER_ADMIN0', 'USER_ADMIN1', 'USER_VIP0', 'USER_VIP1']
const roles = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const editId = ref<number | null>(null)
const formMsg = ref('')
const form = ref({ name: '', key: '', description: '', status: true, orderNum: 0 })

function setEdit(role: any) {
  editId.value = role ? role.id : null
  form.value = {
    name: role ? role.name : '',
    key: role ? role.key : '',
    description: role ? role.description ?? '' : '',
    status: role ? role.status : true,
    orderNum: role ? role.orderNum : 0,
  }
  formMsg.value = ''
  showForm.value = true
}

async function handleSubmit() {
  formMsg.value = ''
  const method = editId.value ? 'PUT' : 'POST'
  const body: any = { ...form.value }
  if (editId.value) body.id = editId.value

  const res = await $fetch<any>('/api/admin/role', { method, headers: { 'Content-Type': 'application/json' }, body })
  if (res.code === 200) {
    showForm.value = false
    fetchRoles()
  } else {
    formMsg.value = res.message ?? '操作失败'
  }
}

async function handleToggleStatus(role: any) {
  if (PRESET_ROLE_KEYS.includes(role.key)) { alert('预设角色禁止禁用！'); return }
  const res = await $fetch<any>('/api/admin/role', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: { id: role.id, status: !role.status },
  })
  if (res.code === 200) fetchRoles()
  else alert(res.message ?? '修改失败')
}

async function handleDelete(id: number, key: string) {
  if (PRESET_ROLE_KEYS.includes(key)) { alert('预设角色禁止删除！'); return }
  if (!(await Com1Confirm({ message: '确定删除该角色？' }))) return
  const res = await $fetch<any>('/api/admin/role', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: { id } })
  if (res.code === 200) fetchRoles()
  else alert(res.message ?? '删除失败')
}

async function fetchRoles() {
  const res = await $fetch<any>('/api/admin/role')
  if (res.code === 200) roles.value = res.data
}

onMounted(async () => { await fetchRoles(); loading.value = false })
</script>
