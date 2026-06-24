import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Checkbox, U1CheckboxGroup } from '../checkbox'

describe('U1Checkbox', () => {
  it('emits boolean model updates when used alone', async () => {
    const wrapper = mount(U1Checkbox, {
      props: {
        modelValue: false
      },
      slots: {
        default: 'Agree'
      }
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('supports custom true and false values', async () => {
    const wrapper = mount(U1Checkbox, {
      props: {
        modelValue: 'no',
        trueValue: 'yes',
        falseValue: 'no'
      }
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yes'])
    expect(wrapper.classes()).not.toContain('is-checked')
  })

  it('renders disabled and indeterminate states', () => {
    const wrapper = mount(U1Checkbox, {
      props: {
        modelValue: false,
        disabled: true,
        indeterminate: true
      }
    })

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.classes()).toContain('is-indeterminate')
    expect((wrapper.get('input').element as HTMLInputElement).indeterminate).toBe(true)
    expect(wrapper.get('input').attributes('aria-checked')).toBe('mixed')
  })
})

describe('U1CheckboxGroup', () => {
  it('emits array updates from child checkboxes', async () => {
    const wrapper = mount({
      components: {
        U1Checkbox,
        U1CheckboxGroup
      },
      template: `
        <U1CheckboxGroup :model-value="value">
          <U1Checkbox label="shanghai">Shanghai</U1Checkbox>
          <U1Checkbox label="beijing">Beijing</U1Checkbox>
        </U1CheckboxGroup>
      `,
      data() {
        return {
          value: ['shanghai']
        }
      }
    })

    await wrapper.findAll('input')[1].setValue(true)

    const group = wrapper.getComponent(U1CheckboxGroup)

    expect(group.emitted('update:modelValue')?.[0]).toEqual([['shanghai', 'beijing']])
    expect(group.emitted('change')?.[0]).toEqual([['shanghai', 'beijing']])
  })

  it('inherits disabled state from group', () => {
    const wrapper = mount({
      components: {
        U1Checkbox,
        U1CheckboxGroup
      },
      template: `
        <U1CheckboxGroup :model-value="[]" disabled>
          <U1Checkbox label="shanghai">Shanghai</U1Checkbox>
        </U1CheckboxGroup>
      `
    })

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.getComponent(U1Checkbox).classes()).toContain('is-disabled')
  })
})
