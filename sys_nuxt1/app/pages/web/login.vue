<template>
  <div>
    <div v-if="loginSuccess" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div class="bg-white p-12 rounded-3xl shadow-2xl text-center">
        <div class="mb-6"><div class="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce"><span class="text-xl text-white font-bold">OK</span></div></div>
        <h2 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">登录成功！</h2>
        <p class="text-gray-500">正在跳转到首页...</p>
      </div>
    </div>
    <div v-else class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div class="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-100">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4"><span class="text-lg text-white font-bold">[U]</span></div>
          <h1 class="text-2xl font-bold text-gray-800">用户登录</h1>
          <p class="text-gray-500 text-sm mt-1">欢迎回来！</p>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label><input v-model="form.email" type="email" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="请输入邮箱" required /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">密码</label><input v-model="form.password" type="password" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="请输入密码" required /></div>
          <div v-if="msg" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{{ msg }}</div>
          <button type="submit" :disabled="loading" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            <div v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ loading ? '登录中...' : '登录' }} →</span>
          </button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600">还没有账号? <NuxtLink to="/web/register" class="text-indigo-600 hover:underline">立即注册</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const form = ref({ email: 'front@front.com', password: '123456' })
const loading = ref(false)
const msg = ref('')
const loginSuccess = ref(false)
async function handleSubmit() {
  if (loading.value) return
  loading.value = true; msg.value = ''
  try {
    const res = await $fetch<any>('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: form.value })
    if (res.ok) { loginSuccess.value = true; setTimeout(() => { window.location.href = '/web' }, 1500) }
    else msg.value = res.message ?? '登录失败'
  } catch (err: any) { msg.value = err?.data?.message ?? '网络异常' } finally { loading.value = false }
}
</script>
