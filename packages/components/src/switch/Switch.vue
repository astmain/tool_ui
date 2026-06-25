<template>
  <button
    class="u1-switch"
    :class="{
      'is-checked': modelValue,
      'is-disabled': disabled
    }"
    type="button"
    role="switch"
    :aria-checked="modelValue ? 'true' : 'false'"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="u1-switch__core"></span>
    <span v-if="activeText || inactiveText" class="u1-switch__label">
      {{ modelValue ? activeText : inactiveText }}
    </span>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    activeText?: string
    inactiveText?: string
  }>(),
  {
    modelValue: false,
    disabled: false,
    activeText: '',
    inactiveText: ''
  }
)

defineOptions({
  name: 'U1Switch'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

function handleClick() {
  if (props.disabled) {
    return
  }

  const nextValue = !props.modelValue

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>
