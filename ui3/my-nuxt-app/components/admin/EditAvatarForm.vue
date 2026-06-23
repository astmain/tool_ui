<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col items-center gap-3">
      <div class="relative">
        <img v-if="preview || userInfo.avatar" :src="preview ?? userInfo.avatar" alt="预览" class="w-32 h-32 rounded-full object-cover" />
        <div v-else class="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
          {{ userInfo.nickname?.slice(0, 1) ?? '?' }}
        </div>
        <label class="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 transition">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <input type="file" accept="image/*" class="sr-only" @change="handleFileChange" />
        </label>
      </div>
      <p class="text-xs text-gray-400">点击右下角图标选择图片</p>
    </div>

    <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>

    <div class="flex justify-end gap-2 pt-2">
      <Com1Button text="取消" variant="secondary" size="medium" @click="$emit('cancel')" />
      <Com1Button
        text="确认修改"
        variant="primary"
        size="medium"
        :loading="uploading"
        :disabled="!selectedFile"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  userInfo: { nickname: string; avatar?: string }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  success: [data: any]
  cancel: []
}>()

const preview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const errorMsg = ref('')

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errorMsg.value = '仅支持 JPG、PNG、GIF、WebP 格式'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMsg.value = '图片大小不能超过 5MB'
    return
  }

  errorMsg.value = ''
  selectedFile.value = file
  preview.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  if (!selectedFile.value) {
    errorMsg.value = '请选择一张图片'
    return
  }

  uploading.value = true
  errorMsg.value = ''

  try {
    // 上传图片
    const fd = new FormData()
    fd.append('file', selectedFile.value)
    const uploadRes = await $fetch<any>('/api/upload/avatar', { method: 'POST', body: fd })
    if (uploadRes.code !== 200 || !uploadRes.data?.url) {
      errorMsg.value = uploadRes.message || '图片上传失败'
      uploading.value = false
      return
    }

    const url = uploadRes.data.url

    // 保存头像
    const profileRes = await $fetch<any>('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { role: 'admin', field: 'avatar', avatar: url },
    })

    if (profileRes.code === 200) {
      emit('success', { avatar: url })
    } else {
      errorMsg.value = profileRes.message || '保存头像失败'
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.message ?? '网络异常，请重试'
  } finally {
    uploading.value = false
  }
}
</script>
