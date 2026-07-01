<template>
  <div class="p-6">
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-8 shadow-lg">
      <h1 class="text-3xl font-bold mb-2">{{ greeting }}, 管理员!</h1>
      <p class="text-blue-100 text-lg">欢迎登录中控后台管理系统</p>
    </div>
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-4">系统概览</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-gray-50 rounded-lg"><div class="text-lg font-bold text-blue-600">RBAC</div><div class="text-2xl font-bold text-gray-800 mt-2">RBAC</div><div class="text-sm text-gray-500">权限管理系统</div></div>
        <div class="text-center p-4 bg-gray-50 rounded-lg"><div class="text-lg font-bold text-green-600">JWT</div><div class="text-2xl font-bold text-gray-800 mt-2">JWT</div><div class="text-sm text-gray-500">安全认证</div></div>
        <div class="text-center p-4 bg-gray-50 rounded-lg"><div class="text-lg font-bold text-purple-600">NUXT</div><div class="text-2xl font-bold text-gray-800 mt-2">Nuxt.js</div><div class="text-sm text-gray-500">现代框架</div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
const greeting = ref('')

onMounted(function() {
  var h = new Date().getHours()
  greeting.value = h < 12 ? '早上好' : h < 18 ? '下午好' : '晚上好'
})
</script>