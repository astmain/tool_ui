<script setup lang="ts">
interface Option { value: string; label: string }

const props = withDefaults(defineProps<{
  value?: string
  options?: Option[]
  config?: { text?: string; width?: string }
}>(), {
  value: '',
  options: () => [],
})

const emit = defineEmits<{ change: [val: string] }>()
</script>

<template>
  <div class="flex items-center gap-3">
    <label
      v-if="config?.text"
      :class="[config.width ?? 'w-20', 'text-right text-sm font-medium text-gray-700 shrink-0']"
    >
      {{ config.text }}
    </label>
    <select
      :value="value"
      class="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      @change="emit('change', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>
