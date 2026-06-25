# Affix 吸附

用于让内容在滚动时吸附到顶部或底部. `U1Affix` 只负责吸附行为, 具体外观由插槽内容决定.

## 基础用法

<div class="u1-demo">
  <div class="u1-demo__body">
    <div style="height: 220px; overflow: auto; border: 1px solid #ebeef5; background: #f5f7fa; padding: 12px;">
      <U1Affix>
        <U1Card shadow="always">
          默认吸附到顶部, 下面内容滚动时卡片会保持可见.
        </U1Card>
      </U1Affix>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
        <div style="height: 120px; background: #ffffff; border: 1px solid #ebeef5; padding: 12px;">内容区块 A</div>
        <div style="height: 120px; background: #ffffff; border: 1px solid #ebeef5; padding: 12px;">内容区块 B</div>
        <div style="height: 120px; background: #ffffff; border: 1px solid #ebeef5; padding: 12px;">内容区块 C</div>
      </div>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <div class="scroll-area">
    <U1Affix>
      <U1Card>默认吸附到顶部</U1Card>
    </U1Affix>
    <div class="content-list">
      <div>内容区块 A</div>
      <div>内容区块 B</div>
      <div>内容区块 C</div>
    </div>
  </div>
</template>
```

  </details>
</div>

## 底部吸附

<div class="u1-demo">
  <div class="u1-demo__body">
    <div style="height: 220px; overflow: auto; border: 1px solid #ebeef5; background: #f5f7fa; padding: 12px;">
      <div style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 52px;">
        <div style="height: 120px; background: #ffffff; border: 1px solid #ebeef5; padding: 12px;">内容区块 1</div>
        <div style="height: 120px; background: #ffffff; border: 1px solid #ebeef5; padding: 12px;">内容区块 2</div>
        <div style="height: 120px; background: #ffffff; border: 1px solid #ebeef5; padding: 12px;">内容区块 3</div>
      </div>
      <U1Affix position="bottom" :offset="12">
        <U1Card shadow="always">底部吸附, 偏移 12px</U1Card>
      </U1Affix>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Affix position="bottom" :offset="12">
    <U1Card>底部吸附</U1Card>
  </U1Affix>
</template>
```

  </details>
</div>

## 禁用吸附

<div class="u1-demo">
  <div class="u1-demo__body">
    <U1Affix :disabled="true">
      <U1Card shadow="always">disabled 为 true 时, 内容保持普通文档流</U1Card>
    </U1Affix>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Affix :disabled="true">
    <U1Card>普通文档流</U1Card>
  </U1Affix>
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>offset</td><td>吸附偏移量</td><td>number | string</td><td>0</td></tr>
    <tr><td>position</td><td>吸附方向</td><td>top | bottom</td><td>top</td></tr>
    <tr><td>zIndex</td><td>吸附层级</td><td>number</td><td>100</td></tr>
    <tr><td>disabled</td><td>是否关闭吸附行为</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

## Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>default</td><td>需要吸附的内容</td></tr>
  </tbody>
</table>
