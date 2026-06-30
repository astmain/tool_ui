<template>
  <div class="u1-table" :class="tableClasses">
    <div class="u1-table__wrapper">
      <table class="u1-table__inner">
        <thead>
          <tr>
            <th
              v-for="(column, columnIndex) in normalizedColumns"
              :key="getColumnKey(column, columnIndex)"
              class="u1-table__cell"
              :class="getHeaderCellClasses(column)"
              :style="getColumnStyle(column)"
            >
              <div class="u1-table__cell-content">
                <slot
                  v-if="column.prop"
                  :name="`header-${column.prop}`"
                  :column="column"
                  :index="columnIndex"
                >
                  {{ column.label }}
                </slot>
                <template v-else>{{ column.label }}</template>
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="data.length">
          <tr v-for="(row, rowIndex) in data" :key="getRowKey(row, rowIndex)">
            <td
              v-for="(column, columnIndex) in normalizedColumns"
              :key="getColumnKey(column, columnIndex)"
              class="u1-table__cell"
              :class="getBodyCellClasses(column)"
              :style="getColumnStyle(column)"
              :title="getCellTitle(row, column)"
            >
              <div class="u1-table__cell-content">
                <template v-if="column.type === 'index'">{{ rowIndex + 1 }}</template>
                <div v-else-if="column.type === 'action'" class="u1-table__actions">
                  <slot name="action" :row="row" :index="rowIndex" />
                </div>
                <slot
                  v-else-if="column.prop"
                  :name="`cell-${column.prop}`"
                  :row="row"
                  :column="column"
                  :index="rowIndex"
                  :value="getCellValue(row, column)"
                >
                  {{ getCellValue(row, column) }}
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="u1-table__empty" :colspan="normalizedColumns.length || 1">{{ emptyText }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="loading" class="u1-table__loading">{{ loadingText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type U1TableAlign = 'left' | 'center' | 'right'
type U1TableColumnType = 'default' | 'index' | 'action'
type U1TableSize = 'large' | 'default' | 'small' | 'mini'

export interface U1TableColumn {
  prop?: string
  label: string
  type?: U1TableColumnType
  width?: string | number
  minWidth?: string | number
  align?: U1TableAlign
  headerAlign?: U1TableAlign
  showOverflowTooltip?: boolean
}

type U1TableRowKey = string | ((row: Record<string, unknown>, index: number) => string | number)

defineOptions({
  name: 'U1Table'
})

const props = withDefaults(
  defineProps<{
    columns: U1TableColumn[]
    data: Array<Record<string, unknown>>
    border?: boolean
    stripe?: boolean
    loading?: boolean
    loadingText?: string
    emptyText?: string
    rowKey?: U1TableRowKey
    size?: U1TableSize
    showOverflowTooltip?: boolean
  }>(),
  {
    border: false,
    stripe: false,
    loading: false,
    loadingText: 'Loading',
    emptyText: 'No data',
    size: 'default',
    showOverflowTooltip: false
  }
)

const normalizedColumns = computed(() =>
  props.columns.map((column) => ({
    type: 'default' as U1TableColumnType,
    ...column
  }))
)

const tableClasses = computed(() => [
  `u1-table--${props.size}`,
  {
    'is-border': props.border,
    'is-stripe': props.stripe,
    'is-loading': props.loading
  }
])

function getRowKey(row: Record<string, unknown>, index: number) {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }

  if (props.rowKey) {
    const value = row[props.rowKey]
    return typeof value === 'string' || typeof value === 'number' ? value : index
  }

  return index
}

function getColumnKey(column: U1TableColumn, index: number) {
  return column.prop || `${column.type}-${index}`
}

function formatSize(value?: string | number) {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

function getColumnStyle(column: U1TableColumn) {
  return {
    width: formatSize(column.width),
    minWidth: formatSize(column.minWidth)
  }
}

function getAlignClass(align?: U1TableAlign) {
  return align ? `is-${align}` : 'is-left'
}

function getHeaderCellClasses(column: U1TableColumn) {
  return [getAlignClass(column.headerAlign || column.align)]
}

function getBodyCellClasses(column: U1TableColumn) {
  return [
    getAlignClass(column.align),
    {
      'is-overflow': column.showOverflowTooltip || props.showOverflowTooltip
    }
  ]
}

function getCellValue(row: Record<string, unknown>, column: U1TableColumn) {
  if (!column.prop) {
    return ''
  }

  const value = row[column.prop]
  return value === null || value === undefined ? '' : String(value)
}

function getCellTitle(row: Record<string, unknown>, column: U1TableColumn) {
  if (!column.showOverflowTooltip && !props.showOverflowTooltip) {
    return undefined
  }

  return getCellValue(row, column)
}
</script>
