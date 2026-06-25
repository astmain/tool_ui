<template>
  <U1Dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    v-bind="$attrs"
    @update:model-value="handleUpdate"
  >
    <U1ThemeEditor v-if="modelValue" />
  </U1Dialog>
</template>

<script setup lang="ts">
import U1Dialog from '../dialog/Dialog.vue'
import U1ThemeEditor from './ThemeEditor.vue'

interface Props {
  modelValue?: boolean
  title?: string
  width?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '主题编辑器',
  width: '720px'
})

defineOptions({ name: 'U1ThemeEditorDialog' })

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function handleUpdate(value: boolean) {
  emit('update:modelValue', value)
}
</script>
