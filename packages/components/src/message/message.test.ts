import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { U1Message, U1MessageComponent } from './index'

describe('U1Message', () => {
  it('renders message type and content', () => {
    const wrapper = mount(U1MessageComponent, {
      props: {
        type: 'success',
        message: '保存成功'
      }
    })

    expect(wrapper.text()).toContain('保存成功')
    expect(wrapper.classes()).toContain('u1-message--success')
  })

  it('emits close and hides itself when close button is clicked', async () => {
    const wrapper = mount(U1MessageComponent, {
      props: {
        message: 'Closable message',
        showClose: true
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.find('.u1-message').exists()).toBe(false)
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('creates a function message and returns a close handler', async () => {
    const handler = U1Message('保存成功')
    await nextTick()

    expect(document.body.querySelector('.u1-message')?.textContent).toContain('保存成功')

    handler.close()
    await nextTick()

    expect(document.body.querySelector('.u1-message')).toBeNull()
  })

  it('supports typed shortcut methods', async () => {
    U1Message.success('操作成功')
    U1Message.error({ message: '操作失败', duration: 0 })
    await nextTick()

    expect(document.body.querySelector('.u1-message--success')?.textContent).toContain('操作成功')
    expect(document.body.querySelector('.u1-message--error')?.textContent).toContain('操作失败')
  })

  it('keeps duration zero messages until closed manually', async () => {
    vi.useFakeTimers()
    U1Message({ message: '常驻提示', duration: 0 })
    await nextTick()

    vi.advanceTimersByTime(5000)
    await nextTick()

    expect(document.body.querySelector('.u1-message')?.textContent).toContain('常驻提示')
  })

  it('merges grouped messages with the same content', async () => {
    U1Message({ message: '重复提示', grouping: true, type: 'warning' })
    U1Message({ message: '重复提示', grouping: true, type: 'warning' })
    await nextTick()

    const messages = document.body.querySelectorAll('.u1-message')
    expect(messages).toHaveLength(1)
    expect(messages[0].textContent).toContain('重复提示')
    expect(messages[0].textContent).toContain('x 2')
  })
})

afterEach(() => {
  U1Message.closeAll()
  vi.useRealTimers()
})
