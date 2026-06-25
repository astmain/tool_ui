<template>
  <span class="u1-input" :class="{ 'is-disabled': disabled }">
    <input
      class="u1-input__inner"
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @change="handleChange"
    />
    <button v-if="clearable && modelValue" class="u1-input__clear" type="button" :disabled="disabled" aria-label="clear" @click="handleClear">x</button>
    <button
      v-if="showPassword"
      class="u1-input__password"
      type="button"
      :disabled="disabled"
      :aria-pressed="passwordVisible ? 'true' : 'false'"
      :aria-label="passwordVisible ? 'hide password' : 'show password'"
      @click="togglePasswordVisible"
    >
      {{ passwordVisible ? 'hide' : 'show' }}
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({
  name: 'U1Input',
});

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    showPassword?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    disabled: false,
    clearable: false,
    showPassword: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
  clear: [];
}>();

const passwordVisible = ref(false)
const inputType = computed(() => {
  if (!props.showPassword) {
    return 'text'
  }

  return passwordVisible.value ? 'text' : 'password'
})

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function handleChange(event: Event) {
  emit('change', (event.target as HTMLInputElement).value);
}

function handleClear() {
  emit('update:modelValue', '');
  emit('clear');
}

function togglePasswordVisible() {
  if (props.disabled) {
    return
  }

  passwordVisible.value = !passwordVisible.value
}
</script>
