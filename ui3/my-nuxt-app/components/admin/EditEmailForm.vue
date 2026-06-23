<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <label class="w-20 text-right pt-2 text-sm font-medium text-gray-700 shrink-0">当前邮箱</label>
      <div class="flex-1 text-sm text-gray-500 py-2">{{ userInfo.email }}</div>
    </div>

    <Com1Input
      :value="newEmail"
      :config="{ text: '新邮箱', width: 'w-20' }"
      placeholder="请输入新邮箱"
      @change="(v) => (newEmail = v)"
    />

    <div class="flex items-start gap-3">
      <label class="w-20 text-right pt-2 text-sm font-medium text-gray-700 shrink-0">验证码<span class="text-red-500 ml-0.5">*</span></label>
      <div class="flex-1">
        <div class="flex gap-2">
          <Com1Input
            :value="code"
            placeholder="请输入验证码"
            :max-length="6"
            input-class="flex-1"
            @change="(v) => (code = v)"
          />
          <Com1Button
            :text="countdown > 0 ? `${countdown}s后重发` : sending ? '发送中...' : '发送验证码'"
            :disabled="countdown > 0 || sending"
            :loading="sending"
            size="medium"
            style="width: 120px"
            @click="sendCode"
          />
        </div>
        <p v-if="errorMsg" class="text-red-500 text-xs mt-1">{{ errorMsg }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Com1Button text="取消" variant="secondary" size="medium" @click="$emit('cancel')" />
      <Com1Button text="确认修改" variant="primary" size="medium" :loading="submitting" @click="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  userInfo: { email: string }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  success: [data: any]
  cancel: []
}>()

const newEmail = ref('')
const code = ref('')
const submitting = ref(false)
const sending = ref(false)
const countdown = ref(0)
const errorMsg = ref('')

async function sendCode() {
  if (countdown.value > 0 || sending.value) return
  sending.value = true
  try {
    const res = await $fetch<any>('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: props.userInfo.email, purpose: 'admin' },
    })
    if (res.code === 200) countdown.value = 60
    else errorMsg.value = res.message ?? '发送失败'
  } catch {
    errorMsg.value = '网络异常'
  } finally {
    sending.value = false
  }
}

setInterval(() => {
  if (countdown.value > 0) countdown.value--
}, 1000)

async function handleSubmit() {
  errorMsg.value = ''
  if (!newEmail.value.trim() || !newEmail.value.includes('@')) { errorMsg.value = '请输入有效的新邮箱'; return }
  if (!code.value.trim()) { errorMsg.value = '请输入验证码'; return }

  submitting.value = true
  try {
    const res = await $fetch<any>('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { role: 'admin', field: 'email', newEmail: newEmail.value.trim(), email: props.userInfo.email, code: code.value.trim() },
    })
    if (res.code === 200) {
      emit('success', { email: res.data.email })
    } else {
      errorMsg.value = res.message ?? '修改失败'
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.message ?? '网络异常'
  } finally {
    submitting.value = false
  }
}
</script>
