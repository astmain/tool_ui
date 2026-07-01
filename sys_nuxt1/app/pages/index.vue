<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-5xl font-bold text-gray-800 mb-4">工具平台</h1>
      <p class="text-gray-500 mb-8">基于 Nuxt + Drizzle + Tailwind 构建的全栈管理平台</p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="/web" class="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow hover:shadow-md transition font-medium">
          前台入口
        </NuxtLink>
        <NuxtLink to="/admin" class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium">
          后台入口
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
