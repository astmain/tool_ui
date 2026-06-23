<template>
  <div class="u1-radio-group" role="radiogroup">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { radioGroupKey } from './context'

defineOptions({
  name: 'U1RadioGroup'
})

const props = withDefaults(
  defineProps<{
    modelValue: string | number | boolean
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

const modelValue = computed(() => props.modelValue)

function change(value: string | number | boolean) {
  emit('update:modelValue', value)
  emit('change', value)
}

provide(radioGroupKey, {
  modelValue,
  disabled: toRef(props, 'disabled'),
  change
})
</script>
