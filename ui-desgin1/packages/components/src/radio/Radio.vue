<template>
  <label
    class="u1-radio"
    :class="{
      'is-checked': checked,
      'is-disabled': mergedDisabled
    }"
  >
    <span class="u1-radio__input">
      <input
        class="u1-radio__original"
        type="radio"
        :checked="checked"
        :disabled="mergedDisabled"
        @change="selectRadio"
      />
      <span class="u1-radio__inner"></span>
    </span>
    <span class="u1-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { radioGroupKey } from './context'

defineOptions({
  name: 'U1Radio'
})

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean
    label: string | number | boolean
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

const group = inject(radioGroupKey, undefined)

const checked = computed(() => {
  return group ? group.modelValue.value === props.label : props.modelValue === props.label
})

const mergedDisabled = computed(() => props.disabled || group?.disabled.value === true)

function selectRadio() {
  if (mergedDisabled.value) {
    return
  }

  if (group) {
    group.change(props.label)
    return
  }

  emit('update:modelValue', props.label)
}
</script>
