<template>
  <span class="u1-input" :class="{ 'is-disabled': disabled }">
    <input class="u1-input__inner" :type="showPassword ? 'password' : 'text'" :value="modelValue" :placeholder="placeholder" :disabled="disabled" @input="handleInput" />
    <button v-if="clearable && modelValue" class="u1-input__clear" type="button" :disabled="disabled" aria-label="clear" @click="handleClear">x</button>
  </span>
</template>

<script setup lang="ts">
defineOptions({
  name: 'U1Input',
});

withDefaults(
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
  clear: [];
}>();

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function handleClear() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>
