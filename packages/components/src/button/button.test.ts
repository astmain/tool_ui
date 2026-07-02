import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Button } from './index'

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

  it('renders label prop when default slot is empty', () => {
    const wrapper = mount(U1Button, {
      props: { label: '我的按钮' }
    })

    expect(wrapper.text()).toContain('我的按钮')
  })

  it('prefers default slot over label prop', () => {
    const wrapper = mount(U1Button, {
      props: { label: '我的按钮' },
      slots: { default: '插槽按钮' }
    })

    expect(wrapper.text()).toContain('插槽按钮')
    expect(wrapper.text()).not.toContain('我的按钮')
  })

  it('ignores removed dashed attribute', () => {
    const wrapper = mount(U1Button, {
      attrs: { dashed: '' },
      props: { type: 'primary' },
      slots: { default: 'Dashed' }
    })

    expect(wrapper.classes()).toContain('u1-button--primary')
    expect(wrapper.classes()).not.toContain('is-dashed')
    expect(wrapper.attributes('dashed')).toBeUndefined()
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

  it('supports text link and background styles on native button only', () => {
    const wrapper = mount(U1Button, {
      props: {
        text: true,
        link: true,
        bg: true
      },
      slots: { default: 'Docs' }
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toContain('is-text')
    expect(wrapper.classes()).toContain('is-link')
    expect(wrapper.classes()).toContain('is-has-bg')
  })

  it('ignores removed tag and href attributes', () => {
    const wrapper = mount(U1Button, {
      attrs: {
        tag: 'a',
        href: 'https://example.com'
      },
      slots: { default: 'Docs' }
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('tag')).toBeUndefined()
  })

  it('does not emit click events while disabled or loading', async () => {
    const disabledButton = mount(U1Button, {
      props: {
        disabled: true,
        onClick: () => undefined
      },
      slots: { default: 'Disabled' }
    })

    const loadingButton = mount(U1Button, {
      props: {
        loading: true,
        onClick: () => undefined
      },
      slots: { default: 'Loading' }
    })

    await disabledButton.trigger('click')
    await loadingButton.trigger('click')

    expect(disabledButton.emitted('click')).toBeUndefined()
    expect(loadingButton.emitted('click')).toBeUndefined()
  })

  it('emits one click event when enabled', async () => {
    const wrapper = mount(U1Button, {
      slots: { default: 'Save' }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
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

  it('renders icon prop as left icon by default', () => {
    const wrapper = mount(U1Button, {
      props: {
        icon: 'add',
        label: 'Create'
      }
    })

    const leftIcon = wrapper.find('.u1-button__icon.is-left .u1-icon')

    expect(leftIcon.exists()).toBe(true)
    expect(leftIcon.attributes('data-icon')).toBe('add')
    expect(leftIcon.element.tagName.toLowerCase()).toBe('svg')
    expect(wrapper.text()).toContain('Create')
  })

  it('renders left and right icons from string names', () => {
    const cases = [
      { iconLeft: 'search', iconRight: 'check', label: 'Search' },
      { iconLeft: 'setting', iconRight: 'download', label: 'System settings' }
    ]

    for (const item of cases) {
      const wrapper = mount(U1Button, {
        props: item
      })

      expect(wrapper.find('.u1-button__icon.is-left .u1-icon').attributes('data-icon')).toBe(item.iconLeft)
      expect(wrapper.find('.u1-button__icon.is-right .u1-icon').attributes('data-icon')).toBe(item.iconRight)
    }
  })

  it('uses close icon when icon name is unknown', () => {
    const wrapper = mount(U1Button, {
      props: {
        icon: 'not-exists',
        label: 'Unknown'
      }
    })

    expect(wrapper.find('.u1-button__icon.is-left .u1-icon').attributes('data-icon')).toBe('close')
  })

  it('maps view icon to eye-open svg', () => {
    const wrapper = mount(U1Button, {
      props: {
        icon: 'view',
        label: 'View'
      }
    })

    expect(wrapper.find('.u1-button__icon.is-left .u1-icon').attributes('data-icon')).toBe('eye-open')
  })

  it('uses icon class as fallback when icon prop is empty', () => {
    const wrapper = mount(U1Button, {
      attrs: {
        class: 'icon-eye-open'
      },
      props: {
        label: 'View'
      }
    })

    expect(wrapper.classes()).toContain('icon-eye-open')
    expect(wrapper.find('.u1-button__icon.is-left .u1-icon').attributes('data-icon')).toBe('eye-open')
  })

  it('prefers icon slot over string icon props', () => {
    const wrapper = mount(U1Button, {
      props: {
        icon: 'add',
        label: 'Create'
      },
      slots: {
        icon: '<span class="demo-icon">slot</span>'
      }
    })

    expect(wrapper.find('.u1-button__icon .demo-icon').exists()).toBe(true)
    expect(wrapper.find('.u1-button__icon .u1-icon').exists()).toBe(false)
  })
})
