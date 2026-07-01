<template>
  <div class="u1-checkbox-group" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { checkboxGroupKey, type U1CheckboxValue } from '@/checkbox/context'

defineOptions({
  name: 'U1CheckboxGroup'
})

const props = withDefaults(
  defineProps<{
    modelValue?: U1CheckboxValue[]
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: U1CheckboxValue[]]
  change: [value: U1CheckboxValue[]]
}>()

const modelValue = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))

function change(value: U1CheckboxValue, checked: boolean) {
  const current = modelValue.value
  const nextValue = checked ? [...current, value] : current.filter((item) => item !== value)

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

provide(checkboxGroupKey, {
  modelValue,
  disabled: toRef(props, 'disabled'),
  change
})
</script>
