<template>
  <span class="u1-select" :class="{ 'is-disabled': disabled }">
    <select class="u1-select__inner" :value="modelValue" :disabled="disabled" @change="handleChange">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="String(option.value)" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </span>
</template>

<script setup lang="ts">
defineOptions({
  name: 'U1Select'
})

type SelectValue = string | number

const props = defineProps<{
  modelValue?: SelectValue
  options: Array<{
    label: string
    value: SelectValue
  }>
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
  change: [value: SelectValue]
}>()

function handleChange(event: Event) {
  const rawValue = (event.target as HTMLSelectElement).value
  const selectedOption = props.options.find((option) => String(option.value) === rawValue)
  const value = selectedOption ? selectedOption.value : rawValue

  emit('update:modelValue', value)
  emit('change', value)
}
</script>
