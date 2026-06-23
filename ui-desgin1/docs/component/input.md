# Input 输入框

用于接收单行文本, 支持 `v-model`, placeholder, 禁用, 清空和密码输入.

<script setup>
import { ref } from 'vue'

const basicValue = ref('')
const passwordValue = ref('u1design')
</script>

<div class="u1-demo">
  <p class="u1-demo-title">基础用法</p>
  <div class="u1-demo-row">
    <U1Input v-model="basicValue" placeholder="请输入内容" clearable />
    <span>当前值: {{ basicValue || '空' }}</span>
  </div>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">状态</p>
  <div class="u1-demo-row">
    <U1Input v-model="passwordValue" show-password />
    <U1Input model-value="Disabled" disabled />
  </div>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>绑定值</td><td>string</td><td>空字符串</td></tr>
    <tr><td>placeholder</td><td>占位文本</td><td>string</td><td>空字符串</td></tr>
    <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
    <tr><td>clearable</td><td>是否可清空</td><td>boolean</td><td>false</td></tr>
    <tr><td>showPassword</td><td>是否密码输入</td><td>boolean</td><td>false</td></tr>
  </tbody>
</table>

