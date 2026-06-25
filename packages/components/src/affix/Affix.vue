<template>
  <div class="u1-affix" :class="{ 'is-disabled': disabled }" :style="affixStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    offset?: number | string
    position?: 'top' | 'bottom'
    zIndex?: number
    disabled?: boolean
  }>(),
  {
    offset: 0,
    position: 'top',
    zIndex: 100,
    disabled: false
  }
)

defineOptions({
  name: 'U1Affix'
})

const normalizedOffset = computed(() => {
  return typeof props.offset === 'number' ? `${props.offset}px` : props.offset
})

const affixStyle = computed<CSSProperties>(() => {
  if (props.disabled) {
    return {}
  }

  let style: CSSProperties = {
    position: 'sticky',
    zIndex: props.zIndex
  }

  style[props.position] = normalizedOffset.value

  return style
})
</script>
