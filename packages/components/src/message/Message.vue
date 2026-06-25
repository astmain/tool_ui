<template>
  <div
    v-if="visible"
    class="u1-message"
    :class="[`u1-message--${type}`, `u1-message--${placement}`]"
    :style="messageStyle"
    role="alert"
  >
    <span class="u1-message__icon" aria-hidden="true">{{ typeIcon }}</span>
    <span v-if="dangerouslyUseHTMLString" class="u1-message__content" v-html="message"></span>
    <span v-else class="u1-message__content">{{ message }}</span>
    <span v-if="repeatNum > 1" class="u1-message__repeat">x {{ repeatNum }}</span>
    <button v-if="showClose" class="u1-message__close" type="button" aria-label="close" @click="close">x</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'U1Message'
})

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'warning' | 'info' | 'error'
    message: string
    showClose?: boolean
    repeatNum?: number
    dangerouslyUseHTMLString?: boolean
    offset?: number
    placement?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'
    zIndex?: number
  }>(),
  {
    type: 'info',
    showClose: false,
    repeatNum: 1,
    dangerouslyUseHTMLString: false,
    offset: undefined,
    placement: 'top',
    zIndex: undefined
  }
)

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

watch(
  () => props.message,
  () => {
    visible.value = true
  }
)

const typeIcon = computed(() => {
  const icons = {
    success: '✓',
    warning: '!',
    info: 'i',
    error: 'x'
  }

  return icons[props.type]
})

const messageStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (props.offset !== undefined) {
    if (props.placement.startsWith('bottom')) {
      style.bottom = `${props.offset}px`
    } else {
      style.top = `${props.offset}px`
    }
  }

  if (props.zIndex !== undefined) {
    style.zIndex = props.zIndex
  }

  return style
})

function close() {
  visible.value = false
  emit('close')
}
</script>
