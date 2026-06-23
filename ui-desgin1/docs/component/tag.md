# Tag 标签

用于标记和分类信息. 支持类型, 主题和关闭按钮.

<div class="u1-demo">
  <p class="u1-demo-title">基础用法</p>
  <div class="u1-demo-row">
    <U1Tag>Primary</U1Tag>
    <U1Tag type="success">Success</U1Tag>
    <U1Tag type="warning">Warning</U1Tag>
    <U1Tag type="danger">Danger</U1Tag>
    <U1Tag type="info">Info</U1Tag>
  </div>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">主题和关闭</p>
  <div class="u1-demo-row">
    <U1Tag effect="dark">Dark</U1Tag>
    <U1Tag effect="plain">Plain</U1Tag>
    <U1Tag closable>Closable</U1Tag>
  </div>
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
