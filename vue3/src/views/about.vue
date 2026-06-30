<template>
  <section class="view">
    <h1 class="view__title">关于</h1>
    <p class="view__desc">本项目是 tool_ui1 组件库的 Vue3 演示应用。</p>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.view {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.view__title {
  margin: 0 0 8px;
  font-size: 22px;
}

.view__desc {
  margin: 0;
  color: #6b7280;
}
</style>