# Card 卡片

用于承载一组信息, 支持头部, 主体和阴影模式.

## 基础卡片

<div class="u1-demo">
  <div class="u1-demo__body">
    <U1Card style="max-width: 360px">
      <template #header>卡片标题</template>
      U1Card 用于展示成组内容, 适合文档示例, 信息摘要和操作区域.
    </U1Card>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// U1Card: 卡片组件，#header: 卡片头部插槽，shadow: 阴影显示时机(always/hover/never)
</script>

<template>
  <!-- #header: 卡片头部插槽，style: 卡片最大宽度 -->
  <U1Card style="max-width: 360px">
    <template #header>卡片标题</template>
    U1Card 用于展示成组内容, 适合文档示例, 信息摘要和操作区域.
  </U1Card>
</template>
```

  </details>
</div>

## 阴影模式

<div class="u1-demo">
  <div class="u1-card-grid">
    <U1Card shadow="always" style="width: 220px">Always</U1Card>
    <U1Card shadow="hover" style="width: 220px">Hover</U1Card>
    <U1Card shadow="never" style="width: 220px">Never</U1Card>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
// shadow: 阴影显示时机 (always 常驻/hover 悬停时/never 无阴影)
</script>

<template>
  <!-- shadow: 阴影显示时机 -->
  <U1Card shadow="always" style="width: 220px">Always</U1Card>
  <U1Card shadow="hover" style="width: 220px">Hover</U1Card>
  <U1Card shadow="never" style="width: 220px">Never</U1Card>
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>shadow</td><td>阴影显示时机</td><td>always | hover | never</td><td>always</td></tr>
  </tbody>
</table>

## Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>header</td><td>卡片头部内容</td></tr>
    <tr><td>default</td><td>卡片主体内容</td></tr>
  </tbody>
</table>

