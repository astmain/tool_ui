import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Layout1 } from './index'

const menus = [
  { path: '/home', title: '首页', icon: 'icon-home' },
  { path: '/about', title: '关于' },
  { path: '/lock', title: '锁定', disabled: true }
]

describe('U1Layout1', () => {
  it('renders an expanded sidebar at the configured width by default', () => {
    const wrapper = mount(U1Layout1, {
      props: { menus, activePath: '/home' }
    })

    expect(wrapper.classes()).not.toContain('u1-layout1--collapsed')
    expect(wrapper.get('.u1-layout1__sidebar').attributes('style')).toContain('width: 170px')
    expect(wrapper.get('.u1-layout1__link').attributes('title')).toBeUndefined()
    expect(wrapper.findAll('.u1-layout1__title')[0].text()).toBe('首页')
  })

  it('collapses the sidebar and exposes titles as hover tooltips', () => {
    const wrapper = mount(U1Layout1, {
      props: { menus, collapsed: true }
    })

    expect(wrapper.classes()).toContain('u1-layout1--collapsed')
    expect(wrapper.get('.u1-layout1__sidebar').attributes('style')).toContain('width: 64px')
    expect(wrapper.findAll('.u1-layout1__link')[0].attributes('title')).toBe('首页')
  })

  it('honors a custom collapsedWidth from config', () => {
    const wrapper = mount(U1Layout1, {
      props: { menus, collapsed: true, config: { collapsedWidth: '48px' } }
    })

    expect(wrapper.get('.u1-layout1__sidebar').attributes('style')).toContain('width: 48px')
  })

  it('emits select for enabled items and ignores disabled ones', async () => {
    const wrapper = mount(U1Layout1, {
      props: { menus }
    })

    const links = wrapper.findAll('.u1-layout1__link')
    await links[1].trigger('click')
    await links[2].trigger('click')

    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')?.[0]).toEqual(['/about'])
  })
})
