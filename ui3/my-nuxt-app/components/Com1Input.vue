/**
 * Com1Input - 通用输入框组件
 *
 * 支持: label, placeholder, type, disabled, maxLength, error
 */
import { computed } from 'vue'

interface Props {
  value?: string
  config?: { text?: string; width?: string }
  placeholder?: string
  type?: string
  disabled?: boolean
  maxLength?: number
  inputClass?: string
  error?: string
  onChange?: (val: string) => void
}

export default function Com1Input(props: Props, { emit }: any) {
  const labelWidth = computed(() => props.config?.width ?? 'w-20')
  const hasLabel = computed(() => !!props.config?.text)

  return () =>
    h(
      'div',
      { class: 'flex items-start gap-3' },
      hasLabel.value
        ? h('label', { class: `${labelWidth.value} text-right pt-2 text-sm font-medium text-gray-700 shrink-0' }, props.config?.text ?? '')
        : null,
      h(
        'div',
        { class: 'flex-1' },
        [
          h('input', {
            type: props.type ?? 'text',
            value: props.value ?? '',
            placeholder: props.placeholder ?? '',
            disabled: props.disabled,
            maxlength: props.maxLength,
            class: [
              'w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
              props.disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white',
              props.error ? 'border-red-500' : 'border-gray-300',
              props.inputClass ?? '',
            ].join(' '),
            onInput: (e: Event) => {
              const val = (e.target as HTMLInputElement).value
              emit('change', val)
              props.onChange?.(val)
            },
          }),
          props.error ? h('p', { class: 'text-red-500 text-xs mt-1' }, props.error) : null,
        ],
      ),
    )
}
