import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Textarea } from './index'

describe('U1Textarea', () => {
  it('renders placeholder and emits model updates', async () => {
    const wrapper = mount(U1Textarea, {
      props: {
        modelValue: '',
        placeholder: '请输入内容'
      }
    })

    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('placeholder')).toBe('请输入内容')

    await textarea.setValue('hello')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('emits change when value is committed', async () => {
    const wrapper = mount(U1Textarea, {
      props: {
        modelValue: 'old'
      }
    })

    await wrapper.get('textarea').setValue('new')
    await wrapper.get('textarea').trigger('change')

    expect(wrapper.emitted('change')?.[0]).toEqual(['new'])
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(U1Textarea, {
      props: {
        modelValue: ''
      }
    })

    await wrapper.get('textarea').trigger('focus')
    await wrapper.get('textarea').trigger('blur')

    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('applies rows attribute', () => {
    const wrapper = mount(U1Textarea, {
      props: {
        modelValue: '',
        rows: 5
      }
    })

    expect(wrapper.get('textarea').attributes('rows')).toBe('5')
  })

  it('shows word limit when enabled with maxlength', () => {
    const wrapper = mount(U1Textarea, {
      props: {
        modelValue: 'abc',
        maxlength: 10,
        showWordLimit: true
      }
    })

    expect(wrapper.get('.u1-textarea__count').text()).toBe('3 / 10')
  })

  it('supports disabled state', () => {
    const wrapper = mount(U1Textarea, {
      props: {
        modelValue: 'text',
        disabled: true
      }
    })

    expect(wrapper.get('textarea').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
