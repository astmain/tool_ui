<template>
  <div style="display: flex; flex-direction: row; height: 100vh">
    <!-- 侧边栏 -->
    <nav style="width: 170px; height: 100%; background-color: #1f2937; padding: 20px 12px; display: flex; flex-direction: column">
      <ul style="display: flex; flex-direction: column; gap: 4px">
        <li v-for="item in menus" :key="item.path">
          <RouterLink :to="item.path" class="menu_link" :class="{ menu_link_active: isActive(item.path) }">
            <span>{{ item.title }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <!-- 内容区域 -->
    <main style="flex: 1; background-color: #f0f0f0; padding: 16px; overflow: auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const menus = [
  { path: '/home', title: '首页', icon: 'home' },
  { path: '/about', title: '关于', icon: 'info' },
];

const activePath = computed(() => {
  const matched = menus.find((m) => m.path === route.path);
  return matched?.path ?? menus[0].path;
});

function isActive(path: string) {
  return activePath.value === path;
}
</script>

<style scoped>
.menu_link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  color: #d1d5db;
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.menu_link_active {
  background-color: #2563eb;
  color: #fff;
}

.menu_link:hover:not(.menu_link_active) {
  background-color: #374151;
  color: #fff;
}
</style>
