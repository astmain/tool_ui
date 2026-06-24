# Select 选择器

用于从一组预设选项中选择一个值. 支持 `v-model`, placeholder 和禁用状态.

<script setup>
import { ref } from 'vue'

const city = ref('')
const options = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' }
]
</script>

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Select v-model="city" :options="options" placeholder="请选择城市" />
    <span>当前值: {{ city || '空' }}</span>
  </div>
</div>

## 禁用状态

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Select model-value="shanghai" :options="options" disabled />
  </div>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定值</td><td>string | number</td><td>空</td></tr>
    <tr><td>options</td><td>选项列表</td><td>Array</td><td>[]</td></tr>
    <tr><td>placeholder</td><td>占位文本</td><td>string</td><td>空字符串</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>
