/**
 * Com1CheckBox - 通用复选框组件
 */
interface Props {
  value?: number[]
  options?: Array<{ value: number; label: string }>
  config?: { text?: string }
  onChange?: (val: number[]) => void
}

export default function Com1CheckBox(props: Props, { emit }: any) {
  function toggle(val: number, checked: boolean) {
    let next: number[]
    if (checked) {
      next = [...(props.value ?? []), val]
    } else {
      next = (props.value ?? []).filter((v) => v !== val)
    }
    emit('change', next)
    props.onChange?.(next)
  }

  return () =>
    h(
      'div',
      { class: 'flex flex-col gap-1' },
      [
        props.config?.text ? h('label', { class: 'text-sm font-medium text-gray-700' }, props.config.text) : null,
        h(
          'div',
          { class: 'flex flex-wrap gap-3' },
          (props.options ?? []).map((opt) =>
            h(
              'label',
              { class: 'flex items-center gap-1.5 text-sm cursor-pointer' },
              h('input', {
                type: 'checkbox',
                checked: (props.value ?? []).includes(opt.value),
                class: 'w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500',
                onChange: (e: Event) => toggle(opt.value, (e.target as HTMLInputElement).checked),
              }),
              opt.label,
            ),
          ),
        ),
      ].filter(Boolean),
    )
}
