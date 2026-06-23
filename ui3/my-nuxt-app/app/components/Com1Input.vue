<script setup lang="ts">
interface Props {
  value?: string
  config?: { text?: string; width?: string }
  placeholder?: string
  type?: string
  disabled?: boolean
  maxLength?: number
  inputClass?: string
  error?: string
}

withDefaults(defineProps<Props>(), {
  value: '',
  type: 'text',
  disabled: false,
})

const emit = defineEmits<{ change: [val: string] }>()
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
      <input
        :type="type ?? 'text'"
        :value="value"
        :placeholder="placeholder ?? ''"
        :disabled="disabled"
        :maxlength="maxLength"
        :class="[
          'w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white',
          error ? 'border-red-500' : 'border-gray-300',
          inputClass ?? '',
        ]"
        @input="emit('change', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>
  </div>
</template>
