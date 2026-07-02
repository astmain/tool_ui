import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Table } from './index'

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

  it('applies column width min width and alignment options', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns: [
          { prop: 'name', label: 'Name', width: 120, align: 'center', headerAlign: 'right' },
          { prop: 'role', label: 'Role', minWidth: '180px', align: 'right' }
        ],
        data: [{ name: 'Alice', role: 'Admin' }]
      }
    })

    const headers = wrapper.findAll('thead th')
    const cells = wrapper.findAll('tbody td')

    expect(headers[0].attributes('style')).toContain('width: 120px')
    expect(headers[0].classes()).toContain('is-right')
    expect(headers[1].attributes('style')).toContain('min-width: 180px')
    expect(cells[0].classes()).toContain('is-center')
    expect(cells[1].classes()).toContain('is-right')
  })

  it('supports size class and loading state', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns,
        data: [{ name: 'Alice', age: 18 }],
        size: 'small',
        loading: true
      }
    })

    expect(wrapper.classes()).toContain('u1-table--small')
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.find('.u1-table__loading').text()).toBe('Loading')
  })

  it('supports the mini size class', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns,
        data: [{ name: 'Alice', age: 18 }],
        size: 'mini'
      }
    })

    expect(wrapper.classes()).toContain('u1-table--mini')
  })

  it('marks overflowing columns with a title tooltip', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns: [{ prop: 'description', label: 'Description', showOverflowTooltip: true }],
        data: [{ description: 'Long cell content' }]
      }
    })

    const cell = wrapper.find('tbody td')

    expect(cell.classes()).toContain('is-overflow')
    expect(cell.attributes('title')).toBe('Long cell content')
  })

  it('renders index and action columns', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns: [
          { type: 'index', label: '#', width: 60 },
          { prop: 'name', label: 'Name' },
          { type: 'action', label: 'Action' }
        ],
        data: [{ name: 'Alice' }]
      },
      slots: {
        action: '<button class="edit">Edit</button>'
      }
    })

    expect(wrapper.find('tbody td').text()).toBe('1')
    expect(wrapper.find('.u1-table__actions .edit').exists()).toBe(true)
  })

  it('renders custom cell and header slots', () => {
    const wrapper = mount(U1Table, {
      props: {
        columns: [{ prop: 'name', label: 'Name' }],
        data: [{ name: 'Alice' }]
      },
      slots: {
        'header-name': '<strong class="custom-header">Custom Name</strong>',
        'cell-name': '<template #default="{ row }"><span class="custom-cell">{{ row.name }} user</span></template>'
      }
    })

    expect(wrapper.find('.custom-header').text()).toBe('Custom Name')
    expect(wrapper.find('.custom-cell').text()).toBe('Alice user')
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
