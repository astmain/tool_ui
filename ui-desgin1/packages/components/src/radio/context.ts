import type { InjectionKey, Ref } from 'vue'

export interface U1RadioGroupContext {
  modelValue: Ref<string | number | boolean>
  disabled: Ref<boolean>
  change: (value: string | number | boolean) => void
}

export const radioGroupKey: InjectionKey<U1RadioGroupContext> = Symbol('U1RadioGroup')
