import type { InjectionKey, Ref } from 'vue'

export type U1CheckboxValue = string | number | boolean

export interface U1CheckboxGroupContext {
  modelValue: Ref<U1CheckboxValue[]>
  disabled: Ref<boolean>
  change: (value: U1CheckboxValue, checked: boolean) => void
}

export const checkboxGroupKey: InjectionKey<U1CheckboxGroupContext> = Symbol('U1CheckboxGroup')
