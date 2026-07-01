import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { U1Dialog } from '../dialog'

describe('U1Dialog', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders title content when visible', () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: true,
        title: 'Dialog title'
      },
      slots: {
        default: 'Dialog content'
      }
    })

    expect(wrapper.text()).toContain('Dialog title')
    expect(wrapper.text()).toContain('Dialog content')
    expect(wrapper.find('.u1-dialog__footer').exists()).toBe(false)
    expect(wrapper.get('.u1-dialog').attributes('style')).toContain('width: 50%')
  })

  it('emits close updates when close button is clicked', async () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: true,
        title: 'Dialog title'
      }
    })

    await wrapper.get('.u1-dialog__close').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders dialog semantics and accessible close button', () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: true,
        title: 'Settings'
      }
    })

    const dialog = wrapper.find('.u1-dialog')

    expect(dialog.attributes('role')).toBe('dialog')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-label')).toBe('Settings')
    expect(wrapper.find('.u1-dialog__close').attributes('aria-label')).toBe('Close dialog')
  })

  it('locks body scroll while open and restores it after close', async () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: false
      },
      attachTo: document.body
    })

    expect(document.body.style.overflow).toBe('')

    await wrapper.setProps({ modelValue: true })

    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })

    expect(document.body.style.overflow).toBe('')

    wrapper.unmount()
  })

  it('does not reset existing body overflow when initially hidden', () => {
    document.body.style.overflow = 'clip'

    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: false
      },
      attachTo: document.body
    })

    expect(document.body.style.overflow).toBe('clip')

    wrapper.unmount()
  })

  it('uses draggable header by default', () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: true,
        title: 'Default draggable dialog'
      }
    })

    expect(wrapper.get('.u1-dialog__header').classes()).toContain('is-draggable')
  })

  it('supports top offset and draggable header movement', async () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: true,
        title: 'Drag dialog',
        top: '38px',
        draggable: true
      }
    })

    expect(wrapper.get('.u1-dialog').attributes('style')).toContain('top: 38px')

    await wrapper.get('.u1-dialog__header').trigger('mousedown', {
      clientX: 10,
      clientY: 20
    })

    expect(wrapper.get('.u1-dialog').classes()).toContain('is-dragging')

    ;(wrapper.vm as unknown as { endDrag?: () => void }).endDrag?.()

    await wrapper.vm.$nextTick()
    expect(wrapper.get('.u1-dialog').classes()).not.toContain('is-dragging')
  })
})
