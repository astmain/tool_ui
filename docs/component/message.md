# Message 消息提示

用于页面中的轻量级反馈提示. 适合保存成功, 删除失败, 表单校验, 后台任务完成等即时反馈场景. 推荐使用函数式 API 调用.

<script setup>
import { U1Message } from 'tool_ui1'

function openBasicMessage() {
  U1Message('这是一条提示消息')
}

function openClosableMessage() {
  U1Message({
    message: '这是一条可关闭提示',
    type: 'success',
    showClose: true,
    duration: 0
  })
}

function openTypeMessage(type) {
  U1Message[type](`${type} 类型消息`)
}

function openGroupedMessage() {
  U1Message({
    message: '同一条消息会合并计数',
    type: 'warning',
    grouping: true
  })
}

function openPersistentMessage() {
  const handler = U1Message({
    message: '这条消息需要手动关闭',
    type: 'info',
    duration: 0,
    showClose: true
  })

  window.setTimeout(() => {
    handler.close()
  }, 5000)
}

function openPlacementMessage(placement) {
  U1Message({
    message: `${placement} 位置提示`,
    type: 'success',
    placement
  })
}

function closeAllMessage() {
  U1Message.closeAll()
}
</script>

## 基础用法

<p class="u1-demo-desc">直接调用 <code>U1Message</code> 创建提示. 传入字符串时会生成默认信息提示.</p>

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button type="primary" @click="openBasicMessage">打开消息</U1Button>
      <U1Button type="success" @click="openClosableMessage">可关闭消息</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { U1Message } from 'tool_ui1'

function openBasicMessage() {
  U1Message('这是一条提示消息')
}

function openClosableMessage() {
  U1Message({
    message: '这是一条可关闭提示',
    type: 'success',
    showClose: true,
    duration: 0
  })
}
</script>

<template>
  <div class="u1-demo-row">
    <U1Button type="primary" @click="openBasicMessage">打开消息</U1Button>
    <U1Button type="success" @click="openClosableMessage">可关闭消息</U1Button>
  </div>
</template>
```

  </details>
</div>

## 不同类型

<p class="u1-demo-desc">提供 <code>success</code>, <code>warning</code>, <code>info</code>, <code>error</code> 快捷方法.</p>

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button type="success" @click="openTypeMessage('success')">Success</U1Button>
      <U1Button type="warning" @click="openTypeMessage('warning')">Warning</U1Button>
      <U1Button type="info" @click="openTypeMessage('info')">Info</U1Button>
      <U1Button type="danger" @click="openTypeMessage('error')">Error</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { U1Message } from 'tool_ui1'

function openSuccessMessage() {
  U1Message.success('success 类型消息')
}

function openWarningMessage() {
  U1Message.warning('warning 类型消息')
}

function openInfoMessage() {
  U1Message.info('info 类型消息')
}

function openErrorMessage() {
  U1Message.error('error 类型消息')
}
</script>

<template>
  <div class="u1-demo-row">
    <U1Button type="success" @click="openSuccessMessage">Success</U1Button>
    <U1Button type="warning" @click="openWarningMessage">Warning</U1Button>
    <U1Button type="info" @click="openInfoMessage">Info</U1Button>
    <U1Button type="danger" @click="openErrorMessage">Error</U1Button>
  </div>
</template>
```

  </details>
</div>

## 分组与手动关闭

<p class="u1-demo-desc">开启 <code>grouping</code> 后, 相同内容和类型的消息会合并计数. 设置 <code>duration</code> 为 <code>0</code> 后消息不会自动关闭.</p>

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button type="warning" @click="openGroupedMessage">分组消息</U1Button>
      <U1Button @click="openPersistentMessage">常驻消息</U1Button>
      <U1Button type="danger" @click="closeAllMessage">关闭全部</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { U1Message } from 'tool_ui1'

function openGroupedMessage() {
  U1Message({
    message: '同一条消息会合并计数',
    type: 'warning',
    grouping: true
  })
}

function openPersistentMessage() {
  const handler = U1Message({
    message: '这条消息需要手动关闭',
    type: 'info',
    duration: 0,
    showClose: true
  })

  window.setTimeout(() => {
    handler.close()
  }, 5000)
}

function closeAllMessage() {
  U1Message.closeAll()
}
</script>

<template>
  <div class="u1-demo-row">
    <U1Button type="warning" @click="openGroupedMessage">分组消息</U1Button>
    <U1Button @click="openPersistentMessage">常驻消息</U1Button>
    <U1Button type="danger" @click="closeAllMessage">关闭全部</U1Button>
  </div>
</template>
```

  </details>
</div>

## 出现位置

<p class="u1-demo-desc">通过 <code>placement</code> 控制消息显示位置. 默认值为 <code>top</code>.</p>

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Button @click="openPlacementMessage('top')">Top</U1Button>
      <U1Button @click="openPlacementMessage('top-left')">Top left</U1Button>
      <U1Button @click="openPlacementMessage('top-right')">Top right</U1Button>
      <U1Button @click="openPlacementMessage('bottom')">Bottom</U1Button>
      <U1Button @click="openPlacementMessage('bottom-left')">Bottom left</U1Button>
      <U1Button @click="openPlacementMessage('bottom-right')">Bottom right</U1Button>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { U1Message } from 'tool_ui1'

function openPlacementMessage(placement) {
  U1Message({
    message: placement + ' 位置提示',
    type: 'success',
    placement
  })
}
</script>

<template>
  <div class="u1-demo-row">
    <U1Button @click="openPlacementMessage('top')">Top</U1Button>
    <U1Button @click="openPlacementMessage('top-left')">Top left</U1Button>
    <U1Button @click="openPlacementMessage('top-right')">Top right</U1Button>
    <U1Button @click="openPlacementMessage('bottom')">Bottom</U1Button>
    <U1Button @click="openPlacementMessage('bottom-left')">Bottom left</U1Button>
    <U1Button @click="openPlacementMessage('bottom-right')">Bottom right</U1Button>
  </div>
</template>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>message</td><td>消息内容</td><td>string</td><td>必填</td></tr>
    <tr><td>type</td><td>消息类型</td><td>success | warning | info | error</td><td>info</td></tr>
    <tr><td>duration</td><td>显示时间. 设置为 0 时不会自动关闭</td><td>number</td><td>3000</td></tr>
    <tr><td>showClose</td><td>是否显示关闭按钮</td><td>boolean</td><td>false</td></tr>
    <tr><td>grouping</td><td>是否合并相同内容和类型的消息</td><td>boolean</td><td>false</td></tr>
    <tr><td>placement</td><td>出现位置</td><td>top | top-left | top-right | bottom | bottom-left | bottom-right</td><td>top</td></tr>
    <tr><td>offset</td><td>距离窗口边缘的偏移量</td><td>number</td><td>20</td></tr>
    <tr><td>zIndex</td><td>层级</td><td>number</td><td>3000</td></tr>
    <tr><td>dangerouslyUseHTMLString</td><td>是否把 message 作为 HTML 片段渲染</td><td>boolean</td><td>false</td></tr>
    <tr><td>onClose</td><td>关闭回调</td><td>() =&gt; void</td><td>-</td></tr>
  </tbody>
</table>

## 方法

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>U1Message</td><td>创建信息消息</td><td>string | U1MessageOptions</td></tr>
    <tr><td>U1Message.success</td><td>创建成功消息</td><td>string | U1MessageOptions</td></tr>
    <tr><td>U1Message.warning</td><td>创建警告消息</td><td>string | U1MessageOptions</td></tr>
    <tr><td>U1Message.info</td><td>创建信息消息</td><td>string | U1MessageOptions</td></tr>
    <tr><td>U1Message.error</td><td>创建错误消息</td><td>string | U1MessageOptions</td></tr>
    <tr><td>U1Message.closeAll</td><td>关闭全部消息. 可按类型关闭</td><td>type?</td></tr>
  </tbody>
</table>
