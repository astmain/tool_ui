<template>
  <label
    class="u1-checkbox"
    :class="{
      'is-checked': checked,
      'is-disabled': mergedDisabled,
      'is-indeterminate': indeterminate
    }"
  >
    <span class="u1-checkbox__input">
      <input
        ref="inputRef"
        class="u1-checkbox__original"
        type="checkbox"
        :checked="checked"
        :disabled="mergedDisabled"
        :aria-checked="ariaChecked"
        @change="handleChange"
      />
      <span class="u1-checkbox__inner"></span>
    </span>
    <span class="u1-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { checkboxGroupKey, type U1CheckboxValue } from '@/checkbox/context'

defineOptions({
  name: 'U1Checkbox'
})

const props = withDefaults(
  defineProps<{
    modelValue?: U1CheckboxValue
    label?: U1CheckboxValue
    disabled?: boolean
    indeterminate?: boolean
    trueValue?: U1CheckboxValue
    falseValue?: U1CheckboxValue
  }>(),
  {
    modelValue: false,
    label: '',
    disabled: false,
    indeterminate: false,
    trueValue: true,
    falseValue: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: U1CheckboxValue]
  change: [value: U1CheckboxValue]
}>()

const group = inject(checkboxGroupKey, undefined)
const inputRef = ref<HTMLInputElement>()

const checked = computed(() => {
  if (group) {
    const groupValue = group.modelValue.value
    return Array.isArray(groupValue) && groupValue.includes(props.label)
  }

  return props.modelValue === props.trueValue
})

const mergedDisabled = computed(() => props.disabled || group?.disabled.value === true)
const ariaChecked = computed(() => (props.indeterminate ? 'mixed' : checked.value ? 'true' : 'false'))

function syncIndeterminateState() {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
}

onMounted(syncIndeterminateState)
watch(() => props.indeterminate, syncIndeterminateState)

function handleChange(event: Event) {
  if (mergedDisabled.value) {
    return
  }

  const isChecked = (event.target as HTMLInputElement).checked

  if (group) {
    group.change(props.label, isChecked)
    return
  }

  const nextValue = isChecked ? props.trueValue : props.falseValue

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>
