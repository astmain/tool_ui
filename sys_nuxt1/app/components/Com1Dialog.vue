<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'
type ButtonSize = 'mini' | 'small' | 'medium' | 'large'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  width?: string
  top?: number
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
  confirmDisabled?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  confirmVariant?: ButtonVariant
  confirmSize?: ButtonSize
}>(), {
  title: '',
  width: 'max-w-md',
  top: 80,
  confirmText: '确定',
  cancelText: '取消',
  confirmLoading: false,
  confirmDisabled: false,
  confirmVariant: 'primary',
  confirmSize: 'small',
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

function handleConfirm() {
  if (props.onConfirm) {
    props.onConfirm()
  } else {
    emit('confirm')
  }
}

function handleCancel() {
  if (props.onCancel) {
    props.onCancel()
  } else {
    emit('cancel')
  }
  close()
}

onMounted(() => document.addEventListener('keydown', handleEsc))
onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100',
  success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
}

const sizeClass: Record<ButtonSize, string> = {
  mini: 'px-2.5 py-1 text-xs',
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-sm',
  large: 'px-5 py-2 text-base',
}
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
            aria-label="关闭"
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
        <div v-if="$slots.footer" class="px-5 py-3 border-t border-gray-100">
          <slot name="footer" />
        </div>
        <div v-else class="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            :class="[
              'rounded-lg font-medium transition',
              variantClass[confirmVariant ?? 'primary'],
              sizeClass[confirmSize ?? 'small'],
              (confirmLoading || confirmDisabled) ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            :disabled="confirmLoading || confirmDisabled"
            @click="!confirmLoading && !confirmDisabled && handleConfirm()"
          >
            <span v-if="confirmLoading" class="inline-flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              处理中...
            </span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
