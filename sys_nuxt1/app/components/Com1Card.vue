<script setup lang="ts">
defineProps<{
  config?: {
    left?: string
    right?: string
  }
  class?: string
}>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div
      v-if="$slots['header-left'] || $slots['header-right'] || $slots.header || config?.left || config?.right"
      class="flex items-center justify-between px-4 py-3 bg-blue-800 text-white"
    >
      <div class="flex items-center gap-2">
        <slot name="header-left">
          <span v-if="config?.left" v-html="config.left" />
        </slot>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header-right">
          <span v-if="config?.right" v-html="config.right" />
        </slot>
      </div>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
