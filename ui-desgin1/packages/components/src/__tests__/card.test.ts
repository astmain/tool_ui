import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Card } from '../card'

describe('U1Card', () => {
  it('renders header default and footer slots', () => {
    const wrapper = mount(U1Card, {
      slots: {
        header: 'Card header',
        default: 'Card body',
        footer: 'Card footer'
      }
    })

    expect(wrapper.text()).toContain('Card header')
    expect(wrapper.text()).toContain('Card body')
    expect(wrapper.text()).toContain('Card footer')
  })

  it('renders shadow class', () => {
    const wrapper = mount(U1Card, {
      props: { shadow: 'hover' }
    })

    expect(wrapper.classes()).toContain('u1-card')
    expect(wrapper.classes()).toContain('u1-card--shadow-hover')
  })
})
