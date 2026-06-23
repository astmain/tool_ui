<template>
  <span class="u1-avatar" :class="[`u1-avatar--${size}`, `u1-avatar--${shape}`]">
    <img v-if="src" class="u1-avatar__image" :src="src" :alt="alt" />
    <span v-else class="u1-avatar__text">
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
defineOptions({
  name: 'U1Avatar'
})

withDefaults(
  defineProps<{
    src?: string
    alt?: string
    size?: 'small' | 'default' | 'large'
    shape?: 'circle' | 'square'
  }>(),
  {
    src: '',
    alt: '',
    size: 'default',
    shape: 'circle'
  }
)
</script>
