<template>
  <component
    :is="tag"
    class="u1-button"
    :class="buttonClasses"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :type="tag === 'button' ? nativeType : undefined"
    :href="tag === 'a' && !isDisabled ? href : undefined"
    :aria-disabled="tag === 'a' && isDisabled ? 'true' : undefined"
    :tabindex="tag === 'a' && isDisabled ? -1 : undefined"
  >
    <span v-if="loading" class="u1-button__loading" aria-hidden="true"></span>
    <span v-if="$slots.icon" class="u1-button__icon">
      <slot name="icon" />
    </span>
    <span class="u1-button__content">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'U1Button'
})

const props = withDefaults(
  defineProps<{
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'large' | 'default' | 'small'
    disabled?: boolean
    loading?: boolean
    plain?: boolean
    round?: boolean
    circle?: boolean
    dashed?: boolean
    text?: boolean
    link?: boolean
    bg?: boolean
    tag?: 'button' | 'a'
    href?: string
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'default',
    size: 'default',
    disabled: false,
    loading: false,
    plain: false,
    round: false,
    circle: false,
    dashed: false,
    text: false,
    link: false,
    bg: false,
    tag: 'button',
    href: undefined,
    nativeType: 'button'
  }
)

const buttonClasses = computed(() => [
  `u1-button--${props.type}`,
  `u1-button--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-loading': props.loading,
    'is-plain': props.plain,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-dashed': props.dashed,
    'is-text': props.text,
    'is-link': props.link,
    'is-has-bg': props.bg
  }
])

const isDisabled = computed(() => props.disabled || props.loading)
</script>
