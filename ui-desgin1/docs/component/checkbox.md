# Checkbox 多选框

用于在一组选项中选择多个值. 支持单独使用, 多选框组, 禁用和半选状态.

<script setup>
import { ref } from 'vue'

const checked = ref(false)
const cities = ref(['shanghai'])
</script>

<div class="u1-demo">
  <p class="u1-demo-title">基础用法</p>
  <div class="u1-demo-row">
    <U1Checkbox v-model="checked">同意协议</U1Checkbox>
    <span>当前值: {{ checked }}</span>
  </div>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">多选框组</p>
  <div class="u1-demo-row">
    <U1CheckboxGroup v-model="cities">
      <U1Checkbox label="shanghai">上海</U1Checkbox>
      <U1Checkbox label="beijing">北京</U1Checkbox>
      <U1Checkbox label="shenzhen">深圳</U1Checkbox>
    </U1CheckboxGroup>
  </div>
  <div class="u1-demo-row">
    <span>已选择: {{ cities.join(', ') || '空' }}</span>
  </div>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">状态</p>
  <div class="u1-demo-row">
    <U1Checkbox model-value disabled>禁用</U1Checkbox>
    <U1Checkbox indeterminate>半选</U1Checkbox>
  </div>
</div>

## Checkbox API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定值</td><td>string | number | boolean</td><td>false</td></tr>
    <tr><td>label</td><td>在 group 内使用的选项值</td><td>string | number | boolean</td><td>空字符串</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
    <tr><td>indeterminate</td><td>是否半选</td><td>boolean</td><td>false</td></tr>
    <tr><td>trueValue</td><td>选中时的值</td><td>string | number | boolean</td><td>true</td></tr>
    <tr><td>falseValue</td><td>未选中时的值</td><td>string | number | boolean</td><td>false</td></tr>
  </tbody>
</table>

## CheckboxGroup API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定数组</td><td>Array</td><td>[]</td></tr>
    <tr><td>disabled</td><td>是否禁用组内选项</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>
