import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Message } from '../message'

describe('U1Message', () => {
  it('renders message type and content', () => {
    const wrapper = mount(U1Message, {
      props: {
        type: 'success',
        message: '保存成功'
      }
    })

    expect(wrapper.text()).toContain('保存成功')
    expect(wrapper.classes()).toContain('u1-message--success')
  })

  it('emits close when close button is clicked', async () => {
    const wrapper = mount(U1Message, {
      props: {
        message: '提示',
        showClose: true
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('hides itself after close button is clicked', async () => {
    const wrapper = mount(U1Message, {
      props: {
        message: '可关闭提示',
        showClose: true
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.find('.u1-message').exists()).toBe(false)
  })
})
