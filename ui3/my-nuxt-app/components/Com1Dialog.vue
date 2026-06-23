/**
 * Com1Dialog - 通用弹框组件
 *
 * 支持:
 * - open 控制显示/隐藏
 * - title 标题
 * - width 最大宽度 (默认 max-w-md)
 * - top 距离顶部偏移
 * - confirmText / cancelText 自定义按钮文本
 * - onConfirm / onCancel / onClose 回调
 * - 右上角关闭按钮 + ESC 键关闭
 */
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  open: boolean
  title?: string
  width?: string
  top?: number
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

export default function Com1Dialog(props: Props, { emit }: any) {
  const visible = ref(props.open)

  watch(
    () => props.open,
    (val) => {
      visible.value = val
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
  )

  function close() {
    visible.value = false
    document.body.style.overflow = ''
    emit('close')
    props.onClose?.()
  }

  function handleConfirm() {
    props.onConfirm?.()
  }

  function handleCancel() {
    props.onCancel?.()
    close()
  }

  function handleBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) {
      close()
    }
  }

  function handleEsc(e: KeyboardEvent) {
    if (e.key === 'Escape' && visible.value) close()
  }

  onMounted(() => document.addEventListener('keydown', handleEsc))
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
    document.body.style.overflow = ''
  })

  return () => {
    if (!visible.value) return null

    return h(
      'Teleport',
      { to: 'body' },
      h(
        'div',
        {
          class: 'dialog-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/40',
          style: { paddingTop: `${props.top ?? 80}px` },
          onClick: handleBackdropClick,
        },
        h(
          'div',
          {
            class: `bg-white rounded-lg shadow-2xl w-full ${props.width ?? 'max-w-md'} max-h-[calc(100vh-160px)] flex flex-col animate-in fade-in zoom-in-95 duration-200`,
          },
          [
            // Header
            h('div', { class: 'flex items-center justify-between px-5 py-4 border-b border-gray-100' }, [
              h('h3', { class: 'text-base font-semibold text-gray-800' }, props.title ?? ''),
              h(
                'button',
                {
                  class: 'w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition',
                  onClick: close,
                },
                h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
                  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 2, d: 'M6 18L18 6M6 6l12 12' }),
                ]),
              ),
            ]),
            // Content
            h('div', { class: 'flex-1 overflow-y-auto px-5 py-4' }, props.children),
            // Footer
            h('div', { class: 'flex justify-end gap-2 px-5 py-3 border-t border-gray-100' }, [
              h('button', {
                class: 'px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition',
                onClick: handleCancel,
              }, props.cancelText ?? '取消'),
              props.onConfirm ? h('button', {
                class: 'px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition',
                onClick: handleConfirm,
              }, props.confirmText ?? '确定') : null,
            ].filter(Boolean)),
          ],
        ),
      ),
    )
  }
}
