# InputLabel 输入标签

用于展示标签和单行输入框, 支持 `v-model`, 标签宽度, 标签对齐, 输入框宽度, 禁用, 只读, 数字过滤和明文切换.

<script setup>
import { ref } from 'vue'

const textValue = ref('')
const numberValue = ref('')
const secretValue = ref('u1design')
</script>

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1InputLabel v-model="textValue" label="名称" placeholder="请输入名称" />
    <span>当前值: {{ textValue || '空' }}</span>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const textValue = ref('')
</script>

<template>
  <U1InputLabel v-model="textValue" label="名称" placeholder="请输入名称" />
</template>
```

  </details>
</div>

## 宽度和对齐

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1InputLabel
      v-model="textValue"
      label="用户名称"
      label-width="100px"
      label-position="left"
      input-width="280px"
      placeholder="左对齐标签"
    />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1InputLabel
    v-model="textValue"
    label="用户名称"
    label-width="100px"
    label-position="left"
    input-width="280px"
    placeholder="左对齐标签"
  />
</template>
```

  </details>
</div>

## 数字过滤

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1InputLabel v-model="numberValue" label="数量" type="number" placeholder="只记录数字" />
    <span>当前值: {{ numberValue || '空' }}</span>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const numberValue = ref('')
</script>

<template>
  <U1InputLabel v-model="numberValue" label="数量" type="number" placeholder="只记录数字" />
</template>
```

  </details>
</div>

## 明文切换和状态

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1InputLabel v-model="secretValue" label="密钥" show />
    <U1InputLabel model-value="Readonly" label="只读" readonly />
    <U1InputLabel model-value="Disabled" label="禁用" disabled />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const secretValue = ref('u1design')
</script>

<template>
  <U1InputLabel v-model="secretValue" label="密钥" show />
  <U1InputLabel model-value="Readonly" label="只读" readonly />
  <U1InputLabel model-value="Disabled" label="禁用" disabled />
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定值</td><td>string | number</td><td>空字符串</td></tr>
    <tr><td>label</td><td>标签文本</td><td>string</td><td>空字符串</td></tr>
    <tr><td>labelWidth</td><td>标签宽度</td><td>string | number</td><td>80px</td></tr>
    <tr><td>labelPosition</td><td>标签文本对齐</td><td>left | right</td><td>right</td></tr>
    <tr><td>inputWidth</td><td>输入框宽度</td><td>string | number</td><td>220px</td></tr>
    <tr><td>placeholder</td><td>占位文本</td><td>string</td><td>空字符串</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
    <tr><td>readonly</td><td>是否只读</td><td>boolean</td><td>false</td></tr>
    <tr><td>type</td><td>text 接收任意内容, number 只记录数字</td><td>text | number</td><td>text</td></tr>
    <tr><td>show</td><td>是否启用明文切换按钮</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>update:modelValue</td><td>输入值变更</td><td>value</td></tr>
    <tr><td>change</td><td>原生 change 时提交当前值</td><td>value</td></tr>
  </tbody>
</table>
