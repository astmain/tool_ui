# Menu 菜单

用于导航和功能入口切换. 支持垂直模式, 水平模式, 当前激活项, 禁用项, 鼠标点击和键盘 Enter 或 Space 激活.

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

## 垂直菜单

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Menu v-model:active="active" :items="items" />
    <span>当前项: {{ active }}</span>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
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

<U1Menu v-model:active="active" :items="items" />
<span>当前项: {{ active }}</span>
```

  </details>
</div>

## 水平菜单

<div class="u1-demo">
  <U1Menu v-model:active="active" :items="items" mode="horizontal" />
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<U1Menu v-model:active="active" :items="items" mode="horizontal" />
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>items</td><td>菜单项数组</td><td>U1MenuItem[]</td><td>[]</td></tr>
    <tr><td>active</td><td>当前激活项</td><td>string</td><td>空字符串</td></tr>
    <tr><td>mode</td><td>菜单模式</td><td>vertical | horizontal</td><td>vertical</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>update:active</td><td>激活项变更</td><td>index</td></tr>
    <tr><td>select</td><td>选择菜单项</td><td>index</td></tr>
  </tbody>
</table>
