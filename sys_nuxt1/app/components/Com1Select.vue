<script setup lang="ts">
interface Props {
  value?: string | boolean | number
  options?: Array<{ value: string | number | boolean; label: string }>
  config?: { text?: string; width?: string }
  disabled?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  value: '',
  options: () => [],
  disabled: false,
})

const emit = defineEmits<{ change: [val: string] }>()

function handleChange(e: Event) {
  const target = e.target as HTMLSelectElement
  emit('change', target.value)
}
</script>

<template>
  <div class="flex items-start gap-3">
    <label
      v-if="config?.text"
      :class="[config.width ?? 'w-20', 'text-right pt-2 text-sm font-medium text-gray-700 shrink-0']"
    >
      {{ config.text }}
    </label>
    <div class="flex-1">
      <select
        :value="String(value)"
        :disabled="disabled"
        :class="[
          'w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white appearance-none cursor-pointer',
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white',
          error ? 'border-red-500' : 'border-gray-300',
        ]"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E&quot;); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;"
        @change="handleChange"
      >
        <option
          v-for="opt in options"
          :key="String(opt.value)"
          :value="String(opt.value)"
        >
          {{ opt.label }}
        </option>
      </select>
      <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>
  </div>
</template>
