import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Table } from '../table'

describe('U1Table', () => {
  const columns = [
    { prop: 'name', label: 'Name' },
    { prop: 'age', label: 'Age' }
  ]

  it('renders table columns and rows', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns,
        data: [
          { name: 'Alice', age: 18 },
          { name: 'Bob', age: 20 }
        ]
      }
    })

    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
  })

  it('renders empty text when data is empty', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns,
        data: [],
        emptyText: 'No rows'
      }
    })

    expect(wrapper.text()).toContain('No rows')
  })

  it('supports border and stripe classes', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns,
        data: [{ name: 'Alice', age: 18 }],
        border: true,
        stripe: true
      }
    })

    expect(wrapper.classes()).toContain('is-border')
    expect(wrapper.classes()).toContain('is-stripe')
  })

  it('accepts rowKey for stable body rows', () => {
    const wrapper = mount(U1Table, {
      props: {
        rowKey: 'id',
        columns: [{ prop: 'name', label: 'Name' }],
        data: [
          { id: 'a', name: 'Alice' },
          { id: 'b', name: 'Bob' }
        ]
      }
    })

    expect(wrapper.props('rowKey')).toBe('id')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
  })
})
