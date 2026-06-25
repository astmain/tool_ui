<template>
  <nav class="u1-menu" :class="`u1-menu--${mode}`">
    <button
      v-for="item in items"
      :key="item.index"
      class="u1-menu__item"
      :class="{
        'is-active': item.index === active,
        'is-disabled': item.disabled
      }"
      type="button"
      :disabled="item.disabled"
      :aria-current="item.index === active ? 'page' : undefined"
      @click="selectItem(item)"
      @keydown.enter.prevent="selectItem(item)"
      @keydown.space.prevent="selectItem(item)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
export interface U1MenuItem {
  index: string
  label: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    items: U1MenuItem[]
    active?: string
    mode?: 'vertical' | 'horizontal'
  }>(),
  {
    active: '',
    mode: 'vertical'
  }
)

defineOptions({
  name: 'U1Menu'
})

const emit = defineEmits<{
  'update:active': [value: string]
  select: [value: string]
}>()

function selectItem(item: U1MenuItem) {
  if (item.disabled) {
    return
  }

  emit('update:active', item.index)
  emit('select', item.index)
}
</script>
