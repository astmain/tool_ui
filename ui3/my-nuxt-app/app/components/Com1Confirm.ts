/** Com1Confirm - Promise 风格确认弹框 */
import { createApp, h } from 'vue'

export function Com1Confirm(props: { message?: string; title?: string; confirmText?: string; cancelText?: string }): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      setup() {
        return () => h('Teleport', { to: container }, [
          h('div', { class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/40' }, [
            h('div', { class: 'bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm mx-4' }, [
              h('h3', { class: 'text-base font-semibold text-gray-800 mb-2' }, props.title ?? '提示'),
              h('p', { class: 'text-sm text-gray-600 mb-6' }, props.message ?? '确定要执行此操作吗？'),
              h('div', { class: 'flex justify-end gap-2' }, [
                h('button', {
                  class: 'px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition',
                  onClick: () => { app.unmount(); document.body.removeChild(container); resolve(false) },
                }, props.cancelText ?? '取消'),
                h('button', {
                  class: 'px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition',
                  onClick: () => { app.unmount(); document.body.removeChild(container); resolve(true) },
                }, props.confirmText ?? '确定'),
              ]),
            ]),
          ]),
        ])
      },
    })
    app.mount(container)
  })
}
