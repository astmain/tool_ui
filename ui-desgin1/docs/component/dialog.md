# Dialog 对话框

用于在当前页面上方显示临时内容. 支持 `v-model`, 标题, 宽度, 遮罩关闭和插槽.

<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<div class="u1-demo">
  <p class="u1-demo-title">基础用法</p>
  <div class="u1-demo-row">
    <U1Button type="primary" @click="visible = true">打开对话框</U1Button>
  </div>
  <U1Dialog v-model="visible" title="提示">
    这是一段对话框内容.
    <template #footer>
      <U1Button @click="visible = false">取消</U1Button>
      <U1Button type="primary" @click="visible = false">确认</U1Button>
    </template>
  </U1Dialog>
</div>

<div class="u1-demo">
  <p class="u1-demo-title">固定宽度</p>
  <div class="u1-demo-row">
    <U1Dialog model-value title="固定宽度" width="420px" :close-on-click-modal="false">
      点击遮罩不会关闭.
    </U1Dialog>
  </div>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>是否显示</td><td>boolean</td><td>false</td></tr>
    <tr><td>title</td><td>标题</td><td>string</td><td>空字符串</td></tr>
    <tr><td>width</td><td>宽度</td><td>string</td><td>50%</td></tr>
    <tr><td>closeOnClickModal</td><td>点击遮罩是否关闭</td><td>boolean</td><td>true</td></tr>
  </tbody>
</table>
