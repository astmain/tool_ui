# Message 消息提示

用于页面中的轻量级反馈提示. 支持类型, 内容和关闭按钮. 点击关闭按钮后会隐藏当前提示, 同时触发 close 事件.

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Message message="这是一条提示消息" />
    <U1Message type="success" message="保存成功" />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<U1Message message="这是一条提示消息" />
<U1Message type="success" message="保存成功" />
```

  </details>
</div>

## 不同类型

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Message type="success" message="成功提示" />
    <U1Message type="warning" message="警告提示" />
    <U1Message type="error" message="错误提示, 可关闭" show-close />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<U1Message type="success" message="成功提示" />
<U1Message type="warning" message="警告提示" />
<U1Message type="error" message="错误提示, 可关闭" show-close />
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>type</td><td>类型</td><td>success | warning | info | error</td><td>info</td></tr>
    <tr><td>message</td><td>消息内容</td><td>string</td><td>必填</td></tr>
    <tr><td>showClose</td><td>是否显示关闭按钮</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>close</td><td>关闭按钮点击后触发, 组件会同步隐藏</td><td>-</td></tr>
  </tbody>
</table>
