/**
 * Com1Card - 通用卡片组件
 *
 * config.left  左侧内容
 * config.right 右侧内容
 */
interface Props {
  config?: {
    left?: any
    right?: any
  }
}

export default function Com1Card(props: Props) {
  return () =>
    h(
      'div',
      { class: 'bg-white rounded-lg border border-gray-200 shadow-sm' },
      [
        props.config?.left || props.config?.right
          ? h('div', { class: 'flex items-center justify-between px-4 py-3 border-b border-gray-200' }, [
              h('div', {}, props.config?.left ?? ''),
              h('div', {}, props.config?.right ?? ''),
            ])
          : null,
        h('div', { class: 'p-4' }, props.children ?? ''),
      ].filter(Boolean),
    )
}
