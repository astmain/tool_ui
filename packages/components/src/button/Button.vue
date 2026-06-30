<template>
  <button
    v-bind="buttonAttrs"
    class="u1-button"
    :class="buttonClasses"
    :disabled="isDisabled"
    :type="nativeType"
    @click="handleClick"
  >
    <span v-if="loading" class="u1-button__loading" aria-hidden="true"></span>
    <span v-if="$slots.icon" class="u1-button__icon is-left">
      <slot name="icon" />
    </span>
    <span v-else-if="leftIconName" class="u1-button__icon is-left" aria-hidden="true">
      <U1Icon :name="leftIconName" />
    </span>
    <span class="u1-button__content">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="rightIconName" class="u1-button__icon is-right" aria-hidden="true">
      <U1Icon :name="rightIconName" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { U1Icon } from '../icon'

defineOptions({
  name: 'U1Button',
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'large' | 'default' | 'small' | 'mini'
    disabled?: boolean
    loading?: boolean
    label?: string
    icon?: string
    iconLeft?: string
    iconRight?: string
    plain?: boolean
    round?: boolean
    circle?: boolean
    text?: boolean
    link?: boolean
    bg?: boolean
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'default',
    size: 'default',
    disabled: false,
    loading: false,
    label: '',
    icon: '',
    iconLeft: '',
    iconRight: '',
    plain: false,
    round: false,
    circle: false,
    text: false,
    link: false,
    bg: false,
    nativeType: 'button'
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()

const buttonClasses = computed(() => [
  `u1-button--${props.type}`,
  `u1-button--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-loading': props.loading,
    'is-plain': props.plain,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-text': props.text,
    'is-link': props.link,
    'is-has-bg': props.bg
  }
])

const iconNameFromClass = computed(() => {
  const classValue = attrs.class
  const classNames = Array.isArray(classValue) ? classValue.join(' ') : String(classValue ?? '')
  const iconClass = classNames.split(/\s+/).find((className) => className.startsWith('icon-'))
  return iconClass?.replace(/^icon-/, '') ?? ''
})

const leftIconName = computed(() => props.iconLeft || props.icon || iconNameFromClass.value)
const rightIconName = computed(() => props.iconRight)

const buttonAttrs = computed(() => {
  const entries = Object.entries(attrs).filter(([key]) => key !== 'tag' && key !== 'href' && key !== 'dashed')
  return Object.fromEntries(entries)
})

const isDisabled = computed(() => props.disabled || props.loading)

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>
