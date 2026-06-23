<script setup lang="ts">
interface Option { value: number; label: string }

const props = withDefaults(defineProps<{
  value?: number[]
  options?: Option[]
  config?: { text?: string }
}>(), {
  value: () => [],
  options: () => [],
})

const emit = defineEmits<{ change: [val: number[]] }>()

function toggle(val: number, checked: boolean) {
  const next = checked
    ? [...(props.value ?? []), val]
    : (props.value ?? []).filter((v) => v !== val)
  emit('change', next)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="config?.text" class="text-sm font-medium text-gray-700">{{ config.text }}</label>
    <div class="flex flex-wrap gap-3">
      <label
        v-for="opt in options"
        :key="opt.value"
        class="flex items-center gap-1.5 text-sm cursor-pointer"
      >
        <input
          type="checkbox"
          :checked="(value ?? []).includes(opt.value)"
          class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          @change="toggle(opt.value, ($event.target as HTMLInputElement).checked)"
        />
        {{ opt.label }}
      </label>
    </div>
  </div>
</template>
