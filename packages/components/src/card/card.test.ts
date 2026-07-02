import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Card } from './index'

describe('U1Card', () => {
  it('renders header and default slots only', () => {
    const wrapper = mount(U1Card, {
      slots: {
        header: 'Card header',
        default: 'Card body'
      }
    })

    expect(wrapper.text()).toContain('Card header')
    expect(wrapper.text()).toContain('Card body')
    expect(wrapper.find('.u1-card__footer').exists()).toBe(false)
  })

  it('ignores footer slot content', () => {
    const wrapper = mount(U1Card, {
      slots: {
        default: 'Card body',
        footer: 'Card footer'
      }
    })

    expect(wrapper.text()).toContain('Card body')
    expect(wrapper.text()).not.toContain('Card footer')
    expect(wrapper.find('.u1-card__footer').exists()).toBe(false)
  })

  it('renders shadow class', () => {
    const wrapper = mount(U1Card, {
      props: { shadow: 'hover' }
    })

    expect(wrapper.classes()).toContain('u1-card')
    expect(wrapper.classes()).toContain('u1-card--shadow-hover')
  })
})
