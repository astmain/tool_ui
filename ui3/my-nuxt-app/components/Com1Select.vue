/**
 * Com1Select - 通用下拉选择组件
 */
interface Props {
  value?: string
  options?: Array<{ value: string; label: string }>
  config?: { text?: string; width?: string }
  onChange?: (val: string) => void
}

export default function Com1Select(props: Props, { emit }: any) {
  const labelWidth = props.config?.width ?? 'w-20'

  return () =>
    h(
      'div',
      { class: 'flex items-center gap-3' },
      props.config?.text
        ? h('label', { class: `${labelWidth} text-right text-sm font-medium text-gray-700 shrink-0` }, props.config.text)
        : null,
      h(
        'select',
        {
          value: props.value ?? '',
          class: 'flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white',
          onChange: (e: Event) => {
            const val = (e.target as HTMLSelectElement).value
            emit('change', val)
            props.onChange?.(val)
          },
        },
        (props.options ?? []).map((opt) =>
          h('option', { value: opt.value }, opt.label),
        ),
      ),
    )
}
