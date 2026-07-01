<script setup lang="ts">
definePageMeta({ layout: 'admin' })

// ─── Inline SVG Icons (Lucide-style, no extra package) ───────────────────────
function IconShield() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' })]); }
function IconStar() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' })]); }
function IconUser() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }), h('circle', { cx: 12, cy: 7, r: 4 })]); }
function IconCircle() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('circle', { cx: 12, cy: 12, r: 10 })]); }

// ─── Types ───────────────────────────────────────────────────────────────────
interface Role {
  id: number
  name: string
  key: string
  description: string | null
}

interface MenuWithPermission {
  id: number
  name: string
  path: string | null
  orderNum: number
  group: string
  permission: {
    canAccess: boolean
  }
}

interface MenuGroup {
  pathPrefix: string
  label: string
  menus: MenuWithPermission[]
  selectedAll: boolean
  indeterminate: boolean
}

// ─── State ───────────────────────────────────────────────────────────────────
const roles = ref<Role[]>([])
const selectedRoleId = ref<number | null>(null)
const menuGroups = ref<MenuGroup[]>([])
const loading = ref(false)
const saving = ref(false)
const showConfirm = ref(false)
const msgRef = ref<{ success: (m: string) => void; error: (m: string) => void } | null>(null)

// ─── Fetch Data ──────────────────────────────────────────────────────────────
async function fetchRoles() {
  loading.value = true
  try {
    const resp = await $fetch<{ code: number; data: Role[] }>('/api/admin/role')
    if (resp.ok) {
      roles.value = resp.data
      const defaultRole = resp.data.find(r => r.key === 'USER_VIP1')
      if (defaultRole) {
        selectedRoleId.value = defaultRole.id
      } else if (resp.data.length > 0) {
        selectedRoleId.value = resp.data[0]!.id
      }
    }
  } catch {
    msgRef.value?.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchMenuPermissions(roleId: number) {
  loading.value = true
  try {
    const resp = await $fetch<{ code: number; data: { role: Role; permissions: MenuWithPermission[] } }>(
      `/api/admin/role/${roleId}/menu-permission`
    )
    if (resp.ok) {
      buildMenuGroups(resp.data.permissions)
    } else {
      msgRef.value?.error('加载权限数据失败')
    }
  } catch {
    msgRef.value?.error('加载权限数据失败')
  } finally {
    loading.value = false
  }
}

// ─── Build Menu Groups ────────────────────────────────────────────────────────
function buildMenuGroups(permissions: MenuWithPermission[]) {
  const adminMenus = permissions.filter(p => (p.path ?? '').startsWith('/admin'))
  const webMenus = permissions.filter(p => (p.path ?? '').startsWith('/web'))

  const groups: MenuGroup[] = []
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
      label: '前台会员菜单',
      menus: webMenus,
      selectedAll: false,
      indeterminate: false,
    })
  }

  groups.forEach(g => updateGroupState(g))
  menuGroups.value = groups
}

function updateGroupState(group: MenuGroup) {
  const total = group.menus.length
  const checked = group.menus.filter(m => m.permission.canAccess).length
  group.selectedAll = total > 0 && checked === total
  group.indeterminate = checked > 0 && checked < total
}

// ─── Toggle Helpers ──────────────────────────────────────────────────────────
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

// ─── Actions ─────────────────────────────────────────────────────────────────
function openSaveConfirm() {
  showConfirm.value = true
}

async function handleSave() {
  if (!selectedRoleId.value) return
  showConfirm.value = false

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
    if ((resp as { ok: boolean }).ok) {
      msgRef.value?.success('权限保存成功')
    } else {
      msgRef.value?.error(((resp as { message?: string }).message) || '保存失败')
    }
  } catch {
    msgRef.value?.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

function onRoleSelect(roleId: number) {
  selectedRoleId.value = roleId
  fetchMenuPermissions(roleId)
}

function getRoleIcon(key: string) {
  if (key.startsWith('USER_ADMIN')) return IconShield
  if (key.startsWith('USER_VIP')) return IconStar
  return IconCircle
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────
watch(selectedRoleId, (newId) => {
  if (newId !== null) {
    fetchMenuPermissions(newId)
  }
})

onMounted(fetchRoles)
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto space-y-4">
    <!-- Header Card -->
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
          @click="openSaveConfirm"
        />
      </template>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 flex flex-col items-center justify-center gap-3">
        <div class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p class="text-sm text-gray-500">加载中...</p>
      </div>

      <template v-else>
        <!-- Role Selection -->
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
              <component :is="getRoleIcon(role.key)" class="inline w-4 h-4" aria-hidden="true" />
              <span>{{ role.name }}</span>
            </label>
          </div>
        </div>

        <!-- No Role Selected State -->
        <div v-if="!selectedRoleId" class="p-12 text-center text-gray-400 text-sm">
          请先选择要配置权限的角色
        </div>

        <!-- Role Selected: Show Permission Groups -->
        <div v-else-if="menuGroups.length > 0" class="space-y-6">
          <div
            v-for="group in menuGroups"
            :key="group.pathPrefix"
            class="border border-gray-200 rounded-xl overflow-hidden"
          >
            <!-- Group Header -->
            <div class="bg-blue-800 px-4 py-3 flex items-center gap-3">
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

            <!-- Menu Items -->
            <div class="divide-y divide-gray-100 bg-white">
              <div
                v-for="item in group.menus"
                :key="item.id"
                :class="[
                  'flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition',
                  !item.permission.canAccess ? 'opacity-50' : '',
                ]"
              >
                <input
                  :id="`menu-${item.id}`"
                  type="checkbox"
                  :checked="item.permission.canAccess"
                  class="w-4 h-4 accent-blue-600 flex-shrink-0 cursor-pointer"
                  @change="toggleMenu(item.id, ($event.target as HTMLInputElement).checked)"
                />
                <label
                  :for="`menu-${item.id}`"
                  class="flex-1 flex items-center gap-2 cursor-pointer"
                >
                  <span class="text-sm text-gray-700 font-medium">{{ item.name }}</span>
                  <code v-if="item.path" class="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">{{ item.path }}</code>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- No Permission Data for Selected Role -->
        <div v-else class="p-12 text-center text-gray-400 text-sm">
          该角色暂无菜单权限配置
        </div>
      </template>
    </Com1Card>

    <!-- Confirm Dialog -->
    <Com1Confirm
      v-model:open="showConfirm"
      title="确认保存"
      message="确定要保存权限变更吗？"
      confirm-text="保存"
      @confirm="handleSave"
    />

    <!-- Message Toast -->
    <Com1Message ref="msgRef" />
  </div>
</template>
