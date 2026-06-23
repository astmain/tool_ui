/**
 * Com1Button - 通用按钮组件
 *
 * variant: primary | secondary | success | danger
 * size: mini | small | medium | large
 */
interface Props {
  text?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'mini' | 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  class?: string
  onClick?: () => void
}

const variantClass = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100',
  success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
}

const sizeClass = {
  mini: 'px-2 py-1 text-xs',
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-sm',
  large: 'px-5 py-2.5 text-base',
}

export default function Com1Button(props: Props) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed'
  const cls = `${base} ${variantClass[props.variant ?? 'primary']} ${sizeClass[props.size ?? 'medium']} ${props.class ?? ''}`

  return () =>
    h(
      'button',
      {
        class: cls,
        disabled: props.disabled || props.loading,
        onClick: props.onClick,
      },
      [
        props.loading
          ? h('div', { class: 'w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1' })
          : null,
        props.text ?? '',
      ].filter(Boolean),
    )
}
