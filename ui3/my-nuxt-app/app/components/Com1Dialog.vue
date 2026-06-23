<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  width?: string
  top?: number
  confirmText?: string
  cancelText?: string
}>(), {
  title: '',
  width: 'max-w-md',
  top: 80,
  confirmText: '确定',
  cancelText: '取消',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

const visible = ref(props.open)

watch(() => props.open, (val) => {
  visible.value = val
  document.body.style.overflow = val ? 'hidden' : ''
})

function close() {
  visible.value = false
  document.body.style.overflow = ''
  emit('close')
}

function handleBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) close()
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
}

onMounted(() => document.addEventListener('keydown', handleEsc))
onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="dialog-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/40"
      :style="{ paddingTop: `${top}px` }"
      @click="handleBackdropClick"
    >
      <div :class="`bg-white rounded-lg shadow-2xl w-full ${width} max-h-[calc(100vh-160px)] flex flex-col`">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
          <button
            class="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            @click="close"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <slot />
        </div>
        <div class="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            @click="emit('cancel'); close()"
          >
            {{ cancelText }}
          </button>
          <button
            class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            @click="emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
