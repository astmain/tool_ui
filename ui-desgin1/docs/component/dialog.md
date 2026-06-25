# Dialog 对话框

用于在当前页面上展示临时内容. 支持 `v-model`, 标题, 宽度, 顶部偏移, 默认可拖拽, 遮罩关闭控制, 默认插槽和基础可访问性语义.

<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

## 基础用法

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button type="primary" @click="visible = true">打开完整功能对话框</U1Button>
    </div>
  </div>
  <U1Dialog
    v-model="visible"
    title="完整功能"
    width="460px"
    top="48px"
    :show-close="true"
    :lock-scroll="true"
    :draggable="true"
    :close-on-click-modal="false"
    @close="visible = false"
  >
    <template #header>
      <span>完整功能对话框</span>
    </template>
    这个示例集中展示固定宽度, 顶部偏移, 默认拖拽, 锁定滚动, 禁止点击遮罩关闭, 自定义头部和关闭事件.
    <div class="u1-demo-actions">
      <U1Button @click="visible = false">取消</U1Button>
      <U1Button type="primary" @click="visible = false">确认</U1Button>
    </div>
  </U1Dialog>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <div class="u1-demo-row">
    <U1Button type="primary" @click="visible = true">打开完整功能对话框</U1Button>
  </div>

  <U1Dialog
    v-model="visible"
    title="完整功能"
    width="460px"
    top="48px"
    :show-close="true"
    :lock-scroll="true"
    :draggable="true"
    :close-on-click-modal="false"
    @close="visible = false"
  >
    <template #header>
      <span>完整功能对话框</span>
    </template>
    这个示例集中展示固定宽度, 顶部偏移, 默认拖拽, 锁定滚动, 禁止点击遮罩关闭, 自定义头部和关闭事件.
    <div class="u1-demo-actions">
      <U1Button @click="visible = false">取消</U1Button>
      <U1Button type="primary" @click="visible = false">确认</U1Button>
    </div>
  </U1Dialog>
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>是否显示</td><td>boolean</td><td>false</td></tr>
    <tr><td>title</td><td>标题, 同时用于 dialog 的 aria-label</td><td>string</td><td>空字符串</td></tr>
    <tr><td>width</td><td>宽度</td><td>string</td><td>50%</td></tr>
    <tr><td>top</td><td>距离视口顶部的偏移</td><td>string | number</td><td>15vh</td></tr>
    <tr><td>showClose</td><td>是否展示关闭按钮</td><td>boolean</td><td>true</td></tr>
    <tr><td>lockScroll</td><td>打开时是否锁定背景滚动</td><td>boolean</td><td>true</td></tr>
    <tr><td>draggable</td><td>是否允许拖拽头部移动对话框</td><td>boolean</td><td>true</td></tr>
    <tr><td>closeOnClickModal</td><td>点击遮罩是否关闭</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>update:modelValue</td><td>显示状态变更</td><td>boolean</td></tr>
    <tr><td>close</td><td>关闭按钮, 遮罩或 Escape 触发关闭</td><td>-</td></tr>
  </tbody>
</table>

## Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>default</td><td>对话框主体内容</td></tr>
    <tr><td>header</td><td>自定义头部</td></tr>
  </tbody>
</table>
