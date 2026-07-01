# Input 输入框

用于接收单行文本, 支持 `v-model`, placeholder, 禁用, 清空, change 事件和密码显示切换.

<script setup>
import { ref } from 'vue'

const basicValue = ref('')
const passwordValue = ref('u1design')
</script>

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Input v-model="basicValue" placeholder="请输入内容" clearable />
    <span>当前值: {{ basicValue || '空' }}</span>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

// basicValue: 输入框绑定的值
const basicValue = ref('')
</script>

<template>
  <!-- v-model: 双向绑定，placeholder: 占位提示文字，clearable: 显示清空按钮 -->
  <U1Input v-model="basicValue" placeholder="请输入内容" clearable />
  <span>当前值: {{ basicValue || '空' }}</span>
</template>
```

  </details>
</div>

## 状态

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Input v-model="passwordValue" show-password clearable />
    <U1Input model-value="Disabled" disabled />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

// passwordValue: 密码框绑定的值
const passwordValue = ref('u1design')
</script>

<template>
  <!-- show-password: 显示密码切换按钮，clearable: 显示清空按钮，disabled: 禁用状态 -->
  <U1Input v-model="passwordValue" show-password clearable />
  <U1Input model-value="Disabled" disabled />
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
    <tr><td>clearable</td><td>是否可清空</td><td>boolean</td><td>false</td></tr>
    <tr><td>showPassword</td><td>是否密码输入, 并显示密码切换按钮</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>update:modelValue</td><td>输入值变更</td><td>value</td></tr>
    <tr><td>change</td><td>原生 change 时提交当前值</td><td>value</td></tr>
    <tr><td>clear</td><td>点击清空按钮</td><td>-</td></tr>
  </tbody>
</table>
