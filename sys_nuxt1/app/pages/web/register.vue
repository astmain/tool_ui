<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded w-96 shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-center">用户注册</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div><label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <div class="flex gap-2"><input v-model="form.email" type="email" class="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入邮箱" required /><button type="button" :disabled="sendLoading || countdown > 0" class="bg-gray-200 px-3 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-300 transition" @click="sendCode">{{ countdown > 0 ? `${countdown}s` : sendLoading ? '发送中...' : '获取验证码' }}</button></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">验证码</label><input v-model="form.code" type="text" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入验证码" maxlength="6" required /></div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">用户名</label><input v-model="form.nickname" type="text" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入用户名" required /></div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">密码</label><input v-model="form.password" type="password" class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入密码" required /></div>
        <div v-if="msg" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{{ msg }}</div>
        <button type="submit" :disabled="loading" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition">{{ loading ? '注册中...' : '注册' }}</button>
      </form>
      <p class="mt-4 text-center text-sm">已有账号? <NuxtLink to="/web/login" class="text-blue-500 hover:underline">立即登录</NuxtLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const form = ref({ email: '', nickname: '', password: '', code: '' })
const loading = ref(false)
const sendLoading = ref(false)
const msg = ref('')
const countdown = ref(0)

async function sendCode() {
  if (!form.value.email.includes('@')) { msg.value = '请输入有效邮箱'; return }
  sendLoading.value = true; msg.value = ''
  try {
    const res = await $fetch<any>('/api/auth/send-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { email: form.value.email } })
    if (res.ok) { countdown.value = 60; setInterval(() => { if (countdown.value > 0) countdown.value-- }, 1000) }
    else msg.value = res.message ?? '发送失败'
  } catch (err: any) { msg.value = err?.data?.message ?? '网络异常' } finally { sendLoading.value = false }
}

async function handleSubmit() {
  loading.value = true; msg.value = ''
  try {
    const res = await $fetch<any>('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: form.value })
    if (res.ok) window.location.href = '/web'
    else msg.value = res.message ?? '注册失败'
  } catch (err: any) { msg.value = err?.data?.message ?? '网络异常' } finally { loading.value = false }
}
</script>
