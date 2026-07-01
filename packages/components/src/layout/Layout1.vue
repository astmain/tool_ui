<template>
  <div class="u1-layout1">
    <aside
      class="u1-layout1__sidebar"
      :style="{ width: mergedConfig.sidebarWidth, backgroundColor: mergedConfig.sidebarBgColor }"
    >
      <slot name="header" />
      <nav class="u1-layout1__menu">
        <ul>
          <li v-for="item in menus" :key="item.path" class="u1-layout1__item">
            <button
              type="button"
              class="u1-layout1__link"
              :class="{ 'u1-layout1__link--active': activePath === item.path }"
              :style="{
                '--u1-active-bg': mergedConfig.activeBgColor,
                '--u1-active-color': mergedConfig.activeColor,
                '--u1-hover-bg': mergedConfig.hoverBgColor,
                '--u1-item-color': mergedConfig.itemColor,
                '--u1-item-hover-color': mergedConfig.itemHoverColor
              }"
              :disabled="item.disabled"
              @click="handleSelect(item)"
            >
              <span v-if="item.icon" class="u1-layout1__icon" :class="item.icon"></span>
              <span>{{ item.title }}</span>
            </button>
          </li>
        </ul>
      </nav>
      <slot name="footer" />
    </aside>
    <main class="u1-layout1__content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'U1Layout1' })

export interface Layout1MenuItem {
  path: string
  title: string
  icon?: string
  disabled?: boolean
}

export interface Layout1Config {
  sidebarWidth?: string
  sidebarBgColor?: string
  activeBgColor?: string
  activeColor?: string
  hoverBgColor?: string
  itemColor?: string
  itemHoverColor?: string
}

const props = withDefaults(
  defineProps<{
    menus: Layout1MenuItem[]
    activePath?: string
    config?: Layout1Config
  }>(),
  {
    activePath: '',
    config: () => ({})
  }
)

const defaultConfig: Required<Layout1Config> = {
  sidebarWidth: '170px',
  sidebarBgColor: '#1f2937',
  activeBgColor: '#2563eb',
  activeColor: '#fff',
  hoverBgColor: '#374151',
  itemColor: '#d1d5db',
  itemHoverColor: '#fff'
}

const mergedConfig = computed(() => ({ ...defaultConfig, ...props.config }))

const emit = defineEmits<{
  select: [path: string]
}>()

function handleSelect(item: Layout1MenuItem) {
  if (item.disabled) return
  emit('select', item.path)
}
</script>

<style scoped>
.u1-layout1 {
  display: flex;
  flex-direction: row;
  min-height: 200px;
  width: 100%;
}

.u1-layout1__sidebar {
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.u1-layout1__menu {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.u1-layout1__footer {
  margin-top: auto;
  padding-top: 16px;
}

.u1-layout1__menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.u1-layout1__item {
  display: block;
}

.u1-layout1__link {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: var(--u1-item-color, #d1d5db);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.u1-layout1__link:hover:not(.u1-layout1__link--active):not(:disabled) {
  background-color: var(--u1-hover-bg, #374151);
  color: var(--u1-item-hover-color, #fff);
}

.u1-layout1__link--active {
  background-color: var(--u1-active-bg, #2563eb);
  color: var(--u1-active-color, #fff);
}

.u1-layout1__link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.u1-layout1__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.u1-layout1__content {
  flex: 1;
  background-color: #f0f0f0;
  padding: 16px;
  overflow: auto;
}
</style>
