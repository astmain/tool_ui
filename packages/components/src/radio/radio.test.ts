import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { U1Radio, U1RadioGroup } from './index'

describe('U1Radio', () => {
  it('emits label value when selected standalone', async () => {
    const wrapper = mount(U1Radio, {
      props: {
        modelValue: 'a',
        label: 'b'
      },
      slots: { default: 'Option B' }
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
  })

  it('honors disabled state', () => {
    const wrapper = mount(U1Radio, {
      props: {
        modelValue: 'a',
        label: 'b',
        disabled: true
      }
    })

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
  })
})

describe('U1RadioGroup', () => {
  it('updates v-model when a grouped radio is selected', async () => {
    const Demo = defineComponent({
      components: { U1Radio, U1RadioGroup },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <U1RadioGroup v-model="value">
          <U1Radio label="a">A</U1Radio>
          <U1Radio label="b">B</U1Radio>
        </U1RadioGroup>
      `
    })

    const wrapper = mount(Demo)

    await wrapper.findAll('input')[1].setValue(true)

    expect((wrapper.vm as unknown as { value: string }).value).toBe('b')
  })

  it('updates v-model when a visible grouped radio label is clicked', async () => {
    const Demo = defineComponent({
      components: { U1Radio, U1RadioGroup },
      setup() {
        const value = ref('a')
        return { value }
      },
      template: `
        <U1RadioGroup v-model="value">
          <U1Radio label="a">A</U1Radio>
          <U1Radio label="b">B</U1Radio>
        </U1RadioGroup>
      `
    })

    const wrapper = mount(Demo)

    await wrapper.findAll('.u1-radio')[1].trigger('click')

    expect((wrapper.vm as unknown as { value: string }).value).toBe('b')
  })

  it('emits change when a grouped radio is selected', async () => {
    const wrapper = mount({
      components: {
        U1Radio,
        U1RadioGroup
      },
      template: `
        <U1RadioGroup model-value="a">
          <U1Radio label="a">A</U1Radio>
          <U1Radio label="b">B</U1Radio>
        </U1RadioGroup>
      `
    })

    await wrapper.findAll('input')[1].setValue(true)

    const group = wrapper.getComponent(U1RadioGroup)

    expect(group.emitted('change')?.[0]).toEqual(['b'])
  })
})
