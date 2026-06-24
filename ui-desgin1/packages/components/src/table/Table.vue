<template>
  <div class="u1-table" :class="{ 'is-border': border, 'is-stripe': stripe }">
    <table class="u1-table__inner">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.prop" class="u1-table__cell">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length">
        <tr v-for="(row, rowIndex) in data" :key="getRowKey(row, rowIndex)">
          <td v-for="column in columns" :key="column.prop" class="u1-table__cell">
            {{ row[column.prop] }}
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="u1-table__empty" :colspan="columns.length || 1">{{ emptyText }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface U1TableColumn {
  prop: string
  label: string
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
    emptyText?: string
    rowKey?: U1TableRowKey
  }>(),
  {
    border: false,
    stripe: false,
    emptyText: 'No data'
  }
)

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
</script>
