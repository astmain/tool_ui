<template>
  <div class="p-4 flex flex-col gap-2">
    <Com1Card
      :config="{
        left: h('h1', { class: 'text-base font-bold' }, '用户列表'),
        right: h(Com1Button, { text: '添加用户', variant: 'primary', size: 'medium', onClick: () => showForm = true }),
      }"
    />

    <Com1Dialog
      :open="showForm"
      title="添加用户"
      confirm-text="提交"
      :on-confirm="handleAdd"
      @close="showForm = false"
    >
      <div class="space-y-4">
        <Com1Input :value="form.nickname" config-text="用户名" placeholder="请输入用户名" @change="(v) => form.nickname = v" />
        <Com1Input :value="form.email" config-text="邮箱" type="email" placeholder="请输入邮箱" @change="(v) => form.email = v" />
        <Com1Input :value="form.password" config-text="密码" type="password" placeholder="请输入密码" @change="(v) => form.password = v" />
        <Com1Input :value="form.remark" config-text="描述" placeholder="可选" @change="(v) => form.remark = v" />
        <Com1CheckBox
          :value="form.roleIds"
          :options="roles.map((r) => ({ value: r.id, label: r.name }))"
          config-text="角色"
          @change="(v) => (form.roleIds = v)"
        />
        <p v-if="formMsg" class="text-red-500 text-sm">{{ formMsg }}</p>
      </div>
    </Com1Dialog>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div v-if="loading" class="p-4 text-gray-500">加载中...</div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b bg-gray-50">
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">序号</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">用户名</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">邮箱</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">角色</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">描述</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in users" :key="user.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ i + 1 }}</td>
            <td class="px-4 py-3 text-sm">{{ user.nickname }}</td>
            <td class="px-4 py-3 text-sm">{{ user.email }}</td>
            <td class="px-4 py-3 text-sm">
              <div class="flex flex-wrap gap-1">
                <label
                  v-for="role in roles"
                  :key="role.id"
                  class="flex items-center gap-1 text-xs cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="(user.roles || []).some((r: any) => r.id === role.id)"
                    @change="(e) => handleRolesChange(user.id, (e.target as HTMLInputElement).checked, role.id)"
                  />
                  {{ role.name }}
                </label>
              </div>
            </td>
            <td class="px-4 py-3 text-sm">{{ user.remark ?? '-' }}</td>
            <td class="px-4 py-3 text-sm">
              <Com1Button text="删除" variant="danger" size="mini" @click="handleDelete(user.id)" />
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="px-4 py-6 text-center text-gray-400">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { Com1Confirm } from '~/components/Com1Confirm'

interface Role { id: number; name: string; key: string }
interface User { id: number; nickname: string; email: string; roles: Role[]; remark: string | null }

const users = ref<User[]>([])
const roles = ref<Role[]>([])
const loading = ref(true)
const showForm = ref(false)
const formMsg = ref('')
const form = ref({ nickname: '', email: '', password: '', roleIds: [] as number[], remark: '' })

async function fetchUsers() {
  const res = await $fetch<any>('/api/admin/user')
  if (res.code === 200) users.value = res.data
}

async function fetchRoles() {
  const res = await $fetch<any>('/api/admin/role')
  if (res.code === 200) {
    roles.value = res.data
    const defaultRole = res.data.find((r: Role) => r.key === 'USER_VIP1')
    if (defaultRole) form.value.roleIds = [defaultRole.id]
  }
}

async function handleAdd() {
  formMsg.value = ''
  const res = await $fetch<any>('/api/admin/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: form.value,
  })
  if (res.code === 200) {
    showForm.value = false
    form.value = { nickname: '', email: '', password: '', roleIds: [], remark: '' }
    fetchUsers()
  } else {
    formMsg.value = res.message ?? '添加失败'
  }
}

async function handleRolesChange(userId: number, checked: boolean, roleId: number) {
  const user = users.value.find((u) => u.id === userId)
  if (!user) return

  const newRoleIds = checked
    ? [...(user.roles || []).map((r) => r.id), roleId]
    : (user.roles || []).map((r: Role) => r.id).filter((rid) => rid !== roleId)

  const optimisticRoles = checked
    ? [...(user.roles || []), { id: roleId, name: roles.value.find((r) => r.id === roleId)?.name ?? '', key: '' }]
    : (user.roles || []).filter((r: Role) => r.id !== roleId)

  const idx = users.value.findIndex((u) => u.id === userId)
  users.value[idx] = { ...user, roles: optimisticRoles }

  const res = await $fetch<any>('/api/admin/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: { id: userId, roleIds: newRoleIds },
  })
  if (res.code !== 200) {
    fetchUsers()
    alert(res.message ?? '修改失败')
  }
}

async function handleDelete(id: number) {
  if (!(await Com1Confirm({ message: '确定删除该用户？' }))) return
  const res = await $fetch<any>(`/api/admin/user?id=${id}`, { method: 'DELETE' })
  if (res.code === 200) fetchUsers()
  else alert(res.message ?? '删除失败')
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchRoles()])
  loading.value = false
})
</script>
