# Switch 开关

用于在两个状态之间切换. 支持 `v-model`, 文案和禁用状态.

<script setup>
import { ref } from 'vue'

const enabled = ref(false)
</script>

## 基础用法

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Switch v-model="enabled" active-text="开启" inactive-text="关闭" />
    <span>当前状态: {{ enabled ? '开启' : '关闭' }}</span>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const enabled = ref(false)
</script>

<U1Switch v-model="enabled" active-text="开启" inactive-text="关闭" />
<span>当前状态: {{ enabled ? '开启' : '关闭' }}</span>
```

  </details>
</div>

## 状态

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Switch model-value active-text="开启" inactive-text="关闭" />
    <U1Switch disabled inactive-text="禁用" />
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<U1Switch model-value active-text="开启" inactive-text="关闭" />
<U1Switch disabled inactive-text="禁用" />
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定值</td><td>boolean</td><td>false</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
    <tr><td>activeText</td><td>开启文案</td><td>string</td><td>空字符串</td></tr>
    <tr><td>inactiveText</td><td>关闭文案</td><td>string</td><td>空字符串</td></tr>
  </tbody>
</table>
