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
    <span v-else-if="leftIconClass" class="u1-button__icon is-left" aria-hidden="true">
      <span class="u1-icon-mark" :class="leftIconClass"></span>
    </span>
    <span class="u1-button__content">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="rightIconClass" class="u1-button__icon is-right" aria-hidden="true">
      <span class="u1-icon-mark" :class="rightIconClass"></span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'U1Button',
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'large' | 'default' | 'small'
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

const iconNames = [
  'add',
  'edit',
  'delete',
  'save',
  'search',
  'refresh',
  'upload',
  'download',
  'copy',
  'export',
  'home',
  'menu',
  'setting',
  'user',
  'role',
  'permission',
  'dashboard',
  'back',
  'left',
  'right',
  'table',
  'list',
  'chart',
  'database',
  'file',
  'folder',
  'filter',
  'sort',
  'calendar',
  'time',
  'check',
  'close',
  'info',
  'warning',
  'error',
  'success',
  'loading',
  'lock',
  'unlock',
  'eye-open',
  'view',
  'hide'
] as const

function resolveIconClass(name: string) {
  if (!name) {
    return ''
  }

  const iconName = name === 'view' ? 'eye-open' : name
  const resolvedName = iconNames.includes(iconName as (typeof iconNames)[number]) ? iconName : 'close'
  return `is-${resolvedName}`
}

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

const leftIconClass = computed(() => resolveIconClass(props.iconLeft || props.icon))
const rightIconClass = computed(() => resolveIconClass(props.iconRight))

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
