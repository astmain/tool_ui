<script setup lang="ts">
interface Role {
  id: number
  name: string
  key: string
}

interface MenuWithPermission {
  id: number
  name: string
  path: string | null
  icon: string | null
  orderNum: number
  group: string
  permission: {
    canAccess: boolean
  }
}

interface GroupMenu {
  pathPrefix: string
  label: string
  menus: MenuWithPermission[]
  selectedAll: boolean
  indeterminate: boolean
}

const roles = ref<Role[]>([])
const loading = ref(true)
const saving = ref(false)
const selectedRoleId = ref<number | null>(null)
const menuGroups = ref<GroupMenu[]>([])
const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void } | null>(null)

async function fetchRoles() {
  const resp = await $fetch<{ code: number; data: Role[] }>('/api/admin/role')
  if (resp.code === 200) {
    roles.value = resp.data
    const defaultRole = resp.data.find(r => r.key === 'USER_VIP1')
    if (defaultRole) {
      selectedRoleId.value = defaultRole.id
    } else if (resp.data.length > 0) {
      selectedRoleId.value = resp.data[0].id
    }
  }
  loading.value = false
}

async function fetchMenuPermissions(roleId: number) {
  saving.value = true
  try {
    const resp = await $fetch<{ code: number; data: { role: Role; permissions: MenuWithPermission[] } }>(
      `/api/admin/role/${roleId}/menu-permission`
    )
    if (resp.code === 200) {
      buildMenuGroups(resp.data.permissions)
    }
  } finally {
    saving.value = false
  }
}

function buildMenuGroups(permissions: MenuWithPermission[]) {
  const adminMenus = permissions.filter(p => (p.path ?? '').startsWith('/admin'))
  const webMenus = permissions.filter(p => (p.path ?? '').startsWith('/web'))

  const groups: GroupMenu[] = []
  if (adminMenus.length > 0) {
    groups.push({
      pathPrefix: '/admin',
      label: '后台管理菜单',
      menus: adminMenus,
      selectedAll: false,
      indeterminate: false,
    })
  }
  if (webMenus.length > 0) {
    groups.push({
      pathPrefix: '/web',
      label: '前台菜单',
      menus: webMenus,
      selectedAll: false,
      indeterminate: false,
    })
  }

  groups.forEach(g => updateGroupState(g))
  menuGroups.value = groups
}

function updateGroupState(group: GroupMenu) {
  const total = group.menus.length
  const checked = group.menus.filter(m => m.permission.canAccess).length
  group.selectedAll = total > 0 && checked === total
  group.indeterminate = checked > 0 && checked < total
}

function toggleGroup(pathPrefix: string, checked: boolean) {
  const group = menuGroups.value.find(g => g.pathPrefix === pathPrefix)
  if (!group) return
  group.menus.forEach(m => {
    m.permission.canAccess = checked
  })
  updateGroupState(group)
}

function toggleMenu(menuId: number, checked: boolean) {
  for (const group of menuGroups.value) {
    const item = group.menus.find(m => m.id === menuId)
    if (item) {
      item.permission.canAccess = checked
      updateGroupState(group)
      break
    }
  }
}

async function savePermissions() {
  if (!selectedRoleId.value) return

  saving.value = true
  const permissions = menuGroups.value
    .flatMap(g => g.menus)
    .map(m => ({
      menuId: m.id,
      canAccess: m.permission.canAccess,
    }))

  try {
    const resp = await $fetch(`/api/admin/role/${selectedRoleId.value}/menu-permission`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { permissions },
    })
    if (resp.code === 200) {
      msgRef.value?.success('保存成功')
    } else {
      msgRef.value?.error((resp as any).message || '保存失败')
    }
  } catch {
    msgRef.value?.error('保存失败')
  }
  saving.value = false
}

function onRoleSelect(roleId: number) {
  selectedRoleId.value = roleId
  fetchMenuPermissions(roleId)
}

function getRoleIcon(key: string): string {
  if (key.startsWith('USER_ADMIN')) return '👑'
  if (key.startsWith('USER_VIP')) return '⭐'
  return '👤'
}

watch(selectedRoleId, (newId) => {
  if (newId !== null) {
    fetchMenuPermissions(newId)
  }
})

onMounted(fetchRoles)
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto space-y-4">
    <Com1Card>
      <template #header-left>
        <span class="text-base font-semibold">菜单权限管理</span>
      </template>
      <template #header-right>
        <Com1Button
          text="保存"
          variant="primary"
          size="small"
          :loading="saving"
          :disabled="!selectedRoleId"
          @click="savePermissions"
        />
      </template>

      <div v-if="loading" class="py-8 text-center text-gray-500">加载中...</div>
      <template v-else>
        <div class="mb-5">
          <h3 class="text-sm font-medium text-gray-700 mb-3">选择角色</h3>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="role in roles"
              :key="role.id"
              :class="[
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition text-sm',
                selectedRoleId === role.id
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
              ]"
            >
              <input
                type="radio"
                name="role"
                :value="role.id"
                :checked="selectedRoleId === role.id"
                class="sr-only"
                @change="onRoleSelect(role.id)"
              />
              <span>{{ getRoleIcon(role.key) }}</span>
              <span>{{ role.name }}</span>
            </label>
          </div>
        </div>

        <div v-if="menuGroups.length > 0" class="space-y-6">
          <div
            v-for="group in menuGroups"
            :key="group.pathPrefix"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="bg-[#1e40af] px-4 py-3 flex items-center gap-3">
              <span class="text-white font-medium text-sm">{{ group.label }}</span>
              <div class="ml-auto flex items-center gap-3">
                <label class="flex items-center gap-1.5 text-sm text-blue-200 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="group.selectedAll"
                    class="w-4 h-4 accent-white"
                    @change="toggleGroup(group.pathPrefix, ($event.target as HTMLInputElement).checked)"
                  />
                  全选
                </label>
                <button
                  class="text-xs text-blue-200 hover:text-white transition"
                  @click="toggleGroup(group.pathPrefix, false)"
                >
                  取消
                </button>
              </div>
            </div>

            <div class="divide-y divide-gray-100">
              <div
                v-for="item in group.menus"
                :key="item.id"
                class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
              >
                <input
                  :id="`menu-${item.id}`"
                  type="checkbox"
                  :checked="item.permission.canAccess"
                  class="w-4 h-4 accent-blue-600"
                  @change="toggleMenu(item.id, ($event.target as HTMLInputElement).checked)"
                />
                <label
                  :for="`menu-${item.id}`"
                  class="flex-1 flex items-center gap-2 cursor-pointer"
                >
                  <span class="text-sm text-gray-700">{{ item.name }}</span>
                  <code class="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{{ item.path }}</code>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="py-8 text-center text-gray-400">暂无菜单数据</div>
      </template>
    </Com1Card>

    <Com1Message ref="msgRef" />
  </div>
</template>
