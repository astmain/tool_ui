# Layout1 布局

基础的左侧侧边栏 + 右侧内容区布局组件。

<script setup>
import { ref } from 'vue'

const demo1Menus = [             // 菜单数据数组
  { path: '/home', title: '首页' },      // path: 路由路径，title: 菜单显示文字
  { path: '/about', title: '关于' },
]
const demo1Active = ref('/home')

const demo2Menus = [             // 菜单数据数组
  { path: '/home', title: '首页', icon: 'icon-home' },      // icon: 菜单图标
  { path: '/users', title: '用户管理', icon: 'icon-users' },
  { path: '/settings', title: '设置', icon: 'icon-settings' },
]
const demo2Active = ref('/home')

const demo3Menus = [             // 菜单数据数组
  { path: '/home', title: '首页' },      // path: 路由路径，title: 菜单显示文字
  { path: '/about', title: '关于' },
]
const demo3Active = ref('/home')
const demo3Config = {             // 菜单样式配置（可选，不传则使用默认样式）
  sidebarWidth: '200px',     // 侧边栏宽度
  sidebarBgColor: '#1e3a5f', // 侧边栏背景色
  activeBgColor: '#f59e0b',  // 当前选中菜单的背景色
  hoverBgColor: '#2c5282',   // 鼠标悬停时菜单的背景色
  itemColor: '#e5e7eb',      // 默认菜单文字颜色
}

const demo4Menus = [             // 菜单数据数组
  { path: '/home', title: '首页' },      // path: 路由路径，title: 菜单显示文字
  { path: '/profile', title: '个人中心' },
]
const demo4Active = ref('/home')
</script>

## 基础用法

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Layout1 :menus="demo1Menus" :active-path="demo1Active" @select="demo1Active = $event" style="height: 200px; border: 1px solid #ddd;">
        <div style="padding: 16px;">Main Content Area</div>
      </U1Layout1>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const menus = [                   // 菜单数据数组
  { path: '/home', title: '首页' },  // path: 路由路径，title: 菜单显示文字
  { path: '/about', title: '关于' },
]
const activePath = ref('/home') // 当前选中菜单的路径（需要与 menus 中的 path 对应）
</script>

<template>
  <U1Layout1 
    :menus="menus" 
    :active-path="activePath"
    @select="activePath = $event"
  >
    <div>Main Content Area</div>
  </U1Layout1>
</template>
```

  </details>
</div>

## 带图标菜单

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Layout1 :menus="demo2Menus" :active-path="demo2Active" @select="demo2Active = $event" style="height: 200px; border: 1px solid #ddd;">
        <div style="padding: 16px;">Content with Icons</div>
      </U1Layout1>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const menus = [
  { path: '/home', title: '首页', icon: 'icon-home' },      // icon: 菜单图标
  { path: '/users', title: '用户管理', icon: 'icon-users' },
  { path: '/settings', title: '设置', icon: 'icon-settings' },
]
const activePath = ref('/home') // 当前选中菜单的路径（需要与 menus 中的 path 对应）
</script>

<template>
  <U1Layout1 
    :menus="menus" 
    :active-path="activePath"
    @select="activePath = $event"
  >
    <div>Main Content Area</div>
  </U1Layout1>
</template>
```

  </details>
</div>

## 自定义样式

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Layout1 
        :menus="demo3Menus" 
        :active-path="demo3Active"
        :config="demo3Config"
        @select="demo3Active = $event"
        style="height: 200px; border: 1px solid #ddd;"
      >
        <div style="padding: 16px;">Custom Styled Layout</div>
      </U1Layout1>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const menus = [                   // 菜单数据数组
  { path: '/home', title: '首页' },  // path: 路由路径，title: 菜单显示文字
  { path: '/about', title: '关于' },
]
const activePath = ref('/home') // 当前选中菜单的路径（需要与 menus 中的 path 对应）
const config = {                 // 菜单样式配置（可选，不传则使用默认样式）
  sidebarWidth: '200px',     // 侧边栏宽度
  sidebarBgColor: '#1e3a5f', // 侧边栏背景色
  activeBgColor: '#f59e0b',  // 当前选中菜单的背景色
  hoverBgColor: '#2c5282',   // 鼠标悬停时菜单的背景色
  itemColor: '#e5e7eb',      // 默认菜单文字颜色
}
</script>

<template>
  <U1Layout1 
    :menus="menus" 
    :active-path="activePath"
    :config="config"
    @select="activePath = $event"
  >
    <div>Main Content Area</div>
  </U1Layout1>
</template>
```

  </details>
</div>

## 配合 Vue Router 使用

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <div style="padding: 12px; background: #ecf5ff; border: 1px solid #409eff; border-radius: 4px; color: #409eff;">
        该示例需要在实际 Vue Router 项目中使用。在 VitePress 文档中无法直接演示路由跳转。
      </div>
    </div>
  </div>
</div>

## 顶底部插槽

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-demo-row">
      <U1Layout1 :menus="demo4Menus" :active-path="demo4Active" @select="demo4Active = $event" style="height: 200px; border: 1px solid #ddd;">
        <template #header>
          <div style="padding: 12px; color: #fff; font-size: 18px; font-weight: bold;">My App</div>
        </template>
        <div style="padding: 16px;">Content Area</div>
        <template #footer>
          <div style="padding: 12px; color: #9ca3af; font-size: 12px; border-top: 1px solid #374151;">
            v1.0.0
          </div>
        </template>
      </U1Layout1>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```vue
<script setup>
import { ref } from 'vue'

const menus = [
  { path: '/home', title: '首页' },
  { path: '/profile', title: '个人中心' },
]
const activePath = ref('/home') // 当前选中菜单的路径（需要与 menus 中的 path 对应）
</script>

<template>
  <U1Layout1 :menus="menus" :active-path="activePath" @select="activePath = $event">
    <template #header>
      <div style="padding: 12px; color: #fff; font-size: 18px; font-weight: bold;">My App</div>
    </template>
    <div>Content Area</div>
    <template #footer>
      <div style="padding: 12px; color: #9ca3af; font-size: 12px; border-top: 1px solid #374151;">
        v1.0.0
      </div>
    </template>
  </U1Layout1>
</template>
```

  </details>
</div>

## Slots

<table class="u1-api-table">
  <thead><tr><th>名称</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>default</td><td>主内容区插槽</td></tr>
    <tr><td>header</td><td>侧边栏顶部区域插槽（如 Logo、标题等）</td></tr>
    <tr><td>footer</td><td>侧边栏底部区域插槽（如版本信息、退出登录等）</td></tr>
  </tbody>
</table>

## Events

<table class="u1-api-table">
  <thead><tr><th>事件名</th><th>说明</th><th>参数</th></tr></thead>
  <tbody>
    <tr><td>select</td><td>菜单项点击时触发</td><td>(path: string) 当前菜单项的路径</td></tr>
  </tbody>
</table>

## API

<table class="u1-api-table">
  <thead><tr><th>属性</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead>
  <tbody>
    <tr><td>menus</td><td>菜单列表（必填）</td><td>Layout1MenuItem[]</td><td>-</td></tr>
    <tr><td>activePath</td><td>当前激活的菜单路径</td><td>string</td><td>''</td></tr>
    <tr><td>config</td><td>样式配置对象（详见 Layout1Config）</td><td>Layout1Config</td><td>{}</td></tr>
  </tbody>
</table>

## Layout1Config 类型

```typescript
interface Layout1Config {
  sidebarWidth?: string       // 侧边栏宽度，默认 '170px'
  sidebarBgColor?: string    // 侧边栏背景色，默认 '#1f2937'
  activeBgColor?: string     // 当前选中菜单的背景色，默认 '#2563eb'
  activeColor?: string       // 当前选中菜单的文字颜色，默认 '#fff'
  hoverBgColor?: string      // 鼠标悬停时菜单的背景色，默认 '#374151'
  itemColor?: string         // 默认菜单文字颜色，默认 '#d1d5db'
  itemHoverColor?: string    // 鼠标悬停时菜单的文字颜色，默认 '#fff'
}
```

## Layout1MenuItem 类型

```typescript
interface Layout1MenuItem {
  path: string          // 菜单路径
  title: string         // 菜单标题
  icon?: string         // 图标名称（可选）
  disabled?: boolean    // 是否禁用（可选）
}
```
