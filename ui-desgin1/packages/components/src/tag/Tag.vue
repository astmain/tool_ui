<template>
  <span class="u1-tag-component" :class="[`u1-tag-component--${type}`, `u1-tag-component--${effect}`]">
    <span class="u1-tag-component__content">
      <slot />
    </span>
    <button v-if="closable" class="u1-tag-component__close" type="button" aria-label="close" @click="emit('close')">x</button>
  </span>
</template>

<script setup lang="ts">
defineOptions({
  name: 'U1Tag'
})

withDefaults(
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
</script>
