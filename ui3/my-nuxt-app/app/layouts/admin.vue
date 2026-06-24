<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <aside :class="['bg-gray-800 text-white flex flex-col transition-all duration-200', collapsed ? 'w-16' : 'w-56']" style="height: 100vh; position: sticky; top: 0">
      <div class="flex items-center gap-2 px-4 py-3">
        <button class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium hover:bg-blue-500 transition cursor-pointer" @click="showProfile = true">{{ userInfo?.nickname?.slice(0, 1) ?? '?' }}</button>
        <span v-if="!collapsed" class="font-bold">{{ userInfo?.nickname ?? '加载中...' }}</span>
      </div>
      <nav class="flex-1 overflow-y-auto py-2">
        <template v-if="authError">
          <div class="px-4 py-3 text-red-400 text-sm">未登录或登录已过期</div>
        </template>
        <div v-else-if="loading" class="px-4 py-3 text-gray-500 text-sm">{{ collapsed ? '...' : '加载中...' }}</div>
        <template v-else>
          <NuxtLink to="/admin" class="flex items-center gap-3 mx-2 my-0.5 px-3 py-2 rounded text-sm transition" :class="route.path === '/admin' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'" :title="collapsed ? '首页' : ''">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span v-if="!collapsed" class="truncate">首页</span>
          </NuxtLink>
          <NuxtLink v-for="menu in menus" :key="menu.id" :to="menu.path ?? '#'" class="flex items-center gap-3 mx-2 my-0.5 px-3 py-2 rounded text-sm transition" :class="isActive(menu.path) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'" :title="collapsed ? menu.name : ''">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span v-if="!collapsed" class="truncate">{{ menu.name }}</span>
          </NuxtLink>
        </template>
      </nav>
      <div class="border-t border-gray-700 px-2 py-2">
        <button class="flex items-center gap-2 text-gray-400 hover:text-white transition flex-shrink-0" :title="collapsed ? '展开侧边栏' : '收起侧边栏'" @click="collapsed = !collapsed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'" /></svg>
          <span v-if="!collapsed" class="truncate">v1.0</span>
        </button>
      </div>
    </aside>
    <main class="flex-1 overflow-y-auto"><slot /></main>

    <Com1Dialog :open="showProfile" title="个人信息" width="max-w-sm" :top="100" @close="showProfile = false">
      <ProfileContent v-if="userInfo" :user-info="userInfo" @edit-nickname="openEdit('nickname')" @edit-email="openEdit('email')" @edit-password="openEdit('password')" @edit-avatar="openEdit('avatar')" @logout="handleLogout" />
    </Com1Dialog>
    <Com1Dialog :open="editNicknameOpen" title="修改昵称" width="max-w-sm" :top="100" @close="editNicknameOpen = false">
      <EditNicknameForm v-if="userInfo" :user-info="userInfo" @success="handleUpdateSuccess" @cancel="editNicknameOpen = false" />
    </Com1Dialog>
    <Com1Dialog :open="editEmailOpen" title="修改邮箱" width="max-w-sm" :top="100" @close="editEmailOpen = false">
      <EditEmailForm v-if="userInfo" :user-info="userInfo" @success="handleUpdateSuccess" @cancel="editEmailOpen = false" />
    </Com1Dialog>
    <Com1Dialog :open="editPasswordOpen" title="修改密码" width="max-w-sm" :top="100" @close="editPasswordOpen = false">
      <EditPasswordForm v-if="userInfo" :user-info="userInfo" @cancel="editPasswordOpen = false" @logout="handleLogout" />
    </Com1Dialog>
    <Com1Dialog :open="editAvatarOpen" title="修改头像" width="max-w-sm" :top="100" @close="editAvatarOpen = false">
      <EditAvatarForm v-if="userInfo" :user-info="userInfo" @success="handleUpdateSuccess" @cancel="editAvatarOpen = false" />
    </Com1Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Role { id: number; name: string; key: string }
interface MenuItem { id: number; name: string; path: string | null; permission?: { canAccess: boolean } }
interface UserInfo { id: number; nickname: string; email: string; avatar?: string; roles: Role[]; createdAt: string | Date }

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

function isActive(path: string | null) {
  if (!path) return false
  return route.path === path || route.path.startsWith(path + '/')
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
    if (res.code === 200) {
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
      if (res.code === 200) {
        const flat: MenuItem[] = res.data.permissions
        allSets.push(flat.filter((m: MenuItem) => m.permission?.canAccess !== false && m.group === 'admin'))
      }
    } catch {}
  }
  const map = new Map<number, MenuItem>()
  for (const set of allSets) for (const item of set) if (!map.has(item.id)) map.set(item.id, { ...item })
  menus.value = Array.from(map.values()).sort((a, b) => b.orderNum - a.orderNum)
}

onMounted(async () => {
  await fetchUserInfo()
  if (userInfo.value) await fetchMenus()
})
</script>
