<script setup lang="ts">
import Layout from 'vitepress/dist/client/theme-default/Layout.vue'
import ThemeEditorDemo from './ThemeEditorDemo.vue'
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <ThemeEditorDemo />
    </template>
  </Layout>
</template>
