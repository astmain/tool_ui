<script setup lang="ts">
withDefaults(defineProps<{
  config?: { left?: any; right?: any }
}>(), {})
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div v-if="config?.left || config?.right" class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div>{{ config?.left ?? '' }}</div>
      <div>{{ config?.right ?? '' }}</div>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
