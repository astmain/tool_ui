<template>
  <section
    v-if="modelValue"
    class="u1-dialog"
    :class="{ 'is-dragging': isDragging }"
    :style="dialogStyle"
    role="dialog"
    aria-modal="true"
    :aria-label="title"
  >
      <header
        class="u1-dialog__header"
        :class="{ 'is-draggable': draggable, 'is-dragging': isDragging }"
        @mousedown="startDrag"
      >
        <slot name="header">
          <span class="u1-dialog__title">{{ title }}</span>
        </slot>
        <button v-if="showClose" class="u1-dialog__close" type="button" aria-label="Close dialog" @click="close">x</button>
      </header>
      <div class="u1-dialog__body">
        <slot />
      </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    width?: string
    top?: string | number
    showClose?: boolean
    lockScroll?: boolean
    draggable?: boolean
  }>(),
  {
    modelValue: false,
    title: '',
    width: '50%',
    top: '15vh',
    showClose: true,
    lockScroll: true,
    draggable: true
  }
)

defineOptions({
  name: 'U1Dialog'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const position = reactive({ x: 0, y: 0 })
const lastPointer = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const originalBodyOverflow = ref('')
const hasLockedBodyScroll = ref(false)
const canUseDocument = typeof document !== 'undefined'

const normalizedTop = computed(() => (typeof props.top === 'number' ? `${props.top}px` : props.top))

const dialogStyle = computed(() => ({
  width: props.width,
  top: normalizedTop.value,
  transform: `translateX(-50%) translate(${position.x}px, ${position.y}px)`
}))

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      resetPosition()
      lockBodyScroll()
      return
    }

    unlockBodyScroll()
    endDrag()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  unlockBodyScroll()
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function resetPosition() {
  position.x = 0
  position.y = 0
  lastPointer.x = 0
  lastPointer.y = 0
}

function lockBodyScroll() {
  if (!props.lockScroll || !canUseDocument || document.body.style.overflow === 'hidden') {
    return
  }

  originalBodyOverflow.value = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  hasLockedBodyScroll.value = true
}

function unlockBodyScroll() {
  if (!props.lockScroll || !canUseDocument || !hasLockedBodyScroll.value) {
    return
  }

  document.body.style.overflow = originalBodyOverflow.value
  hasLockedBodyScroll.value = false
}

function startDrag(event: MouseEvent) {
  if (!props.draggable) {
    return
  }

  event.preventDefault()
  isDragging.value = true
  lastPointer.x = event.clientX
  lastPointer.y = event.clientY

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', endDrag)
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) {
    return
  }

  position.x += event.clientX - lastPointer.x
  position.y += event.clientY - lastPointer.y
  lastPointer.x = event.clientX
  lastPointer.y = event.clientY
}

function endDrag() {
  isDragging.value = false
  if (canUseDocument) {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', endDrag)
  }
}
</script>
