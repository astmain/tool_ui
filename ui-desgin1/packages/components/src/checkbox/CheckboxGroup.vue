<template>
  <div class="u1-checkbox-group" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { checkboxGroupKey, type U1CheckboxValue } from './context'

defineOptions({
  name: 'U1CheckboxGroup'
})

const props = withDefaults(
  defineProps<{
    modelValue: U1CheckboxValue[]
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: U1CheckboxValue[]]
  change: [value: U1CheckboxValue[]]
}>()

const modelValue = computed(() => props.modelValue)

function change(value: U1CheckboxValue, checked: boolean) {
  const nextValue = checked ? [...props.modelValue, value] : props.modelValue.filter((item) => item !== value)

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

provide(checkboxGroupKey, {
  modelValue,
  disabled: toRef(props, 'disabled'),
  change
})
</script>
