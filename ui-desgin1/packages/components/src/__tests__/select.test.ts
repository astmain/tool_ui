import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Select } from '../select'

describe('U1Select', () => {
  const options = [
    { label: '上海', value: 'shanghai' },
    { label: '北京', value: 'beijing' }
  ]

  it('renders options and emits model updates', async () => {
    const wrapper = mount(U1Select, {
      props: {
        modelValue: 'shanghai',
        options
      }
    })

    const select = wrapper.get('select')

    expect(select.element.value).toBe('shanghai')
    expect(wrapper.text()).toContain('上海')

    await select.setValue('beijing')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beijing'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['beijing'])
  })

  it('supports placeholder and disabled state', () => {
    const wrapper = mount(U1Select, {
      props: {
        modelValue: '',
        placeholder: '请选择',
        disabled: true,
        options
      }
    })

    expect(wrapper.get('select').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('请选择')
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
