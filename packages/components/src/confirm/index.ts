import { createVNode, render } from 'vue'
import ConfirmComponent from './Confirm.vue'
import type { U1ConfirmType } from './Confirm.vue'

export type { U1ConfirmType }

export interface U1ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: U1ConfirmType
}

function normalizeOptions(options: string | U1ConfirmOptions): U1ConfirmOptions {
  if (typeof options === 'string') {
    return { message: options }
  }

  return options
}

// 函数式确认框:调用后动态挂载, 返回 Promise<boolean>
// 确认 resolve(true), 取消/关闭 resolve(false), 与 U1Message 风格一致
export function U1Confirm(options: string | U1ConfirmOptions): Promise<boolean> {
  const normalized = normalizeOptions(options)

  return new Promise<boolean>((resolve) => {
    const container = document.createElement('div')
    let settled = false

    function destroy() {
      render(null, container)
      container.remove()
    }

    function done(result: boolean) {
      if (settled) {
        return
      }

      settled = true
      resolve(result)
      // 等待关闭动画/DOM 更新后再卸载
      window.setTimeout(destroy, 0)
    }

    const vnode = createVNode(ConfirmComponent, {
      title: normalized.title,
      message: normalized.message,
      confirmText: normalized.confirmText,
      cancelText: normalized.cancelText,
      type: normalized.type,
      onConfirm: () => done(true),
      onCancel: () => done(false)
    })

    render(vnode, container)
    document.body.appendChild(container)
  })
}

export const U1ConfirmComponent = ConfirmComponent
export default U1Confirm
