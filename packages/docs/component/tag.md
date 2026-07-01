# Tag 标签

用于标记和分类信息. 支持类型, 主题和关闭按钮. 点击关闭按钮后会隐藏当前标签, 同时触发 close 事件.

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Tag>Primary</U1Tag>
    <U1Tag type="success">Success</U1Tag>
    <U1Tag type="warning">Warning</U1Tag>
    <U1Tag type="danger">Danger</U1Tag>
    <U1Tag type="info">Info</U1Tag>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// type: 标签类型 (primary/success/warning/danger/info)
</script>

<template>
  <!-- type: 标签类型 -->
  <U1Tag>Primary</U1Tag>
  <U1Tag type="success">Success</U1Tag>
  <U1Tag type="warning">Warning</U1Tag>
  <U1Tag type="danger">Danger</U1Tag>
  <U1Tag type="info">Info</U1Tag>
</template>
```

  </details>
</div>

## 主题和关闭

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Tag effect="dark">Dark</U1Tag>
    <U1Tag effect="plain">Plain</U1Tag>
    <U1Tag closable>Closable, click x</U1Tag>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// effect: 主题样式 (light 浅色/dark 深色/plain 朴素)，closable: 是否显示关闭按钮
</script>

<template>
  <!-- effect: 主题样式 -->
  <U1Tag effect="dark">Dark</U1Tag>
  <U1Tag effect="plain">Plain</U1Tag>

  <!-- closable: 显示关闭按钮，点击后触发 close 事件并隐藏 -->
  <U1Tag closable>Closable, click x</U1Tag>
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>type</td><td>类型</td><td>primary | success | warning | danger | info</td><td>primary</td></tr>
    <tr><td>effect</td><td>主题</td><td>light | dark | plain</td><td>light</td></tr>
    <tr><td>closable</td><td>是否可关闭</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>close</td><td>关闭按钮点击后触发, 组件会同步隐藏</td><td>-</td></tr>
  </tbody>
</table>
