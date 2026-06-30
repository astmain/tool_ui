# Avatar 头像

用于展示用户头像. 支持图片地址, 替代文本, 尺寸, 形状和图片加载失败后的插槽回退.

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Avatar src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" alt="User avatar" />
    <U1Avatar>U1</U1Avatar>
    <U1Avatar shape="square">U1</U1Avatar>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <div class="u1-demo-row">
    <U1Avatar src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" alt="User avatar" />
    <U1Avatar>U1</U1Avatar>
    <U1Avatar shape="square">U1</U1Avatar>
  </div>
</template>
```

  </details>
</div>

## 尺寸

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Avatar size="mini">XS</U1Avatar>
    <U1Avatar size="small">S</U1Avatar>
    <U1Avatar>M</U1Avatar>
    <U1Avatar size="large">L</U1Avatar>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <div class="u1-demo-row">
    <U1Avatar size="mini">XS</U1Avatar>
    <U1Avatar size="small">S</U1Avatar>
    <U1Avatar>M</U1Avatar>
    <U1Avatar size="large">L</U1Avatar>
  </div>
</template>
```

  </details>
</div>

## 图片失败回退

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Avatar src="/not-found-avatar.png" alt="Missing avatar">NA</U1Avatar>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <div class="u1-demo-row">
    <U1Avatar src="/not-found-avatar.png" alt="Missing avatar">NA</U1Avatar>
  </div>
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>src</td><td>图片地址</td><td>string</td><td>空字符串</td></tr>
    <tr><td>alt</td><td>图片替代文本</td><td>string</td><td>空字符串</td></tr>
    <tr><td>size</td><td>头像尺寸</td><td>large | default | small | mini</td><td>default</td></tr>
    <tr><td>shape</td><td>头像形状</td><td>circle | square</td><td>circle</td></tr>
  </tbody>
</table>

## Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>default</td><td>没有图片或图片加载失败时显示的内容</td></tr>
  </tbody>
</table>
