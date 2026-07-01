<script setup lang="ts">
// tool_ui1 组件已通过 app/plugins/tool_ui1.ts 全局注册，可直接使用
const count = ref(0)
const inputValue = ref('')
</script>

<template>
  <div style="padding: 40px; max-width: 640px; margin: 0 auto;">
    <h1 style="font-size: 24px; margin-bottom: 24px;">tool_ui1 组件库示例</h1>

    <section style="margin-bottom: 32px;">
      <h2 style="font-size: 16px; margin-bottom: 12px;">Button</h2>
      <div style="display: flex; gap: 12px; align-items: center;">
        <U1Button @click="count++">点击了 {{ count }} 次</U1Button>
        <U1Button type="primary">Primary</U1Button>
      </div>
    </section>

    <section style="margin-bottom: 32px;">
      <h2 style="font-size: 16px; margin-bottom: 12px;">Input</h2>
      <U1Input v-model="inputValue" placeholder="请输入内容" />
      <p style="margin-top: 8px; color: #666;">当前值：{{ inputValue }}</p>
    </section>

    <section>
      <h2 style="font-size: 16px; margin-bottom: 12px;">Card</h2>
      <U1Card>
        <p>这是一张来自 tool_ui1 的卡片。</p>
      </U1Card>
    </section>
  </div>
</template>
