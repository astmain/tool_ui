# Table 表格

用于展示结构化数据. 支持列配置, 数据源, 边框, 斑马纹, 空状态和稳定行 key.

<script setup>
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'role', label: '角色' },
  { prop: 'city', label: '城市' }
]

const data = [
  { id: 'u1', name: 'Alice', role: 'Designer', city: '上海' },
  { id: 'u2', name: 'Bob', role: 'Developer', city: '北京' },
  { id: 'u3', name: 'Carol', role: 'PM', city: '深圳' }
]
</script>

## 基础表格

<div class="u1-demo">
  <U1Table :columns="columns" :data="data" row-key="id" />
</div>

## 边框和斑马纹

<div class="u1-demo">
  <U1Table :columns="columns" :data="data" row-key="id" border stripe />
</div>

## 空状态

<div class="u1-demo">
  <U1Table :columns="columns" :data="[]" empty-text="暂无数据" />
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>columns</td><td>列配置</td><td>U1TableColumn[]</td><td>[]</td></tr>
    <tr><td>data</td><td>数据源</td><td>Record[]</td><td>[]</td></tr>
    <tr><td>border</td><td>是否显示边框</td><td>boolean</td><td>false</td></tr>
    <tr><td>stripe</td><td>是否显示斑马纹</td><td>boolean</td><td>false</td></tr>
    <tr><td>emptyText</td><td>空状态文案</td><td>string</td><td>No data</td></tr>
    <tr><td>rowKey</td><td>稳定行 key, 支持字段名或函数</td><td>string | function</td><td>-</td></tr>
  </tbody>
</table>
