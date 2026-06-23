# Menu 菜单

用于导航和功能入口切换. 支持垂直模式, 水平模式, 当前激活项和禁用项.

<script setup>
import { ref } from 'vue'

const active = ref('dashboard')
const items = [
  { index: 'dashboard', label: '工作台' },
  { index: 'components', label: '组件' },
  { index: 'settings', label: '设置' },
  { index: 'disabled', label: '禁用项', disabled: true }
]
</script>

<div class="u1-demo">
  <p class="u1-demo-title">垂直菜单</p>
  <div class="u1-demo-row">
    <U1Menu v-model:active="active" :items="items" />
    <span>当前项: {{ active }}</span>
  </div>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">水平菜单</p>
  <U1Menu v-model:active="active" :items="items" mode="horizontal" />
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>items</td><td>菜单项</td><td>Array</td><td>[]</td></tr>
    <tr><td>active</td><td>当前激活项</td><td>string</td><td>空字符串</td></tr>
    <tr><td>mode</td><td>菜单模式</td><td>vertical | horizontal</td><td>vertical</td></tr>
  </tbody>
</table>
