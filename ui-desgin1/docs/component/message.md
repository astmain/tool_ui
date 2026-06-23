# Message 消息提示

用于页面中的轻量级反馈提示. 支持类型, 内容和关闭按钮.

<div class="u1-demo">
  <p class="u1-demo-title">基础用法</p>
  <div class="u1-demo-row">
    <U1Message message="这是一条提示消息" />
    <U1Message type="success" message="保存成功" />
  </div>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">不同类型</p>
  <div class="u1-demo-row">
    <U1Message type="success" message="成功提示" />
    <U1Message type="warning" message="警告提示" />
    <U1Message type="error" message="错误提示" show-close />
  </div>
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
