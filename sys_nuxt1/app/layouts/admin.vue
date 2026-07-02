<template>
  <U1Layout1
    v-model:collapsed="collapsed"
    :menus="menuItems"
    :active-path="activePath"
    :config="{ sidebarWidth: '224px', collapsedWidth: '64px' }"
    class="admin-layout"
    style="height: 100vh"
    @select="onSelect"
  >
    <!-- 侧边栏顶部: 头像 + 昵称 + 加载/鉴权状态 -->
    <template #header>
      <div class="flex items-center gap-2 mb-2">
        <button class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium hover:bg-blue-500 transition cursor-pointer shrink-0" @click="showProfile = true">{{ userInfo?.nickname?.slice(0, 1) ?? '?' }}</button>
        <span v-if="!collapsed" class="font-bold text-white truncate">{{ userInfo?.nickname ?? '加载中...' }}</span>
      </div>
      <div v-if="authError" class="text-red-400 text-sm mb-2">{{ collapsed ? '!' : '未登录或登录已过期' }}</div>
      <div v-else-if="loading" class="text-gray-500 text-sm mb-2">{{ collapsed ? '...' : '加载中...' }}</div>
    </template>

    <!-- 侧边栏底部: 折叠开关 + 版本 -->
    <template #footer>
      <div class="border-t border-gray-700 pt-2 mt-2">
        <button class="flex items-center gap-2 text-gray-400 hover:text-white transition" :title="collapsed ? '展开侧边栏' : '收起侧边栏'" @click="collapsed = !collapsed">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'" /></svg>
          <span v-if="!collapsed" class="truncate">v1.0</span>
        </button>
      </div>
    </template>

    <!-- 主内容区 -->
    <slot />

    <!-- 弹窗 -->
    <Com1Dialog :open="showProfile" title="个人信息" width="max-w-sm" :top="100" @close="showProfile = false">
      <AdminProfileContent v-if="userInfo" :user-info="userInfo" @edit-nickname="openEdit('nickname')" @edit-email="openEdit('email')" @edit-password="openEdit('password')" @edit-avatar="openEdit('avatar')" @logout="handleLogout" />
    </Com1Dialog>
    <Com1Dialog :open="editNicknameOpen" title="修改昵称" width="max-w-sm" :top="100" @close="editNicknameOpen = false">
      <AdminEditNicknameForm v-if="userInfo" :user-info="userInfo" @success="handleUpdateSuccess" @cancel="editNicknameOpen = false" />
    </Com1Dialog>
    <Com1Dialog :open="editEmailOpen" title="修改邮箱" width="max-w-sm" :top="100" @close="editEmailOpen = false">
      <AdminEditEmailForm v-if="userInfo" :user-info="userInfo" @success="handleUpdateSuccess" @cancel="editEmailOpen = false" />
    </Com1Dialog>
    <Com1Dialog :open="editPasswordOpen" title="修改密码" width="max-w-sm" :top="100" @close="editPasswordOpen = false">
      <AdminEditPasswordForm v-if="userInfo" :user-info="userInfo" @cancel="editPasswordOpen = false" @logout="handleLogout" />
    </Com1Dialog>
    <Com1Dialog :open="editAvatarOpen" title="修改头像" width="max-w-sm" :top="100" @close="editAvatarOpen = false">
      <AdminEditAvatarForm v-if="userInfo" :user-info="userInfo" @success="handleUpdateSuccess" @cancel="editAvatarOpen = false" />
    </Com1Dialog>
  </U1Layout1>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// U1Layout1 的菜单项类型 (组件库未从包根导出该类型, 此处本地声明)
interface Layout1MenuItem {
  path: string
  title: string
  icon?: string
  disabled?: boolean
}

interface Role { id: number; name: string; key: string }
interface MenuItem { id: number; name: string; path: string | null; group?: string; orderNum?: number; permission?: { canAccess: boolean } }
interface UserInfo { id: number; nickname: string; email: string; avatar?: string; roles: Role[]; roleIds?: number[]; createdAt: string | Date }

const route = useRoute()
const collapsed = ref(false)
const showProfile = ref(false)
const editNicknameOpen = ref(false)
const editEmailOpen = ref(false)
const editPasswordOpen = ref(false)
const editAvatarOpen = ref(false)
const userInfo = ref<UserInfo | null>(null)
const menus = ref<MenuItem[]>([])
const loading = ref(true)
const authError = ref(false)

// 组装 U1Layout1 的菜单数据: 固定"首页" + 动态权限菜单
const menuItems = computed<Layout1MenuItem[]>(() => {
  const items: Layout1MenuItem[] = [{ path: '/admin', title: '首页', icon: 'mi-home' }]
  for (const m of menus.value) {
    if (m.path) items.push({ path: m.path, title: m.name, icon: iconFor(m.path) })
  }
  return items
})

// 按路径关键字为动态菜单匹配图标 class (menu-permission 需在 menu 之前判断)
function iconFor(path: string): string {
  if (path.includes('article')) return 'mi-file'
  if (path.includes('menu-permission')) return 'mi-permission'
  if (path.includes('menu')) return 'mi-menu'
  if (path.includes('user')) return 'mi-user'
  if (path.includes('role')) return 'mi-role'
  if (path.includes('setting')) return 'mi-setting'
  if (path.includes('student')) return 'mi-user'
  return 'mi-list'
}

// 计算当前高亮项: 优先精确匹配, 否则取最长前缀匹配
const activePath = computed(() => {
  const paths = menuItems.value.map((i) => i.path)
  const exact = paths.find((p) => p === route.path)
  if (exact) return exact
  const prefix = paths.filter((p) => route.path.startsWith(p + '/')).sort((a, b) => b.length - a.length)[0]
  return prefix ?? ''
})

// 菜单点击 -> 路由跳转
function onSelect(path: string) {
  if (path !== route.path) navigateTo(path)
}

// 打开对应的编辑弹窗 (从个人信息弹窗触发)
function openEdit(type: 'nickname' | 'email' | 'password' | 'avatar') {
  showProfile.value = false
  if (type === 'nickname') editNicknameOpen.value = true
  else if (type === 'email') editEmailOpen.value = true
  else if (type === 'password') editPasswordOpen.value = true
  else if (type === 'avatar') editAvatarOpen.value = true
}

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { role: 'admin' } }).catch(() => {})
  window.location.href = '/admin/login'
}

function handleUpdateSuccess(data: Partial<UserInfo>) {
  if (userInfo.value) userInfo.value = { ...userInfo.value, ...data }
}

async function fetchUserInfo() {
  try {
    const res = await $fetch<any>('/api/admin/user?self=1')
    if (res.ok) {
      userInfo.value = { ...res.data, roleKeys: res.data.roles.map((r: Role) => r.key), roleIds: res.data.roles.map((r: Role) => r.id) }
    }
  } catch (err: any) {
    if (err?.status === 401 || err?.statusCode === 401) {
      authError.value = true
    }
  } finally {
    loading.value = false
  }
}

async function fetchMenus() {
  if (!userInfo.value || !userInfo.value.roleIds?.length) return
  const allSets: MenuItem[][] = []
  for (const roleId of userInfo.value.roleIds) {
    try {
      const res = await $fetch<any>(`/api/admin/role/${roleId}/menu-permission`)
      if (res.ok) {
        const flat: MenuItem[] = res.data.permissions
        allSets.push(flat.filter((m: MenuItem) => m.permission?.canAccess !== false && m.group === 'admin'))
      }
    } catch {}
  }
  const map = new Map<number, MenuItem>()
  for (const set of allSets) for (const item of set) if (!map.has(item.id)) map.set(item.id, { ...item })
  menus.value = Array.from(map.values()).sort((a, b) => (b.orderNum ?? 0) - (a.orderNum ?? 0))
}

onMounted(async () => {
  await fetchUserInfo()
  if (userInfo.value) await fetchMenus()
})
</script>

<style scoped>
/* 主内容区背景与原布局保持一致 (gray-50) */
.admin-layout :deep(.u1-layout1__content) {
  background-color: #f9fafb;
}

/* 菜单图标: 用 mask + currentColor, 使图标跟随菜单文字颜色 (默认灰 / 激活白) */
.admin-layout :deep(.u1-layout1__icon) {
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}
.admin-layout :deep(.mi-home) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 11l9-7 9 7'/%3E%3Cpath d='M5 10v10h14V10'/%3E%3Cpath d='M10 20v-6h4v6'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 11l9-7 9 7'/%3E%3Cpath d='M5 10v10h14V10'/%3E%3Cpath d='M10 20v-6h4v6'/%3E%3C/svg%3E");
}
.admin-layout :deep(.mi-file) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 3h8l4 4v14H6V3z'/%3E%3Cpath d='M14 3v5h5'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 3h8l4 4v14H6V3z'/%3E%3Cpath d='M14 3v5h5'/%3E%3C/svg%3E");
}
.admin-layout :deep(.mi-user) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M4 21a8 8 0 0 1 16 0'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M4 21a8 8 0 0 1 16 0'/%3E%3C/svg%3E");
}
.admin-layout :deep(.mi-setting) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V22h-5v-.5a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V2h5v.5a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.2-.1 2 3.4-.1.1A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V22h-5v-.5a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V2h5v.5a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.2-.1 2 3.4-.1.1A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1z'/%3E%3C/svg%3E");
}
.admin-layout :deep(.mi-role) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='8' r='3'/%3E%3Ccircle cx='17' cy='9' r='2.5'/%3E%3Cpath d='M3 20a6 6 0 0 1 12 0'/%3E%3Cpath d='M14 20a5 5 0 0 1 7 0'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='8' r='3'/%3E%3Ccircle cx='17' cy='9' r='2.5'/%3E%3Cpath d='M3 20a6 6 0 0 1 12 0'/%3E%3Cpath d='M14 20a5 5 0 0 1 7 0'/%3E%3C/svg%3E");
}
.admin-layout :deep(.mi-menu) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6h16M4 12h16M4 18h16'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6h16M4 12h16M4 18h16'/%3E%3C/svg%3E");
}
.admin-layout :deep(.mi-permission) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E");
}
.admin-layout :deep(.mi-list) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 6h13'/%3E%3Cpath d='M8 12h13'/%3E%3Cpath d='M8 18h13'/%3E%3Cpath d='M3 6h.01'/%3E%3Cpath d='M3 12h.01'/%3E%3Cpath d='M3 18h.01'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 6h13'/%3E%3Cpath d='M8 12h13'/%3E%3Cpath d='M8 18h13'/%3E%3Cpath d='M3 6h.01'/%3E%3Cpath d='M3 12h.01'/%3E%3Cpath d='M3 18h.01'/%3E%3C/svg%3E");
}
</style>

