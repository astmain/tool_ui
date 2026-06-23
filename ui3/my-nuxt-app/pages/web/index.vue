<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">工具平台</div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/web/article" class="text-sm text-gray-600 hover:text-indigo-600 transition">文章</NuxtLink>
          <button class="text-sm text-red-500 hover:text-red-600 transition" @click="handleLogout">退出登录</button>
        </div>
      </div>
    </div>

    <!-- 欢迎内容 -->
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="bg-white rounded-2xl p-8 shadow-sm">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ greeting }}，欢迎回来！</h1>
        <p class="text-gray-500 mb-8">这是一个基于 Nuxt + Drizzle + Tailwind 构建的工具管理平台。</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div class="text-lg font-bold text-blue-600 mb-2">RBAC 权限</div>
            <div class="text-gray-600 text-sm">基于角色的访问控制，灵活管理用户权限</div>
          </div>
          <div class="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div class="text-lg font-bold text-green-600 mb-2">JWT 安全</div>
            <div class="text-gray-600 text-sm">Json Web Token 安全认证，保护用户数据</div>
          </div>
          <div class="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div class="text-lg font-bold text-purple-600 mb-2">Nuxt 框架</div>
            <div class="text-gray-600 text-sm">现代化全栈框架，高效开发体验</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const greeting = ref('')

onMounted(() => {
  const hour = new Date().getHours()
  if (hour < 12) greeting.value = '早上好'
  else if (hour < 18) greeting.value = '下午好'
  else greeting.value = '晚上好'
})

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { role: 'user' } }).catch(() => {})
  window.location.href = '/web/login'
}
</script>
