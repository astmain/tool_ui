import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Button } from '../button'

describe('U1Button', () => {
  it('renders default slot and variant class', () => {
    const wrapper = mount(U1Button, {
      props: { type: 'primary' },
      slots: { default: 'Save' }
    })

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('u1-button')
    expect(wrapper.classes()).toContain('u1-button--primary')
  })

  it('renders dashed style class', () => {
    const wrapper = mount(U1Button, {
      props: { type: 'primary', dashed: true },
      slots: { default: 'Dashed' }
    })

    expect(wrapper.classes()).toContain('u1-button--primary')
    expect(wrapper.classes()).toContain('is-dashed')
  })

  it('renders disabled and loading states', () => {
    const wrapper = mount(U1Button, {
      props: { disabled: true, loading: true },
      slots: { default: 'Submit' }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.text()).toContain('Submit')
  })

  it('keeps variant class when disabled', () => {
    const wrapper = mount(U1Button, {
      props: { type: 'success', disabled: true },
      slots: { default: 'Success' }
    })

    expect(wrapper.classes()).toContain('u1-button--success')
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('supports text link background and native tag modes', () => {
    const wrapper = mount(U1Button, {
      props: {
        text: true,
        link: true,
        bg: true,
        tag: 'a',
        href: 'https://example.com'
      },
      slots: { default: 'Docs' }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.classes()).toContain('is-text')
    expect(wrapper.classes()).toContain('is-link')
    expect(wrapper.classes()).toContain('is-has-bg')
  })

  it('marks disabled anchor buttons as inaccessible links', () => {
    const wrapper = mount(U1Button, {
      props: {
        tag: 'a',
        href: 'https://example.com',
        disabled: true
      },
      slots: { default: 'Disabled link' }
    })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('renders icon slot before content', () => {
    const wrapper = mount(U1Button, {
      slots: {
        icon: '<span class="demo-icon">+</span>',
        default: 'Create'
      }
    })

    expect(wrapper.find('.u1-button__icon .demo-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Create')
  })
})
