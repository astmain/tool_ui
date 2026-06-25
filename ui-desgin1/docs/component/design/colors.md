# 设计配色

U1Design 的设计配色用于统一组件状态, 文档示例和主题切换. 颜色优先表达层级和状态, 不单独依赖颜色传达含义.

## 品牌色

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-color-grid">
      <div class="u1-color-card">
        <span class="u1-color-swatch is-primary"></span>
        <strong>Primary</strong>
        <span>#409eff</span>
      </div>
      <div class="u1-color-card">
        <span class="u1-color-swatch is-success"></span>
        <strong>Success</strong>
        <span>#67c23a</span>
      </div>
      <div class="u1-color-card">
        <span class="u1-color-swatch is-warning"></span>
        <strong>Warning</strong>
        <span>#e6a23c</span>
      </div>
      <div class="u1-color-card">
        <span class="u1-color-swatch is-danger"></span>
        <strong>Danger</strong>
        <span>#f56c6c</span>
      </div>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```html
<div class="u1-color-grid">
  <div class="u1-color-card">
    <span class="u1-color-swatch is-primary"></span>
    <strong>Primary</strong>
    <span>#409eff</span>
  </div>
  <div class="u1-color-card">
    <span class="u1-color-swatch is-success"></span>
    <strong>Success</strong>
    <span>#67c23a</span>
  </div>
  <div class="u1-color-card">
    <span class="u1-color-swatch is-warning"></span>
    <strong>Warning</strong>
    <span>#e6a23c</span>
  </div>
  <div class="u1-color-card">
    <span class="u1-color-swatch is-danger"></span>
    <strong>Danger</strong>
    <span>#f56c6c</span>
  </div>
</div>
```

  </details>
</div>

## 中性色

<div class="u1-demo">
  <div class="u1-demo__body">
    <div class="u1-token-list">
      <div><strong>Text 1</strong><span>主要标题和高优先级文本</span></div>
      <div><strong>Text 2</strong><span>正文说明和辅助阅读文本</span></div>
      <div><strong>Border</strong><span>卡片边界, 表格边界和分隔线</span></div>
      <div><strong>Surface</strong><span>页面背景, 示例容器和浮层背景</span></div>
    </div>
  </div>
  <details class="u1-demo__footer">
    <summary>Show code</summary>

```html
<div class="u1-token-list">
  <div><strong>Text 1</strong><span>主要标题和高优先级文本</span></div>
  <div><strong>Text 2</strong><span>正文说明和辅助阅读文本</span></div>
  <div><strong>Border</strong><span>卡片边界, 表格边界和分隔线</span></div>
  <div><strong>Surface</strong><span>页面背景, 示例容器和浮层背景</span></div>
</div>
```

  </details>
</div>

## 使用原则

1. 主操作使用 Primary, 成功反馈使用 Success, 警告提示使用 Warning, 危险操作使用 Danger.
2. 同一页面只保留一个最高优先级动作, 其他动作降低视觉权重.
3. 深色主题优先继承 VitePress 变量, 避免为单个页面写死大块颜色.
