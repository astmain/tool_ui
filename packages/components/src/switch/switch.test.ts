import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Switch } from './index'

describe('U1Switch', () => {
  it('emits model updates when toggled', async () => {
    const wrapper = mount(U1Switch, {
      props: {
        modelValue: false
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('renders active state and labels', () => {
    const wrapper = mount(U1Switch, {
      props: {
        modelValue: true,
        activeText: '开',
        inactiveText: '关'
      }
    })

    expect(wrapper.classes()).toContain('is-checked')
    expect(wrapper.text()).toContain('开')
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('true')
  })

  it('does not emit while disabled', async () => {
    const wrapper = mount(U1Switch, {
      props: {
        modelValue: false,
        disabled: true
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
