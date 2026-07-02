import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Affix } from './index'

describe('U1Affix', () => {
  it('renders default slot content', () => {
    const wrapper = mount(U1Affix, {
      slots: {
        default: '<div class="demo-card">Affix content</div>'
      }
    })

    expect(wrapper.classes()).toContain('u1-affix')
    expect(wrapper.find('.demo-card').exists()).toBe(true)
    expect(wrapper.text()).toContain('Affix content')
  })

  it('uses sticky top styles by default', () => {
    const wrapper = mount(U1Affix, {
      slots: {
        default: 'Sticky'
      }
    })

    expect(wrapper.attributes('style')).toContain('position: sticky;')
    expect(wrapper.attributes('style')).toContain('top: 0px;')
    expect(wrapper.attributes('style')).toContain('z-index: 100;')
  })

  it('supports bottom affix with custom offset and z-index', () => {
    const wrapper = mount(U1Affix, {
      props: {
        position: 'bottom',
        offset: 16,
        zIndex: 240
      },
      slots: {
        default: 'Bottom'
      }
    })

    expect(wrapper.attributes('style')).toContain('bottom: 16px;')
    expect(wrapper.attributes('style')).toContain('z-index: 240;')
    expect(wrapper.attributes('style')).not.toContain('top:')
  })

  it('disables sticky positioning when disabled', () => {
    const wrapper = mount(U1Affix, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled'
      }
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('style')).toBeUndefined()
  })
})
