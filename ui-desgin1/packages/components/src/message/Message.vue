<template>
  <div class="u1-message" :class="`u1-message--${type}`" role="alert">
    <span class="u1-message__content">{{ message }}</span>
    <button v-if="showClose" class="u1-message__close" type="button" aria-label="close" @click="emit('close')">x</button>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'U1Message'
})

withDefaults(
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
</script>
