import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Tag } from '../tag'

describe('U1Tag', () => {
  it('renders tag content type and effect classes', () => {
    const wrapper = mount(U1Tag, {
      props: {
        type: 'success',
        effect: 'dark'
      },
      slots: {
        default: 'Done'
      }
    })

    expect(wrapper.text()).toContain('Done')
    expect(wrapper.classes()).toContain('u1-tag-component--success')
    expect(wrapper.classes()).toContain('u1-tag-component--dark')
  })

  it('emits close when close button is clicked', async () => {
    const wrapper = mount(U1Tag, {
      props: {
        closable: true
      },
      slots: {
        default: 'Closable'
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
