import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Avatar } from '../avatar'

describe('U1Avatar', () => {
  it('renders image avatar', () => {
    const wrapper = mount(U1Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        alt: 'User avatar'
      }
    })

    const image = wrapper.get('img')

    expect(image.attributes('src')).toBe('https://example.com/avatar.png')
    expect(image.attributes('alt')).toBe('User avatar')
  })

  it('renders text slot size and shape classes', () => {
    const wrapper = mount(U1Avatar, {
      props: {
        size: 'large',
        shape: 'square'
      },
      slots: {
        default: 'U1'
      }
    })

    expect(wrapper.text()).toContain('U1')
    expect(wrapper.classes()).toContain('u1-avatar--large')
    expect(wrapper.classes()).toContain('u1-avatar--square')
  })

  it('supports the mini size class', () => {
    const wrapper = mount(U1Avatar, {
      props: {
        size: 'mini'
      },
      slots: {
        default: 'XS'
      }
    })

    expect(wrapper.text()).toContain('XS')
    expect(wrapper.classes()).toContain('u1-avatar--mini')
  })

  it('shows fallback slot when the image fails to load', async () => {
    const wrapper = mount(U1Avatar, {
      props: {
        src: 'missing.png',
        alt: 'Missing user'
      },
      slots: {
        default: 'MU'
      }
    })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('MU')
  })
})
