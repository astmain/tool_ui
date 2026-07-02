<template>
  <span v-if="visible" class="u1-tag" :class="[`u1-tag--${type}`, `u1-tag--${effect}`]">
    <span class="u1-tag__content">
      <slot />
    </span>
    <button v-if="closable" class="u1-tag__close" type="button" aria-label="close" @click="close">x</button>
  </span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({
  name: 'U1Tag'
})

const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    effect?: 'light' | 'dark' | 'plain'
    closable?: boolean
  }>(),
  {
    type: 'primary',
    effect: 'light',
    closable: false
  }
)

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

watch(
  () => props.closable,
  () => {
    visible.value = true
  }
)

function close() {
  visible.value = false
  emit('close')
}
</script>
