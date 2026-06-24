<template>
  <span class="u1-avatar" :class="[`u1-avatar--${size}`, `u1-avatar--${shape}`]">
    <img v-if="shouldShowImage" class="u1-avatar__image" :src="src" :alt="alt" @error="imageFailed = true" />
    <span v-else class="u1-avatar__text">
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'U1Avatar'
})

const props = withDefaults(
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

const imageFailed = ref(false)
const shouldShowImage = computed(() => Boolean(props.src) && !imageFailed.value)

watch(
  () => props.src,
  () => {
    imageFailed.value = false
  }
)
</script>
