<script setup lang="ts">
interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  visible: boolean
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

function addToast(message: string, type: ToastItem['type']) {
  const id = ++nextId
  const toast: ToastItem = { id, message, type, visible: false }
  toasts.value.push(toast)

  nextTick(() => {
    toast.visible = true
  })

  setTimeout(() => {
    removeToast(id)
  }, 2500)
}

function removeToast(id: number) {
  const toast = toasts.value.find(t => t.id === id)
  if (toast) {
    toast.visible = false
    setTimeout(() => {
      const idx = toasts.value.findIndex(t => t.id === id)
      if (idx !== -1) toasts.value.splice(idx, 1)
    }, 300)
  }
}

const typeConfig: Record<string, { border: string; icon: string }> = {
  success: {
    border: 'border-l-4 border-l-green-500',
    icon: 'M5 13l4 4L19 7',
  },
  error: {
    border: 'border-l-4 border-l-red-500',
    icon: 'M6 18L18 6M6 6l12 12',
  },
  warning: {
    border: 'border-l-4 border-l-yellow-500',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  info: {
    border: 'border-l-4 border-l-blue-500',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
}

defineExpose({
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  warning: (message: string) => addToast(message, 'warning'),
  info: (message: string) => addToast(message, 'info'),
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg min-w-[240px] max-w-sm transition-all duration-300',
            typeConfig[toast.type].border,
            toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
          ]"
        >
          <svg
            class="w-5 h-5 flex-shrink-0"
            :class="{
              'text-green-500': toast.type === 'success',
              'text-red-500': toast.type === 'error',
              'text-yellow-500': toast.type === 'warning',
              'text-blue-500': toast.type === 'info',
            }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="typeConfig[toast.type].icon"
            />
          </svg>
          <span class="text-sm text-gray-700 flex-1">{{ toast.message }}</span>
          <button
            class="text-gray-400 hover:text-gray-600 transition"
            @click="removeToast(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
