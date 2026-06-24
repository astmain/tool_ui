# Dialog 对话框

用于在当前页面上展示临时内容. 支持 `v-model`, 标题, 宽度, 遮罩关闭, 默认插槽, footer 插槽和基础可访问性语义.

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const fixedVisible = ref(false)
</script>

## 基础用法

<div class="u1-demo">
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
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<U1Button type="primary" @click="visible = true">打开对话框</U1Button>
<U1Dialog v-model="visible" title="提示">
  这是一段对话框内容.
  <template #footer>
    <U1Button @click="visible = false">取消</U1Button>
    <U1Button type="primary" @click="visible = false">确认</U1Button>
  </template>
</U1Dialog>
```

  </details>
</div>

## 固定宽度

<div class="u1-demo">
  <div class="u1-demo-row">
    <U1Button @click="fixedVisible = true">打开固定宽度对话框</U1Button>
    <U1Dialog v-model="fixedVisible" title="固定宽度" width="420px" :close-on-click-modal="false">
      点击遮罩不会关闭.
      <template #footer>
        <U1Button type="primary" @click="fixedVisible = false">知道了</U1Button>
      </template>
    </U1Dialog>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const fixedVisible = ref(false)
</script>

<U1Button @click="fixedVisible = true">打开固定宽度对话框</U1Button>
<U1Dialog v-model="fixedVisible" title="固定宽度" width="420px" :close-on-click-modal="false">
  点击遮罩不会关闭.
  <template #footer>
    <U1Button type="primary" @click="fixedVisible = false">知道了</U1Button>
  </template>
</U1Dialog>
```

  </details>
</div>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>modelValue</td><td>是否显示</td><td>boolean</td><td>false</td></tr>
    <tr><td>title</td><td>标题, 同时用于 dialog 的 aria-label</td><td>string</td><td>空字符串</td></tr>
    <tr><td>width</td><td>宽度</td><td>string</td><td>50%</td></tr>
    <tr><td>closeOnClickModal</td><td>点击遮罩是否关闭</td><td>boolean</td><td>true</td></tr>
    <tr><td>closeOnPressEscape</td><td>按下 Escape 是否关闭</td><td>boolean</td><td>true</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>update:modelValue</td><td>显示状态变更</td><td>boolean</td></tr>
    <tr><td>close</td><td>关闭按钮, 遮罩或 Escape 触发关闭</td><td>-</td></tr>
  </tbody>
</table>

## Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>default</td><td>对话框主体内容</td></tr>
    <tr><td>header</td><td>自定义头部</td></tr>
    <tr><td>footer</td><td>自定义底部操作区</td></tr>
  </tbody>
</table>
