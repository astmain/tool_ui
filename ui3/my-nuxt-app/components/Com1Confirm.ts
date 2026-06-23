/**
 * Com1Confirm - 确认弹框 (Promise 风格)
 *
 * await Com1Confirm({ message: '确定删除？' })
 *
 * 在 Nuxt/Vue 环境中使用，返回 Promise<boolean>
 */
import { createApp, h, ref, onMounted } from 'vue'

interface Props {
  message?: string
  title?: string
  confirmText?: string
  cancelText?: string
}

export function Com1Confirm(props: Props): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    let mounted = true
    const cleanup = () => {
      if (!mounted) return
      mounted = false
      app.unmount()
      document.body.removeChild(container)
    }
    const app = createApp({
      setup() {
        const visible = ref(true)
        return () =>
          h(
            'Teleport',
            { to: container },
            h(
              'div',
              { class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/40' },
              h(
                'div',
                { class: 'bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm mx-4' },
                [
                  h('h3', { class: 'text-base font-semibold text-gray-800 mb-2' }, props.title ?? '提示'),
                  h('p', { class: 'text-sm text-gray-600 mb-6' }, props.message ?? '确定要执行此操作吗？'),
                  h('div', { class: 'flex justify-end gap-2' }, [
                    h('button', {
                      class: 'px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition',
                      onClick: () => { visible.value = false; resolve(false); cleanup() },
                    }, props.cancelText ?? '取消'),
                    h('button', {
                      class: 'px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition',
                      onClick: () => { visible.value = false; resolve(true); cleanup() },
                    }, props.confirmText ?? '确定'),
                  ]),
                ],
              ),
            ),
          )
      },
    })
    app.mount(container)
  })
}
