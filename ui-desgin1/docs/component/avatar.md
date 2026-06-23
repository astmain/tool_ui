# Avatar 头像

用于展示用户头像. 支持图片, 文本插槽, 尺寸和形状.

<div class="u1-demo">
  <p class="u1-demo-title">基础用法</p>
  <div class="u1-demo-row">
    <U1Avatar src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" alt="avatar" />
    <U1Avatar>U1</U1Avatar>
    <U1Avatar shape="square">U1</U1Avatar>
  </div>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">尺寸</p>
  <div class="u1-demo-row">
    <U1Avatar size="small">S</U1Avatar>
    <U1Avatar>M</U1Avatar>
    <U1Avatar size="large">L</U1Avatar>
  </div>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>src</td><td>图片地址</td><td>string</td><td>空字符串</td></tr>
    <tr><td>alt</td><td>图片描述</td><td>string</td><td>空字符串</td></tr>
    <tr><td>size</td><td>尺寸</td><td>small | default | large</td><td>default</td></tr>
    <tr><td>shape</td><td>形状</td><td>circle | square</td><td>circle</td></tr>
  </tbody>
</table>
