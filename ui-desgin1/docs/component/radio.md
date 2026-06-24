# Radio 单选框

用于在多个备选项中选择单个值, 支持独立使用和分组使用.

<script setup>
import { ref } from 'vue'

const city = ref('shanghai')
</script>

## 单选组

<div class="u1-demo">
  <U1RadioGroup v-model="city">
    <U1Radio label="shanghai">上海</U1Radio>
    <U1Radio label="beijing">北京</U1Radio>
    <U1Radio label="shenzhen">深圳</U1Radio>
  </U1RadioGroup>
  <span>当前值: {{ city }}</span>
</div>

## 禁用状态

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Radio model-value="a" label="a" disabled>禁用已选</U1Radio>
    <U1Radio model-value="a" label="b" disabled>禁用未选</U1Radio>
  </div>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定值</td><td>string | number | boolean</td><td>无</td></tr>
    <tr><td>label</td><td>单选框取值</td><td>string | number | boolean</td><td>无</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

