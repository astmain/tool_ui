<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- 左侧菜单栏 -->
    <aside
      :class="[
        'bg-gray-800 text-white flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-56',
      ]"
      style="height: 100vh; position: sticky; top: 0"
    >
      <!-- 用户信息 -->
      <div class="flex items-center gap-2 px-4 py-3">
        <button
          class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium hover:bg-blue-500 transition cursor-pointer"
          @click="showProfile = true"
        >
          {{ userInfo?.nickname?.slice(0, 1) ?? '?' }}
        </button>
        <span v-if="!collapsed" class="font-bold">{{ userInfo?.nickname ?? '加载中...' }}</span>
      </div>

      <!-- 菜单列表 -->
      <nav class="flex-1 overflow-y-auto py-2">
        <div v-if="loading" class="px-4 py-3 text-gray-500 text-sm">
          {{ collapsed ? '...' : '加载中...' }}
        </div>
        <template v-else>
          <MenuLink
            href="/admin"
            :label="collapsed ? '首' : '首页'"
            :icon="IconHome()"
            :active="route.path === '/admin'"
            :collapsed="collapsed"
          />
          <MenuLink
            v-for="menu in menus"
            :key="menu.id"
            :href="menu.path ?? '#'"
            :label="collapsed ? menu.name.slice(0, 1) : menu.name"
            :active="isActive(menu.path)"
            :collapsed="collapsed"
          />
        </template>
      </nav>

      <!-- 底部折叠按钮 -->
      <div class="border-t border-gray-700 px-2 py-2">
        <button
          class="flex items-center gap-2 text-gray-400 hover:text-white transition flex-shrink-0"
          :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
          @click="collapsed = !collapsed"
        >
          <IconMenuFold />
          <span v-if="!collapsed" class="truncate">v1.0</span>
        </button>
      </div>
    </aside>

    <!-- 主内容 -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <!-- 个人信息弹框 -->
    <Com1Dialog :open="showProfile" title="个人信息" width="max-w-sm" :top="100" @close="showProfile = false">
      <ProfileContent
        v-if="userInfo"
        :user-info="userInfo"
        @edit-nickname="openEdit('nickname')"
        @edit-email="openEdit('email')"
        @edit-password="openEdit('password')"
        @edit-avatar="openEdit('avatar')"
        @logout="handleLogout"
      />
    </Com1Dialog>

    <!-- 修改昵称弹框 -->
    <Com1Dialog :open="editNicknameOpen" title="修改昵称" width="max-w-sm" :top="100" @close="editNicknameOpen = false">
      <EditNicknameForm
        v-if="userInfo"
        :user-info="userInfo"
        @success="handleUpdateSuccess"
        @cancel="editNicknameOpen = false"
      />
    </Com1Dialog>

    <!-- 修改邮箱弹框 -->
    <Com1Dialog :open="editEmailOpen" title="修改邮箱" width="max-w-sm" :top="100" @close="editEmailOpen = false">
      <EditEmailForm
        v-if="userInfo"
        :user-info="userInfo"
        @success="handleUpdateSuccess"
        @cancel="editEmailOpen = false"
      />
    </Com1Dialog>

    <!-- 修改密码弹框 -->
    <Com1Dialog :open="editPasswordOpen" title="修改密码" width="max-w-sm" :top="100" @close="editPasswordOpen = false">
      <EditPasswordForm
        v-if="userInfo"
        :user-info="userInfo"
        @cancel="editPasswordOpen = false"
        @logout="handleLogout"
      />
    </Com1Dialog>

    <!-- 修改头像弹框 -->
    <Com1Dialog :open="editAvatarOpen" title="修改头像" width="max-w-sm" :top="100" @close="editAvatarOpen = false">
      <EditAvatarForm
        v-if="userInfo"
        :user-info="userInfo"
        @success="handleUpdateSuccess"
        @cancel="editAvatarOpen = false"
      />
    </Com1Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateTime } from '~/utils/formatDateTime'

interface Role {
  id: number
  name: string
  key: string
}

interface MenuItem {
  id: number
  name: string
  path: string | null
  icon: string | null
  orderNum: number
  group: string
  permission?: { canAccess: boolean }
}

interface UserInfo {
  id: number
  nickname: string
  email: string
  avatar?: string
  roles: Role[]
  roleKeys: string[]
  roleIds: number[]
  createdAt: string | Date
}

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const showProfile = ref(false)
const editNicknameOpen = ref(false)
const editEmailOpen = ref(false)
const editPasswordOpen = ref(false)
const editAvatarOpen = ref(false)
const userInfo = ref<UserInfo | null>(null)
const menus = ref<MenuItem[]>([])
const loading = ref(true)

function IconHome() {
  return { render: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 2, d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })]) }
}

function IconMenuFold() {
  return { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 2, d: collapsed.value ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7' })]) }
}

function isActive(path: string | null) {
  if (!path) return false
  return route.path === path || route.path.startsWith(path + '/')
}

function openEdit(type: 'nickname' | 'email' | 'password' | 'avatar') {
  showProfile.value = false
  if (type === 'nickname') editNicknameOpen.value = true
  if (type === 'email') editEmailOpen.value = true
  if (type === 'password') editPasswordOpen.value = true
  if (type === 'avatar') editAvatarOpen.value = true
}

async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { role: 'admin' },
    })
  } catch {}
  window.location.href = '/admin/login'
}

function handleUpdateSuccess(data: Partial<UserInfo>) {
  if (userInfo.value) {
    userInfo.value = { ...userInfo.value, ...data }
  }
}

async function fetchUserInfo() {
  try {
    const res = await $fetch<any>('/api/admin/user?self=1')
    if (res.code === 200) {
      const roles = res.data.roles as Role[]
      userInfo.value = {
        ...res.data,
        roleKeys: roles.map((r: Role) => r.key),
        roleIds: roles.map((r: Role) => r.id),
      }
    }
  } catch {}
  loading.value = false
}

async function fetchMenus() {
  if (!userInfo.value || userInfo.value.roleIds.length === 0) return
  const allMenuSets: MenuItem[][] = []

  for (const roleId of userInfo.value.roleIds) {
    try {
      const res = await $fetch<any>(`/api/admin/role/${roleId}/menu-permission`)
      if (res.code === 200) {
        const flat: MenuItem[] = res.data.permissions
        const filtered = flat.filter((m: MenuItem) => m.permission?.canAccess !== false && m.group === 'admin')
        allMenuSets.push(filtered)
      }
    } catch {}
  }

  // 合并去重
  const map = new Map<number, MenuItem>()
  for (const set of allMenuSets) {
    for (const item of set) {
      if (!map.has(item.id)) map.set(item.id, { ...item })
    }
  }
  menus.value = Array.from(map.values()).sort((a, b) => b.orderNum - a.orderNum)
}

onMounted(async () => {
  await fetchUserInfo()
  await fetchMenus()
})
</script>
