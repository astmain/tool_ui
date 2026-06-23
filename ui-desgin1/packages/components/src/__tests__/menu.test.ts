import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Menu } from '../menu'

describe('U1Menu', () => {
  const items = [
    { index: 'dashboard', label: 'Dashboard' },
    { index: 'settings', label: 'Settings' },
    { index: 'disabled', label: 'Disabled', disabled: true }
  ]

  it('renders menu items and active state', () => {
    const wrapper = mount(U1Menu, {
      props: {
        items,
        active: 'settings'
      }
    })

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.findAll('.u1-menu__item')[1].classes()).toContain('is-active')
  })

  it('emits select when enabled item is clicked', async () => {
    const wrapper = mount(U1Menu, {
      props: {
        items,
        active: 'dashboard'
      }
    })

    await wrapper.findAll('.u1-menu__item')[1].trigger('click')

    expect(wrapper.emitted('update:active')?.[0]).toEqual(['settings'])
    expect(wrapper.emitted('select')?.[0]).toEqual(['settings'])
  })

  it('supports horizontal mode and disabled items', async () => {
    const wrapper = mount(U1Menu, {
      props: {
        items,
        mode: 'horizontal'
      }
    })

    expect(wrapper.classes()).toContain('u1-menu--horizontal')

    await wrapper.findAll('.u1-menu__item')[2].trigger('click')

    expect(wrapper.findAll('.u1-menu__item')[2].classes()).toContain('is-disabled')
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
