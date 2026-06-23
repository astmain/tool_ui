<template>
  <div class="flex flex-col gap-6">
    <!-- 头像 + 基本信息 -->
    <div class="flex items-start gap-4">
      <div class="relative group shrink-0" style="cursor: pointer" @click="$emit('edit-avatar')">
        <img
          v-if="userInfo.avatar"
          :src="userInfo.avatar"
          alt="头像"
          class="w-20 h-20 rounded-full object-cover ring-2 ring-gray-100"
        />
        <div
          v-else
          class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-medium ring-2 ring-blue-100"
        >
          {{ userInfo.nickname?.slice(0, 1) ?? '?' }}
        </div>
        <div class="absolute inset-0 rounded-full bg-gray-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <div class="flex flex-col gap-2 min-w-0 flex-1">
        <div class="flex justify-between items-center text-sm min-w-0">
          <span class="text-gray-400 shrink-0">昵称</span>
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-gray-700 truncate">{{ userInfo.nickname }}</span>
            <button class="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-blue-500 rounded transition" title="修改昵称" @click="$emit('edit-nickname')">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center text-sm min-w-0">
          <span class="text-gray-400 shrink-0">邮箱</span>
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-gray-600 truncate">{{ userInfo.email }}</span>
            <button class="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-blue-500 rounded transition" title="修改邮箱" @click="$emit('edit-email')">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center text-sm min-w-0">
          <span class="text-gray-400 shrink-0">密码</span>
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-gray-700">••••••••</span>
            <button class="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-blue-500 rounded transition" title="修改密码" @click="$emit('edit-password')">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center text-sm min-w-0">
          <span class="text-gray-400 shrink-0">角色</span>
          <span class="text-gray-600 truncate">{{ userInfo.roles.map((r) => r.name).join(', ') }}</span>
        </div>
        <div class="flex justify-between items-center text-sm min-w-0">
          <span class="text-gray-400 shrink-0">注册时间</span>
          <span class="text-gray-500">{{ formatDateTime(userInfo.createdAt) }}</span>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-100" />

    <button class="w-full py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition" @click="$emit('logout')">
      退出登录
    </button>
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '~/utils/formatDateTime'

interface Props {
  userInfo: {
    nickname: string
    email: string
    avatar?: string
    roles: Array<{ name: string }>
    createdAt: string | Date
  }
}

defineProps<Props>()
defineEmits(['edit-nickname', 'edit-email', 'edit-password', 'edit-avatar', 'logout'])
</script>
