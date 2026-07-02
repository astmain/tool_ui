# Textarea 多行文本框

用于接收多行文本, 支持 `v-model`, placeholder, 禁用, 行数, 字数限制, 自适应高度和 change 事件.

<script setup>
import { ref } from 'vue'

const basicValue = ref('')
const limitValue = ref('u1design')
</script>

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Textarea v-model="basicValue" placeholder="请输入内容" :rows="3" />
    <span>当前值: {{ basicValue || '空' }}</span>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

// basicValue: 文本框绑定的值
const basicValue = ref('')
</script>

<template>
  <!-- v-model: 双向绑定，placeholder: 占位提示文字，rows: 可见行数 -->
  <U1Textarea v-model="basicValue" placeholder="请输入内容" :rows="3" />
  <span>当前值: {{ basicValue || '空' }}</span>
</template>
```

  </details>
</div>

## 字数限制与状态

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Textarea v-model="limitValue" :maxlength="50" show-word-limit :rows="3" />
    <U1Textarea model-value="Disabled" disabled :rows="3" />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

// limitValue: 带字数限制的绑定值
const limitValue = ref('u1design')
</script>

<template>
  <!-- maxlength: 最大字数，show-word-limit: 显示字数统计，disabled: 禁用状态 -->
  <U1Textarea v-model="limitValue" :maxlength="50" show-word-limit :rows="3" />
  <U1Textarea model-value="Disabled" disabled :rows="3" />
</template>
```

  </details>
</div>

## 高度自适应

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Textarea v-model="basicValue" placeholder="输入内容会自动撑高" autosize />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <!-- autosize: 根据内容自动调整高度 -->
  <U1Textarea v-model="basicValue" placeholder="输入内容会自动撑高" autosize />
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定值</td><td>string</td><td>空字符串</td></tr>
    <tr><td>placeholder</td><td>占位文本</td><td>string</td><td>空字符串</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
    <tr><td>rows</td><td>可见文本行数</td><td>number</td><td>2</td></tr>
    <tr><td>maxlength</td><td>最大输入字数</td><td>number</td><td>-</td></tr>
    <tr><td>showWordLimit</td><td>是否显示字数统计, 需配合 maxlength</td><td>boolean</td><td>false</td></tr>
    <tr><td>resize</td><td>缩放方向</td><td>none | both | horizontal | vertical</td><td>vertical</td></tr>
    <tr><td>autosize</td><td>是否根据内容自适应高度</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>update:modelValue</td><td>输入值变更</td><td>value</td></tr>
    <tr><td>change</td><td>原生 change 时提交当前值</td><td>value</td></tr>
    <tr><td>focus</td><td>获得焦点</td><td>event</td></tr>
    <tr><td>blur</td><td>失去焦点</td><td>event</td></tr>
  </tbody>
</table>
