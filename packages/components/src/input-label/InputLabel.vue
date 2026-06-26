<template>
  <span class="u1-input-label" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }">
    <span class="u1-input-label__label" :style="labelStyle">{{ label }}</span>
    <span class="u1-input-label__control" :style="controlStyle">
      <input
        class="u1-input-label__inner"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :inputmode="type === 'number' ? 'numeric' : undefined"
        type="text"
        @input="handleInput"
        @change="handleChange"
      />
      <button
        v-if="show"
        class="u1-input-label__toggle"
        type="button"
        :disabled="disabled"
        :aria-pressed="visible ? 'true' : 'false'"
        :aria-label="visible ? 'hide value' : 'show value'"
        @click="toggleVisible"
      >
        <U1Icon :name="visible ? 'eye-close' : 'eye-open'" />
      </button>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { U1Icon } from '../icon'

defineOptions({
  name: 'U1InputLabel'
})

type InputLabelValue = string | number
type InputLabelType = 'text' | 'number'
type LabelPosition = 'left' | 'right'

const props = withDefaults(
  defineProps<{
    modelValue?: InputLabelValue
    label?: string
    labelWidth?: string | number
    labelPosition?: LabelPosition
    inputWidth?: string | number
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    type?: InputLabelType
    show?: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    labelWidth: '80px',
    labelPosition: 'right',
    inputWidth: '220px',
    placeholder: '',
    disabled: false,
    readonly: false,
    type: 'text',
    show: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const visible = ref(false)

const rawValue = computed(() => normalizeValue(String(props.modelValue ?? '')))

const displayValue = computed(() => {
  if (!props.show || visible.value) {
    return rawValue.value
  }

  return rawValue.value ? '***' : ''
})

const labelStyle = computed<CSSProperties>(() => ({
  width: normalizeSize(props.labelWidth),
  textAlign: props.labelPosition
}))

const controlStyle = computed<CSSProperties>(() => ({
  width: normalizeSize(props.inputWidth)
}))

function normalizeSize(value: string | number) {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

function normalizeValue(value: string) {
  if (props.type !== 'number') {
    return value
  }

  return value.replace(/\D/g, '')
}

function getNextDisplayValue(value: string) {
  if (!props.show || visible.value) {
    return value
  }

  return value ? '***' : ''
}

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  const value = normalizeValue(input.value)
  input.value = getNextDisplayValue(value)
  emit('update:modelValue', value)
}

function handleChange(event: Event) {
  const input = event.target as HTMLInputElement
  const value = props.show && !visible.value ? rawValue.value : normalizeValue(input.value)
  input.value = getNextDisplayValue(value)
  emit('change', value)
}

function toggleVisible() {
  if (props.disabled) {
    return
  }

  visible.value = !visible.value
}
</script>
