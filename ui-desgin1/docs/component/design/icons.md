# 图标体系

U1Design 的图标体系用于按钮, 表单, 导航和反馈场景. 图标保持一致的线性风格, 统一尺寸和描边, 不使用 emoji 作为结构图标.

## 基础图标

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-icon-grid">
      <div class="u1-icon-card"><span class="u1-icon-mark is-add" aria-hidden="true"></span><strong>Add</strong><span>新增动作</span></div>
      <div class="u1-icon-card"><span class="u1-icon-mark is-check" aria-hidden="true"></span><strong>Check</strong><span>成功状态</span></div>
      <div class="u1-icon-card"><span class="u1-icon-mark is-close" aria-hidden="true"></span><strong>Close</strong><span>关闭动作</span></div>
      <div class="u1-icon-card"><span class="u1-icon-mark is-search" aria-hidden="true"></span><strong>Search</strong><span>搜索入口</span></div>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```html
<div class="u1-icon-grid">
  <div class="u1-icon-card"><span class="u1-icon-mark is-add" aria-hidden="true"></span><strong>Add</strong><span>新增动作</span></div>
  <div class="u1-icon-card"><span class="u1-icon-mark is-check" aria-hidden="true"></span><strong>Check</strong><span>成功状态</span></div>
  <div class="u1-icon-card"><span class="u1-icon-mark is-close" aria-hidden="true"></span><strong>Close</strong><span>关闭动作</span></div>
  <div class="u1-icon-card"><span class="u1-icon-mark is-search" aria-hidden="true"></span><strong>Search</strong><span>搜索入口</span></div>
</div>
```

  </details>
</div>

## 尺寸规范

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-token-list">
      <div><strong>16px</strong><span>表单后缀, 表格行内动作和紧凑按钮</span></div>
      <div><strong>20px</strong><span>默认按钮, 菜单项和普通反馈</span></div>
      <div><strong>24px</strong><span>导航入口, 对话框标题和高优先级操作</span></div>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```html
<div class="u1-token-list">
  <div><strong>16px</strong><span>表单后缀, 表格行内动作和紧凑按钮</span></div>
  <div><strong>20px</strong><span>默认按钮, 菜单项和普通反馈</span></div>
  <div><strong>24px</strong><span>导航入口, 对话框标题和高优先级操作</span></div>
</div>
```

  </details>
</div>

## 使用原则

1. 同一层级使用同一种图标风格, 不混用线性图标和填充图标.
2. 图标按钮必须保留可访问名称, 不能只依赖视觉符号.
3. 图标和文字的间距保持 8px, 对齐到文本基线.
