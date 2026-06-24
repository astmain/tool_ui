import { defineConfig } from 'vitepress'

const basicItems = [
  { text: 'Button 按钮', link: '/component/button' },
  { text: 'Input 输入框', link: '/component/input' },
  { text: 'Radio 单选框', link: '/component/radio' },
  { text: 'Checkbox 多选框', link: '/component/checkbox' },
  { text: 'Select 选择器', link: '/component/select' },
  { text: 'Switch 开关', link: '/component/switch' },
  { text: 'Avatar 头像', link: '/component/avatar' },
  { text: 'Tag 标签', link: '/component/tag' },
  { text: 'Message 消息提示', link: '/component/message' }
]

const advancedItems = [
  { text: 'Card 卡片', link: '/component/card' },
  { text: 'Dialog 对话框', link: '/component/dialog' },
  { text: 'Table 表格', link: '/component/table' },
  { text: 'Menu 菜单', link: '/component/menu' }
]

const designItems = [
  { text: '颜色方案', link: '/component/design/colors' },
  { text: '图标体系', link: '/component/design/icons' }
]

export default defineConfig({
  title: 'U1Design',
  description: 'Vue 3 component library for U1Design',
  themeConfig: {
    nav: [
      { text: '指南', link: '/' },
      { text: '组件', link: '/component/overview' }
    ],
    sidebar: {
      '/component/': [
        { text: '基础组件', items: basicItems },
        { text: '高级组件', items: advancedItems },
        { text: '风格设计', items: designItems }
      ]
    },
    socialLinks: [],
    docFooter: {
      prev: false,
      next: false
    }
  }
})
