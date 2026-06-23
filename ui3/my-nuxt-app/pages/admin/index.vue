<template>
  <div class="p-6">
    <!-- 欢迎区域 -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-8 shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ greeting }}，{{ userInfo?.nickname || '管理员' }}！</h1>
          <p class="text-blue-100 text-lg">欢迎登录中控后台管理系统</p>
          <div class="flex items-center gap-4 mt-4 text-sm">
            <span class="bg-white/20 px-3 py-1 rounded-full">{{ userInfo?.email }}</span>
            <span class="bg-white/20 px-3 py-1 rounded-full">
              {{ userInfo?.roles?.map((r) => r.name).join(', ') || '加载中...' }}
            </span>
          </div>
        </div>
        <div class="text-6xl opacity-20">
          {{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }) }}
        </div>
      </div>
    </div>

    <!-- 系统信息 -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-4">系统概览</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-blue-600">RBAC</div>
          <div class="text-2xl font-bold text-gray-800 mt-2">RBAC</div>
          <div class="text-sm text-gray-500">权限控制系统</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-green-600">JWT</div>
          <div class="text-2xl font-bold text-gray-800 mt-2">JWT</div>
          <div class="text-sm text-gray-500">安全认证</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-purple-600">NUXT</div>
          <div class="text-2xl font-bold text-gray-800 mt-2">Nuxt.js</div>
          <div class="text-sm text-gray-500">现代框架</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const userInfo = ref<any>(null)
const greeting = ref('')

onMounted(() => {
  const hour = new Date().getHours()
  if (hour < 12) greeting.value = '早上好'
  else if (hour < 18) greeting.value = '下午好'
  else greeting.value = '晚上好'

  $fetch<any>('/api/admin/user?self=1')
    .then((res) => { if (res.code === 200) userInfo.value = res.data })
    .catch(() => {})
})
</script>
