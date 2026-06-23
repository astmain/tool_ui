# Table 表格

用于展示结构化数据. 支持列配置, 数据源, 边框, 斑马纹和空状态.

<script setup>
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'role', label: '角色' },
  { prop: 'city', label: '城市' }
]

const data = [
  { name: 'Alice', role: 'Designer', city: '上海' },
  { name: 'Bob', role: 'Developer', city: '北京' },
  { name: 'Carol', role: 'PM', city: '深圳' }
]
</script>

<div class="u1-demo">
  <p class="u1-demo-title">基础表格</p>
  <U1Table :columns="columns" :data="data" />
</div>

<div class="u1-demo">
  <p class="u1-demo-title">边框和斑马纹</p>
  <U1Table :columns="columns" :data="data" border stripe />
</div>

<div class="u1-demo">
  <p class="u1-demo-title">空状态</p>
  <U1Table :columns="columns" :data="[]" empty-text="暂无数据" />
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>columns</td><td>列配置</td><td>Array</td><td>[]</td></tr>
    <tr><td>data</td><td>数据源</td><td>Array</td><td>[]</td></tr>
    <tr><td>border</td><td>是否显示边框</td><td>boolean</td><td>false</td></tr>
    <tr><td>stripe</td><td>是否显示斑马纹</td><td>boolean</td><td>false</td></tr>
    <tr><td>emptyText</td><td>空状态文案</td><td>string</td><td>No data</td></tr>
  </tbody>
</table>
