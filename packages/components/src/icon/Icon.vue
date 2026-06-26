<template>
  <component :is="iconComponent" :data-icon="iconName" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIconComponent, resolveIconName } from './icons'

defineOptions({
  name: 'U1Icon'
})

const props = withDefaults(
  defineProps<{
    name?: string
  }>(),
  {
    name: ''
  }
)

const iconName = computed(() => resolveIconName(props.name))
const iconComponent = computed(() => getIconComponent(props.name))
</script>
