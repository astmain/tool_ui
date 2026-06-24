<template>
  <div v-if="visible" class="u1-message" :class="`u1-message--${type}`" role="alert">
    <span class="u1-message__content">{{ message }}</span>
    <button v-if="showClose" class="u1-message__close" type="button" aria-label="close" @click="close">x</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({
  name: 'U1Message'
})

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'warning' | 'info' | 'error'
    message: string
    showClose?: boolean
  }>(),
  {
    type: 'info',
    showClose: false
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

function close() {
  visible.value = false
  emit('close')
}
</script>
