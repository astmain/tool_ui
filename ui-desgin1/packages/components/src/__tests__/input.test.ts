import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Input } from '../input'

describe('U1Input', () => {
  it('renders placeholder and emits model updates', async () => {
    const wrapper = mount(U1Input, {
      props: {
        modelValue: '',
        placeholder: '请输入内容'
      }
    })

    const input = wrapper.get('input')
    expect(input.attributes('placeholder')).toBe('请输入内容')

    await input.setValue('hello')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('clears value when clear button is clicked', async () => {
    const wrapper = mount(U1Input, {
      props: {
        modelValue: 'hello',
        clearable: true
      }
    })

    await wrapper.get('button.u1-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('emits change when input value is committed', async () => {
    const wrapper = mount(U1Input, {
      props: {
        modelValue: 'old'
      }
    })

    await wrapper.get('input').setValue('new')
    await wrapper.get('input').trigger('change')

    expect(wrapper.emitted('change')?.[0]).toEqual(['new'])
  })

  it('toggles password visibility when requested', async () => {
    const wrapper = mount(U1Input, {
      props: {
        modelValue: 'secret',
        showPassword: true
      }
    })

    expect(wrapper.get('input').attributes('type')).toBe('password')

    await wrapper.get('button.u1-input__password').trigger('click')

    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('supports password and disabled states', () => {
    const wrapper = mount(U1Input, {
      props: {
        modelValue: 'secret',
        showPassword: true,
        disabled: true
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('type')).toBe('password')
    expect(input.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
