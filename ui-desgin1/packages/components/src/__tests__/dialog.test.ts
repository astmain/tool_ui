import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Dialog } from '../dialog'

describe('U1Dialog', () => {
  it('renders title content and footer when visible', () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: true,
        title: 'Dialog title'
      },
      slots: {
        default: 'Dialog content',
        footer: 'Dialog footer'
      }
    })

    expect(wrapper.text()).toContain('Dialog title')
    expect(wrapper.text()).toContain('Dialog content')
    expect(wrapper.text()).toContain('Dialog footer')
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

  it('supports custom width and modal click close control', async () => {
    const wrapper = mount(U1Dialog, {
      props: {
        modelValue: true,
        width: '420px',
        closeOnClickModal: false
      }
    })

    expect(wrapper.get('.u1-dialog').attributes('style')).toContain('width: 420px')

    await wrapper.get('.u1-dialog__overlay').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
