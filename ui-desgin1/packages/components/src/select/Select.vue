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

defineProps<{
  modelValue?: SelectValue
  options: Array<{
    label: string
    value: SelectValue
  }>
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

function handleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value

  emit('update:modelValue', value)
  emit('change', value)
}
</script>
