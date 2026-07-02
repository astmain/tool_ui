<template>
  <div v-if="visible" class="u1-confirm">
    <div class="u1-confirm__overlay" @click="handleCancel"></div>
    <div class="u1-confirm__box" role="alertdialog" aria-modal="true" :aria-label="title">
      <div class="u1-confirm__header">
        <span class="u1-confirm__title" :class="`is-${type}`">{{ title }}</span>
      </div>
      <div class="u1-confirm__body">{{ message }}</div>
      <div class="u1-confirm__footer">
        <U1Button size="small" @click="handleCancel">{{ cancelText }}</U1Button>
        <U1Button size="small" :type="confirmButtonType" @click="handleConfirm">{{ confirmText }}</U1Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { U1Button } from '../button'

export type U1ConfirmType = 'default' | 'danger' | 'warning'

defineOptions({
  name: 'U1Confirm'
})

const props = withDefaults(
  defineProps<{
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: U1ConfirmType
  }>(),
  {
    title: '提示',
    confirmText: '确定',
    cancelText: '取消',
    type: 'default'
  }
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = ref(true)

// 确认按钮颜色跟随类型:危险操作用 danger, 警告用 warning, 其余 primary
const confirmButtonType = computed(() => {
  if (props.type === 'danger') return 'danger'
  if (props.type === 'warning') return 'warning'
  return 'primary'
})

function handleConfirm() {
  visible.value = false
  emit('confirm')
}

function handleCancel() {
  visible.value = false
  emit('cancel')
}
</script>

<style scoped>
.u1-confirm {
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.u1-confirm__overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 45%);
}

.u1-confirm__box {
  position: relative;
  width: 400px;
  max-width: calc(100vw - 32px);
  border-radius: var(--u1-radius-base, 8px);
  background: var(--u1-color-bg, #fff);
  color: var(--u1-color-text, #303133);
  box-shadow: 0 18px 46px rgb(0 0 0 / 18%);
  overflow: hidden;
}

.u1-confirm__header {
  padding: 16px 20px 4px;
}

.u1-confirm__title {
  font-size: 16px;
  font-weight: 600;
}

.u1-confirm__title.is-danger {
  color: var(--u1-color-danger, #f56c6c);
}

.u1-confirm__title.is-warning {
  color: var(--u1-color-warning, #e6a23c);
}

.u1-confirm__body {
  padding: 8px 20px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--u1-color-text-regular, #606266);
}

.u1-confirm__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid var(--u1-color-border-light, #ebeef5);
  background: #fafafa;
}

.dark .u1-confirm__footer {
  background: #202121;
}
</style>
