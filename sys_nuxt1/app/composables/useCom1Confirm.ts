/**
 * useCom1Confirm - 通用确认弹框 Com1Confirm 的异步调用封装
 *
 * 采用模块级单例 + Promise 异步流程设计，
 * 让调用方可以像调用普通函数一样，以同步语法写出异步交互逻辑。
 *
 * ## 使用示例
 *
 *   const { Com1Confirm } = useCom1Confirm()
 *
 *   // 默认参数
 *   const confirmed = await Com1Confirm()
 *
 *   // 自定义 message
 *   const confirmed = await Com1Confirm({ message: '确定删除该分类吗？' })
 *
 *   // 自定义 title + message
 *   const confirmed = await Com1Confirm({ title: '删除提示', message: '确定删除该分类吗？' })
 */

interface Com1ConfirmOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

let _resolve: ((value: boolean) => void) | null = null
let _container: HTMLElement | null = null
let _isOpen = false
let _root: any = null

function getOrCreateContainer(): HTMLElement {
  if (!_container) {
    _container = document.createElement('div')
    _container.id = 'com1-confirm-root'
    document.body.appendChild(_container)
  }
  return _container
}

function renderBox(title: string, message: string, confirmText: string, cancelText: string) {
  if (typeof window === 'undefined') return

  const container = getOrCreateContainer()
  container.innerHTML = ''

  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9998'

  const box = document.createElement('div')
  box.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:#fff;border-radius:12px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);width:100%;max-width:420px;padding:20px 24px;font-family:ui-sans-serif,system-ui,sans-serif'

  const h2 = document.createElement('h2')
  h2.textContent = title
  h2.style.cssText = 'margin:0 0 12px;font-size:16px;font-weight:700;color:#111'

  const p = document.createElement('p')
  p.textContent = message
  p.style.cssText = 'margin:0 0 20px;font-size:14px;color:#555;line-height:1.6'

  const btnRow = document.createElement('div')
  btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:10px'

  const cancelBtn = document.createElement('button')
  cancelBtn.textContent = cancelText
  cancelBtn.style.cssText = 'padding:8px 20px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#555;font-size:14px;cursor:pointer'

  const confirmBtn = document.createElement('button')
  confirmBtn.textContent = confirmText
  confirmBtn.style.cssText = 'padding:8px 20px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:14px;cursor:pointer'

  cancelBtn.addEventListener('click', () => {
    _resolve?.(false)
    _resolve = null
    _isOpen = false
    container.innerHTML = ''
  })

  confirmBtn.addEventListener('click', () => {
    _resolve?.(true)
    _resolve = null
    _isOpen = false
    container.innerHTML = ''
  })

  overlay.addEventListener('click', () => {
    _resolve?.(false)
    _resolve = null
    _isOpen = false
    container.innerHTML = ''
  })

  btnRow.appendChild(cancelBtn)
  btnRow.appendChild(confirmBtn)
  box.appendChild(h2)
  box.appendChild(p)
  box.appendChild(btnRow)
  container.appendChild(overlay)
  container.appendChild(box)
}

export function useCom1Confirm() {
  /**
   * 显示确认弹框，返回用户选择结果
   *
   * @param options.title 弹框标题，默认 "提示"
   * @param options.message 弹框内容，默认 "确定删除吗"
   * @param options.confirmText 确认按钮文字，默认 "确定"
   * @param options.cancelText 取消按钮文字，默认 "取消"
   * @returns Promise<boolean> 用户点击确定返回 true，取消返回 false
   *
   * @example
   *   const { Com1Confirm } = useCom1Confirm()
   *   const confirmed = await Com1Confirm({ message: '确定删除该分类吗？' })
   *   if (!confirmed) return
   *   await deleteCategory(id)
   */
  async function Com1Confirm(options: Com1ConfirmOptions = {}): Promise<boolean> {
    const {
      title = '提示',
      message = '确定删除吗',
      confirmText = '确定',
      cancelText = '取消',
    } = options

    if (typeof window === 'undefined') return false

    // 如果弹框已打开，等待其关闭
    if (_isOpen) return false

    return new Promise<boolean>((resolve) => {
      _resolve = resolve
      _isOpen = true
      renderBox(title, message, confirmText, cancelText)
    })
  }

  return { Com1Confirm }
}
