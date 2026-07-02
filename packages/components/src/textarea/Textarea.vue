<template>
  <div class="u1-textarea" :class="{ 'is-disabled': disabled, 'has-word-limit': showWordLimit && maxlength }">
    <textarea
      ref="textareaRef"
      class="u1-textarea__inner"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      :style="innerStyle"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>
    <span v-if="showWordLimit && maxlength" class="u1-textarea__count">{{ textLength }} / {{ maxlength }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'U1Textarea',
})

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    rows?: number
    maxlength?: number
    showWordLimit?: boolean
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
    autosize?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    disabled: false,
    rows: 2,
    showWordLimit: false,
    resize: 'vertical',
    autosize: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const textLength = computed(() => props.modelValue?.length ?? 0)

const innerStyle = computed(() => ({
  resize: props.autosize ? 'none' : props.resize,
}))

function resizeToContent() {
  if (!props.autosize) {
    return
  }

  const el = textareaRef.value
  if (!el) {
    return
  }

  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function handleChange(event: Event) {
  emit('change', (event.target as HTMLTextAreaElement).value)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

watch(
  () => props.modelValue,
  () => {
    nextTick(resizeToContent)
  },
)

onMounted(() => {
  resizeToContent()
})
</script>
