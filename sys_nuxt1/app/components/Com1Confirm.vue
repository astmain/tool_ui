<script setup lang="ts">
interface Props {
  message?: string
  title?: string
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: '确定执行此操作？',
  title: '确认提示',
  confirmText: '确定',
  cancelText: '取消',
  confirmLoading: false,
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function handleConfirm() {
  open.value = false
  emit('confirm')
}

function handleCancel() {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <Com1Dialog
    :open="open"
    :title="title"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :confirm-loading="confirmLoading"
    confirm-variant="danger"
    width="max-w-sm"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleCancel"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="text-sm text-gray-700 pt-2">{{ message }}</p>
    </div>
  </Com1Dialog>
</template>
