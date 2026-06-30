# Button 按钮

常用的操作按钮, 支持类型, 尺寸, 禁用, 朴素, 文本, 链接样式, 图标和加载状态.

## 基础用法
<p class="u1-demo-desc">使用 <code>type</code>, <code>plain</code>, <code>round</code> 和 <code>circle</code> 来定义按钮的样式.</p>

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button>Default</U1Button>
      <U1Button type="primary">Primary</U1Button>
      <U1Button type="success">Success</U1Button>
      <U1Button type="info">Info</U1Button>
      <U1Button type="warning">Warning</U1Button>
      <U1Button type="danger">Danger</U1Button>
      <U1Button label="我的按钮"></U1Button>
    </div>
    <div class="u1-demo-row">
      <U1Button plain>Plain</U1Button>
      <U1Button type="primary" plain>Primary</U1Button>
      <U1Button type="success" plain>Success</U1Button>
      <U1Button type="info" plain>Info</U1Button>
      <U1Button type="warning" plain>Warning</U1Button>
      <U1Button type="danger" plain>Danger</U1Button>
    </div>
    <div class="u1-demo-row">
      <U1Button round>Round</U1Button>
      <U1Button type="primary" round>Primary</U1Button>
      <U1Button type="success" round>Success</U1Button>
      <U1Button type="info" round>Info</U1Button>
      <U1Button type="warning" round>Warning</U1Button>
      <U1Button type="danger" round>Danger</U1Button>
    </div>
    <div class="u1-demo-row">
      <U1Button circle>+</U1Button>
      <U1Button type="primary" circle>+</U1Button>
      <U1Button type="success" circle>+</U1Button>
      <U1Button type="info" circle>?</U1Button>
      <U1Button type="warning" circle>+</U1Button>
      <U1Button type="danger" circle>+</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Button>Default</U1Button>
  <U1Button type="primary">Primary</U1Button>
  <U1Button type="success">Success</U1Button>
  <U1Button type="info">Info</U1Button>
  <U1Button type="warning">Warning</U1Button>
  <U1Button type="danger">Danger</U1Button>
  <U1Button label="我的按钮"></U1Button>

  <U1Button plain>Plain</U1Button>
  <U1Button type="primary" plain>Primary</U1Button>

  <U1Button round>Round</U1Button>
  <U1Button type="primary" round>Primary</U1Button>

  <U1Button circle>+</U1Button>
  <U1Button type="primary" circle>+</U1Button>
</template>
```

  </details>
</div>

## 禁用状态
<p class="u1-demo-desc">你可以使用 <code>disabled</code> 属性来定义按钮是否被禁用.</p>
<p class="u1-demo-desc">使用 <code>disabled</code> 属性来控制按钮是否为禁用状态. 该属性接受一个 <code>Boolean</code> 类型的值.</p>

<div class="u1-demo is-compact is-no-footer">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button disabled>Disabled</U1Button>
      <U1Button type="primary" disabled>Primary</U1Button>
      <U1Button type="success" disabled>Success</U1Button>
      <U1Button type="info" disabled>Info</U1Button>
      <U1Button type="warning" disabled>Warning</U1Button>
      <U1Button type="danger" disabled>Danger</U1Button>
    </div>
    <div class="u1-demo-row">
      <U1Button plain disabled>Plain</U1Button>
      <U1Button type="primary" plain disabled>Primary</U1Button>
      <U1Button type="success" plain disabled>Success</U1Button>
      <U1Button type="info" plain disabled>Info</U1Button>
      <U1Button type="warning" plain disabled>Warning</U1Button>
      <U1Button type="danger" plain disabled>Danger</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Button disabled>Disabled</U1Button>
  <U1Button type="primary" disabled>Primary</U1Button>
  <U1Button plain disabled>Plain</U1Button>
</template>
```

  </details>
</div>

## 文字按钮

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button text>Text button</U1Button>
      <U1Button text bg>Text with background</U1Button>
      <U1Button text disabled>Disabled text</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Button text>Text button</U1Button>
  <U1Button text bg>Text with background</U1Button>
  <U1Button text disabled>Disabled text</U1Button>
</template>
```

  </details>
</div>

## 链接按钮

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button link type="primary">Primary link</U1Button>
      <U1Button link type="success">Success link</U1Button>
      <U1Button link type="danger">Danger link</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Button link type="primary">Primary link</U1Button>
  <U1Button link type="success">Success link</U1Button>
  <U1Button link type="danger">Danger link</U1Button>
</template>
```

  </details>
</div>

## 图标按钮

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button type="primary" icon="add" label="Create"></U1Button>
      <U1Button icon="search" label="Search"></U1Button>
      <U1Button iconRight="check" label="Confirm"></U1Button>
      <U1Button type="danger" icon="not-exists" label="Fallback"></U1Button>
      <U1Button type="danger" icon="close" circle aria-label="Close"></U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Button type="primary" icon="add" label="Create"></U1Button>
  <U1Button icon="search" label="Search"></U1Button>
  <U1Button iconRight="check" label="Confirm"></U1Button>
  <U1Button type="danger" icon="not-exists" label="Fallback"></U1Button>
  <U1Button type="danger" icon="close" circle aria-label="Close"></U1Button>
</template>
```

  </details>
</div>

## 加载状态

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button type="primary" loading>Loading</U1Button>
      <U1Button loading>Loading</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Button type="primary" loading>Loading</U1Button>
  <U1Button loading>Loading</U1Button>
</template>
```

  </details>
</div>

## 不同尺寸

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button size="large">Large</U1Button>
      <U1Button>Default</U1Button>
      <U1Button size="small">Small</U1Button>
      <U1Button size="mini">Mini</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<template>
  <U1Button size="large">Large</U1Button>
  <U1Button>Default</U1Button>
  <U1Button size="small">Small</U1Button>
  <U1Button size="mini">Mini</U1Button>
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>type</td><td>按钮类型</td><td>default | primary | success | warning | danger | info</td><td>default</td></tr>
    <tr><td>size</td><td>按钮尺寸</td><td>large | default | small | mini</td><td>default</td></tr>
    <tr><td>label</td><td>按钮内容, 默认插槽优先级更高</td><td>string</td><td>-</td></tr>
    <tr><td>icon</td><td>左侧图标名称, 等价于 iconLeft</td><td>IconName | string</td><td>-</td></tr>
    <tr><td>iconLeft</td><td>左侧图标名称, 优先级高于 icon</td><td>IconName | string</td><td>-</td></tr>
    <tr><td>iconRight</td><td>右侧图标名称</td><td>IconName | string</td><td>-</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
    <tr><td>loading</td><td>是否加载中</td><td>boolean</td><td>false</td></tr>
    <tr><td>plain</td><td>是否朴素按钮</td><td>boolean</td><td>false</td></tr>
    <tr><td>round</td><td>是否圆角按钮</td><td>boolean</td><td>false</td></tr>
    <tr><td>circle</td><td>是否圆形按钮</td><td>boolean</td><td>false</td></tr>
    <tr><td>text</td><td>是否文字按钮</td><td>boolean</td><td>false</td></tr>
    <tr><td>link</td><td>是否链接按钮</td><td>boolean</td><td>false</td></tr>
    <tr><td>bg</td><td>文字按钮是否带背景</td><td>boolean</td><td>false</td></tr>
    <tr><td>nativeType</td><td>原生 button 类型</td><td>button | submit | reset</td><td>button</td></tr>
  </tbody>
</table>

## Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>default</td><td>按钮内容</td></tr>
    <tr><td>icon</td><td>自定义左侧图标内容, 优先级高于 icon 和 iconLeft</td></tr>
  </tbody>
</table>
