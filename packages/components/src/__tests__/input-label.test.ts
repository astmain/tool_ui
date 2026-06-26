import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1InputLabel } from '../input-label'

describe('U1InputLabel', () => {
  it('renders label, placeholder, default widths, and emits model updates', async () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: '',
        label: 'Name',
        placeholder: 'Input name'
      }
    })

    const label = wrapper.get('.u1-input-label__label')
    const input = wrapper.get('input')

    expect(label.text()).toBe('Name')
    expect(label.attributes('style')).toContain('width: 80px')
    expect(label.attributes('style')).toContain('text-align: right')
    expect(wrapper.get('.u1-input-label__control').attributes('style')).toContain('width: 220px')
    expect(input.attributes('placeholder')).toBe('Input name')

    await input.setValue('hello')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('supports custom label and input widths with left label alignment', () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: 'hello',
        label: 'Title',
        labelWidth: '120px',
        labelPosition: 'left',
        inputWidth: '320px'
      }
    })

    expect(wrapper.get('.u1-input-label__label').attributes('style')).toContain('width: 120px')
    expect(wrapper.get('.u1-input-label__label').attributes('style')).toContain('text-align: left')
    expect(wrapper.get('.u1-input-label__control').attributes('style')).toContain('width: 320px')
  })

  it('filters non-numeric characters when type is number', async () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: '',
        label: 'Age',
        type: 'number'
      }
    })

    const input = wrapper.get('input')
    await input.setValue('a12b3')

    expect((input.element as HTMLInputElement).value).toBe('123')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])
  })

  it('keeps any content when type is text', async () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: '',
        label: 'Code',
        type: 'text'
      }
    })

    await wrapper.get('input').setValue('a12-b_3')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a12-b_3'])
  })

  it('emits normalized change values', async () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: '',
        label: 'Count',
        type: 'number'
      }
    })

    const input = wrapper.get('input')
    await input.setValue('9x8')
    await input.trigger('change')

    expect(wrapper.emitted('change')?.[0]).toEqual(['98'])
  })

  it('supports disabled and readonly states', () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: 'locked',
        label: 'State',
        disabled: true,
        readonly: true,
        show: true
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('readonly')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.get('button.u1-input-label__toggle').attributes('disabled')).toBeDefined()
  })

  it('toggles masked text when show is enabled', async () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: 'secret',
        label: 'Token',
        show: true
      }
    })

    const input = wrapper.get('input')

    expect((input.element as HTMLInputElement).value).toBe('***')
    expect(wrapper.get('button.u1-input-label__toggle').attributes('aria-pressed')).toBe('false')

    await wrapper.get('button.u1-input-label__toggle').trigger('click')

    expect((input.element as HTMLInputElement).value).toBe('secret')
    expect(wrapper.get('button.u1-input-label__toggle').attributes('aria-pressed')).toBe('true')
  })

  it('renders password toggle icon as svg', async () => {
    const wrapper = mount(U1InputLabel, {
      props: {
        modelValue: 'secret',
        label: 'Token',
        show: true
      }
    })

    expect(wrapper.get('.u1-input-label__toggle .u1-icon').element.tagName.toLowerCase()).toBe('svg')
    expect(wrapper.get('.u1-input-label__toggle .u1-icon').attributes('data-icon')).toBe('eye-open')

    await wrapper.get('button.u1-input-label__toggle').trigger('click')

    expect(wrapper.get('.u1-input-label__toggle .u1-icon').attributes('data-icon')).toBe('hide')
  })
})
