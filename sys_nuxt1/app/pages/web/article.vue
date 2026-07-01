<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <div class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">工具平台</div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/web" class="text-sm text-gray-600 hover:text-indigo-600 transition">首页</NuxtLink>
          <button class="text-sm text-red-500 hover:text-red-600 transition" @click="handleLogout">退出登录</button>
        </div>
      </div>
    </div>
    <div class="max-w-6xl mx-auto px-6 py-12">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">文章列表</h1>
      <div class="flex flex-wrap gap-2 mb-6">
        <button v-for="cat in categories" :key="cat.id" :class="['px-4 py-1.5 rounded-full text-sm transition', selectedCat === cat.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200']" @click="selectedCat = selectedCat === cat.id ? null : cat.id">{{ cat.name }}</button>
      </div>
      <div v-if="loading" class="text-center text-gray-400 py-12">加载中...</div>
      <div v-else-if="!filtered.length" class="text-center text-gray-400 py-12">暂无文章</div>
      <div v-else class="space-y-4">
        <div v-for="article in filtered" :key="article.id" class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer" @click="selected = article">
          <div class="flex items-center gap-3 mb-2"><span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{{ article.category?.name }}</span><span class="text-xs text-gray-400">{{ new Date(article.createdAt).toLocaleString('zh-CN') }}</span></div>
          <h2 class="text-lg font-semibold text-gray-800">{{ article.title }}</h2>
          <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ article.content }}</p>
        </div>
      </div>
      <div v-if="selected" class="fixed inset-0 z-50 flex items-start justify-center bg-black/40" style="padding-top: 80px" @click.self="selected = null">
        <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[calc(100vh-160px)] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
            <h2 class="text-lg font-semibold text-gray-800">{{ selected.title }}</h2>
            <button class="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition" @click="selected = null">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="px-6 py-4"><p class="text-sm text-gray-500 mb-4">{{ new Date(selected.createdAt).toLocaleString('zh-CN') }}</p><div class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selected.content }}</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
interface Article { id: number; title: string; content: string; createdAt: string; category: { id: number; name: string } | null }
interface Category { id: number; name: string }
const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const selectedCat = ref<number | null>(null)
const selected = ref<Article | null>(null)
const loading = ref(true)
const filtered = computed(() => selectedCat.value ? articles.value.filter((a) => a.categoryId === selectedCat.value) : articles.value)
async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: {} }).catch(() => {})
  window.location.href = '/web/login'
}
onMounted(async () => {
  const res = await $fetch<any>('/api/web/article')
  if (res.ok) { articles.value = res.data.articles; categories.value = res.data.categories }
  loading.value = false
})
</script>
