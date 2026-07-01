# Table 表格

用于展示结构化数据. 支持列配置, 数据源, 边框, 斑马纹, 尺寸, 加载状态, 空状态, 对齐, 溢出提示, 序号列, 操作列和自定义插槽.

<script setup>
const data = [
  {
    id: 'u1',
    name: 'Alice',
    role: 'Designer',
    city: '上海',
    status: '在线',
    description: '负责组件视觉规范和交互验收'
  },
  {
    id: 'u2',
    name: 'Bob',
    role: 'Developer',
    city: '北京',
    status: '忙碌',
    description: '维护基础组件代码和发布流程'
  },
  {
    id: 'u3',
    name: 'Carol',
    role: 'PM',
    city: '深圳',
    status: '离线',
    description: '跟进组件需求和文档质量'
  }
]

const basicColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'role', label: '角色' },
  { prop: 'city', label: '城市' }
]

const sizeColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'role', label: '角色', minWidth: 160 },
  { prop: 'status', label: '状态', width: 100 }
]

const alignColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'role', label: '角色', align: 'center', headerAlign: 'center', width: 140 },
  {
    prop: 'description',
    label: '说明',
    minWidth: 220,
    showOverflowTooltip: true
  }
]

const actionColumns = [
  { type: 'index', label: '#', width: 64, align: 'center', headerAlign: 'center' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'role', label: '角色', minWidth: 140 },
  { type: 'action', label: '操作', width: 150, align: 'center', headerAlign: 'center' }
]

const customColumns = [
  { prop: 'name', label: '成员', minWidth: 120 },
  { prop: 'status', label: '状态', width: 120, align: 'center', headerAlign: 'center' },
  { prop: 'description', label: '说明', minWidth: 220 }
]

function statusType(value) {
  if (value === '在线') {
    return 'success'
  }

  if (value === '忙碌') {
    return 'warning'
  }

  return 'info'
}
</script>

## 基础用法

使用 `columns` 描述列, 使用 `data` 提供行数据. 建议配置 `row-key`, 让行渲染保持稳定.

<div class="u1-demo">
  <div class="u1-demo__body">
    <U1Table :columns="basicColumns" :data="data" row-key="id" />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// columns: 列配置数组，{ prop: 字段名, label: 表头文字 }
// data: 表格数据源，row-key: 行唯一标识（必填，保证渲染稳定）
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'role', label: '角色' },
  { prop: 'city', label: '城市' }
]

const data = [
  { id: 'u1', name: 'Alice', role: 'Designer', city: '上海', status: '在线', description: '负责组件视觉规范和交互验收' },
  { id: 'u2', name: 'Bob', role: 'Developer', city: '北京', status: '忙碌', description: '维护基础组件代码和发布流程' },
  { id: 'u3', name: 'Carol', role: 'PM', city: '深圳', status: '离线', description: '跟进组件需求和文档质量' }
]
</script>

<template>
  <!-- columns: 列配置，data: 数据源，row-key: 行唯一标识 -->
  <U1Table :columns="columns" :data="data" row-key="id" />
</template>
```

  </details>
</div>

## 边框 斑马纹和尺寸

`border` 用于显示表格边框, `stripe` 用于显示斑马纹. `size` 支持 `small`, `default`, `large`, `mini`.

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-column">
      <U1Table :columns="sizeColumns" :data="data" row-key="id" border stripe size="mini" />
      <U1Table :columns="sizeColumns" :data="data" row-key="id" border stripe size="small" />
      <U1Table :columns="sizeColumns" :data="data" row-key="id" border size="large" />
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// border: 显示边框，stripe: 斑马纹，size: 表格尺寸(mini/small/default/large)
// width: 固定列宽，minWidth: 最小列宽
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'role', label: '角色', minWidth: 160 },
  { prop: 'status', label: '状态', width: 100 }
]

const data = [
  { id: 'u1', name: 'Alice', role: 'Designer', city: '上海', status: '在线', description: '负责组件视觉规范和交互验收' },
  { id: 'u2', name: 'Bob', role: 'Developer', city: '北京', status: '忙碌', description: '维护基础组件代码和发布流程' },
  { id: 'u3', name: 'Carol', role: 'PM', city: '深圳', status: '离线', description: '跟进组件需求和文档质量' }
]
</script>

<template>
  <div class="u1-demo-column">
    <!-- border: 边框，stripe: 斑马纹，size: 表格尺寸 -->
    <U1Table :columns="columns" :data="data" row-key="id" border stripe size="mini" />
    <U1Table :columns="columns" :data="data" row-key="id" border stripe size="small" />
    <U1Table :columns="columns" :data="data" row-key="id" border size="large" />
  </div>
</template>
```

  </details>
</div>

## Loading 和空状态

`loading` 会在表格上方显示加载层, `loading-text` 控制加载文案. 当 `data` 为空时会显示 `empty-text`.

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-column">
      <U1Table :columns="basicColumns" :data="data" row-key="id" loading loading-text="加载中" />
      <U1Table :columns="basicColumns" :data="[]" empty-text="暂无数据" />
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// loading: 加载状态，loading-text: 加载文案，empty-text: 空状态文案
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'role', label: '角色' },
  { prop: 'city', label: '城市' }
]

const data = [
  { id: 'u1', name: 'Alice', role: 'Designer', city: '上海', status: '在线', description: '负责组件视觉规范和交互验收' },
  { id: 'u2', name: 'Bob', role: 'Developer', city: '北京', status: '忙碌', description: '维护基础组件代码和发布流程' },
  { id: 'u3', name: 'Carol', role: 'PM', city: '深圳', status: '离线', description: '跟进组件需求和文档质量' }
]
</script>

<template>
  <div class="u1-demo-column">
    <!-- loading: 加载状态，empty-text: 空状态文案（data 为空时显示） -->
    <U1Table :columns="columns" :data="data" row-key="id" loading loading-text="加载中" />
    <U1Table :columns="columns" :data="[]" empty-text="暂无数据" />
  </div>
</template>
```

  </details>
</div>

## 溢出提示和对齐

列级 `align` 控制单元格对齐, `headerAlign` 控制表头对齐. `showOverflowTooltip` 可以配置在表格上, 也可以配置在单列上.

<div class="u1-demo">
  <div class="u1-demo__body">
    <U1Table :columns="alignColumns" :data="data" row-key="id" border />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// align: 单元格对齐(left/center/right)，headerAlign: 表头对齐，showOverflowTooltip: 溢出提示
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'role', label: '角色', align: 'center', headerAlign: 'center', width: 140 },
  {
    prop: 'description',
    label: '说明',
    minWidth: 220,
    showOverflowTooltip: true
  }
]

const data = [
  { id: 'u1', name: 'Alice', role: 'Designer', city: '上海', status: '在线', description: '负责组件视觉规范和交互验收' },
  { id: 'u2', name: 'Bob', role: 'Developer', city: '北京', status: '忙碌', description: '维护基础组件代码和发布流程' },
  { id: 'u3', name: 'Carol', role: 'PM', city: '深圳', status: '离线', description: '跟进组件需求和文档质量' }
]
</script>

<template>
  <!-- border: 边框，align: 单元格对齐，showOverflowTooltip: 溢出时显示 tooltip -->
  <U1Table :columns="columns" :data="data" row-key="id" border />
</template>
```

  </details>
</div>

## 序号列和操作列

列的 `type` 设置为 `index` 时显示从 1 开始的序号. 设置为 `action` 时会渲染 `action` 插槽, 插槽参数包含 `row` 和 `index`.

<div class="u1-demo">
  <div class="u1-demo__body">
    <U1Table :columns="actionColumns" :data="data" row-key="id" border>
      <template #action="{ row, index }">
        <U1Button size="small" link type="primary">编辑 {{ index + 1 }}</U1Button>
        <U1Button size="small" link type="danger">删除</U1Button>
      </template>
    </U1Table>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// type: 'index' 序号列，type: 'action' 操作列（渲染 #action 插槽）
const columns = [
  { type: 'index', label: '#', width: 64, align: 'center', headerAlign: 'center' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'role', label: '角色', minWidth: 140 },
  { type: 'action', label: '操作', width: 150, align: 'center', headerAlign: 'center' }
]

const data = [
  { id: 'u1', name: 'Alice', role: 'Designer', city: '上海', status: '在线', description: '负责组件视觉规范和交互验收' },
  { id: 'u2', name: 'Bob', role: 'Developer', city: '北京', status: '忙碌', description: '维护基础组件代码和发布流程' },
  { id: 'u3', name: 'Carol', role: 'PM', city: '深圳', status: '离线', description: '跟进组件需求和文档质量' }
]
</script>

<template>
  <!-- type: 'index' 序号列，type: 'action' 操作列（需要 #action 插槽） -->
  <U1Table :columns="columns" :data="data" row-key="id" border>
    <template #action="{ index }">
      <U1Button size="small" link type="primary">编辑 {{ index + 1 }}</U1Button>
      <U1Button size="small" link type="danger">删除</U1Button>
    </template>
  </U1Table>
</template>
```

  </details>
</div>

## 自定义表头和单元格

使用 `header-{prop}` 自定义表头, 使用 `cell-{prop}` 自定义单元格. `cell-{prop}` 会接收 `row`, `column`, `index`, `value`.

<div class="u1-demo">
  <div class="u1-demo__body">
    <U1Table :columns="customColumns" :data="data" row-key="id" border>
      <template #header-status="{ column }">
        <span>{{ column.label }} / 当前</span>
      </template>
      <template #cell-status="{ value }">
        <U1Tag :type="statusType(value)">
          {{ value }}
        </U1Tag>
      </template>
      <template #cell-description="{ row, index }">
        <span>{{ index + 1 }}. {{ row.description }}</span>
      </template>
    </U1Table>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// #header-{prop}: 自定义表头插槽，#cell-{prop}: 自定义单元格插槽
// { value }: 单元格值，{ row, index }: 行数据和行索引
const columns = [
  { prop: 'name', label: '成员', minWidth: 120 },
  { prop: 'status', label: '状态', width: 120, align: 'center', headerAlign: 'center' },
  { prop: 'description', label: '说明', minWidth: 220 }
]

const data = [
  { id: 'u1', name: 'Alice', role: 'Designer', city: '上海', status: '在线', description: '负责组件视觉规范和交互验收' },
  { id: 'u2', name: 'Bob', role: 'Developer', city: '北京', status: '忙碌', description: '维护基础组件代码和发布流程' },
  { id: 'u3', name: 'Carol', role: 'PM', city: '深圳', status: '离线', description: '跟进组件需求和文档质量' }
]

function statusType(value) {
  if (value === '在线') return 'success'
  if (value === '忙碌') return 'warning'
  return 'info'
}
</script>

<template>
  <!-- #header-{prop}: 自定义表头，#cell-{prop}: 自定义单元格 -->
  <U1Table :columns="columns" :data="data" row-key="id" border>
    <template #header-status="{ column }">
      <span>{{ column.label }} / 当前</span>
    </template>
    <template #cell-status="{ value }">
      <U1Tag :type="statusType(value)">
        {{ value }}
      </U1Tag>
    </template>
    <template #cell-description="{ row, index }">
      <span>{{ index + 1 }}. {{ row.description }}</span>
    </template>
  </U1Table>
</template>
```

  </details>
</div>

## API 表

### Props

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>data</td><td>表格数据源</td><td>Record&lt;string, unknown&gt;[]</td><td>[]</td></tr>
    <tr><td>columns</td><td>列配置</td><td>U1TableColumn[]</td><td>[]</td></tr>
    <tr><td>border</td><td>是否显示边框</td><td>boolean</td><td>false</td></tr>
    <tr><td>stripe</td><td>是否显示斑马纹</td><td>boolean</td><td>false</td></tr>
    <tr><td>size</td><td>表格尺寸</td><td>large | default | small | mini</td><td>default</td></tr>
    <tr><td>loading</td><td>是否显示加载状态</td><td>boolean</td><td>false</td></tr>
    <tr><td>loadingText</td><td>加载状态文案</td><td>string</td><td>Loading</td></tr>
    <tr><td>emptyText</td><td>空状态文案</td><td>string</td><td>No data</td></tr>
    <tr><td>rowKey</td><td>稳定行 key, 支持字段名或函数</td><td>string | (row, index) =&gt; string | number</td><td>-</td></tr>
    <tr><td>showOverflowTooltip</td><td>是否为所有普通列启用溢出提示</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

### Column

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>prop</td><td>字段名, 用于读取行数据和生成插槽名称</td><td>string</td><td>-</td></tr>
    <tr><td>label</td><td>表头文本</td><td>string</td><td>-</td></tr>
    <tr><td>width</td><td>列宽, 数字会转换为 px</td><td>string | number</td><td>-</td></tr>
    <tr><td>minWidth</td><td>最小列宽, 数字会转换为 px</td><td>string | number</td><td>-</td></tr>
    <tr><td>align</td><td>单元格对齐方式</td><td>left | center | right</td><td>left</td></tr>
    <tr><td>headerAlign</td><td>表头对齐方式, 未设置时跟随 align</td><td>left | center | right</td><td>-</td></tr>
    <tr><td>showOverflowTooltip</td><td>是否为当前列启用溢出提示</td><td>boolean</td><td>false</td></tr>
    <tr><td>type</td><td>列类型</td><td>default | index | action</td><td>default</td></tr>
  </tbody>
</table>

### Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>header-{prop}</td><td>自定义指定列的表头内容</td><td>{ column, index }</td></tr>
    <tr><td>cell-{prop}</td><td>自定义指定列的单元格内容</td><td>{ row, column, index, value }</td></tr>
    <tr><td>action</td><td>自定义 action 列的操作内容</td><td>{ row, index }</td></tr>
  </tbody>
</table>
