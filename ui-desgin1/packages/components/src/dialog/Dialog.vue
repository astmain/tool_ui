<template>
  <div v-if="modelValue" class="u1-dialog__overlay" @click="handleOverlayClick">
    <section class="u1-dialog" :style="{ width }" role="dialog" aria-modal="true" :aria-label="title" @click.stop>
      <header class="u1-dialog__header">
        <slot name="header">
          <span class="u1-dialog__title">{{ title }}</span>
        </slot>
        <button class="u1-dialog__close" type="button" aria-label="Close dialog" @click="close">x</button>
      </header>
      <div class="u1-dialog__body">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="u1-dialog__footer">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    width?: string
    closeOnClickModal?: boolean
  }>(),
  {
    modelValue: false,
    title: '',
    width: '50%',
    closeOnClickModal: true
  }
)

defineOptions({
  name: 'U1Dialog'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnClickModal) {
    close()
  }
}
</script>
