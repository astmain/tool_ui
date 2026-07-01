<script setup lang="ts">
interface Props {
  value?: string
  config?: { text?: string; width?: string }
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea'
  disabled?: boolean
  maxLength?: number
  inputClassName?: string
  error?: string
  name?: string
  rows?: number
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  value: '',
  type: 'text',
  disabled: false,
  rows: 3,
  required: false,
})

const emit = defineEmits<{
  change: [val: string]
  enter: []
}>()

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
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
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="flex-1">
      <textarea
        v-if="type === 'textarea'"
        :value="value"
        :placeholder="placeholder ?? ''"
        :disabled="disabled"
        :maxlength="maxLength"
        :rows="rows"
        :name="name"
        :class="[
          'w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none',
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white',
          error ? 'border-red-500' : 'border-gray-300',
          inputClassName ?? '',
        ]"
        @input="handleInput"
        @keydown.enter="$emit('enter')"
      />
      <input
        v-else
        :type="type ?? 'text'"
        :value="value"
        :placeholder="placeholder ?? ''"
        :disabled="disabled"
        :maxlength="maxLength"
        :name="name"
        :class="[
          'w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white',
          error ? 'border-red-500' : 'border-gray-300',
          inputClassName ?? '',
        ]"
        @input="handleInput"
        @keydown.enter="$emit('enter')"
      />
      <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>
  </div>
</template>
