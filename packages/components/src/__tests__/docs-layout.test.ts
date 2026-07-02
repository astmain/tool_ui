import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '..', '..', '..', '..')
const docsRoot = resolve(root, 'packages', 'docs')

function readProjectFile(path: string) {
  return readFileSync(resolve(root, path), 'utf8')
}

// 样式已拆分到各组件目录 (base.css + src/<comp>/<comp>.css)。
// 这里聚合读取, 使断言仍针对"整体组件样式表"内容, 语义与原 index.css 一致。
function readComponentCss(): string {
  const srcDir = resolve(root, 'packages', 'components', 'src')
  const parts: string[] = [readFileSync(resolve(srcDir, 'styles', 'base.css'), 'utf8')]
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'styles') continue
    const cssPath = resolve(srcDir, entry.name, `${entry.name}.css`)
    try {
      parts.push(readFileSync(cssPath, 'utf8'))
    } catch {
      // 该组件无独立 css (如 confirm/layout/theme-editor 使用 .vue scoped style)
    }
  }
  return parts.join('\n')
}

function readDocsFile(path: string) {
  return readFileSync(resolve(docsRoot, path), 'utf8')
}

function listMarkdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(dir, entry.name)

    if (entry.isDirectory()) {
      return listMarkdownFiles(entryPath)
    }

    return entry.name.endsWith('.md') ? [entryPath] : []
  })
}

function countMatches(source: string, pattern: RegExp) {
  return source.match(pattern)?.length ?? 0
}

describe('docs layout regressions', () => {
  it('does not override VitePress shell layout primitives', () => {
    const css = readDocsFile('.vitepress/theme/style.css')

    expect(css).toContain('--vp-layout-max-width: 1680px')
    expect(css).toMatch(/\.VPDoc\.has-aside\s+\.content-container\s*{[^}]*max-width:\s*920px\s*!important/s)
    expect(css).not.toMatch(/\.VPContent\.has-sidebar/)
    expect(css).not.toMatch(/\.VPDoc\.has-aside\s+\.aside/)
    expect(css).not.toMatch(/\.VPDoc\.has-aside\s*>\s*\.container\s*>\s*\.content/)
  })

  it('does not show VitePress heading anchor marks in component docs', () => {
    const css = readDocsFile('.vitepress/theme/style.css')

    expect(css).toMatch(/\.vp-doc\s+\.header-anchor\s*{[^}]*display:\s*none/s)
  })

  it('keeps documented svg icon usage available', () => {
    const componentCss = readComponentCss()
    const docsCss = readDocsFile('.vitepress/theme/style.css')
    const icons = readDocsFile('component/design/icons.md')

    expect(icons).toContain('<table class="u1-icon-table">')
    expect(icons).toContain('<div class="u1-demo__body u1-icon-table-demo__body">')
    expect(icons).toContain('<U1Icon name="add"')
    expect(icons).toContain('<th>用法</th>')
    expect(icons).toContain('<code>&lt;U1Button class="icon-add" label="新增动作"/&gt;</code>')
    expect(icons).toContain('<code>&lt;U1Button class="icon-eye-open" label="显示内容"/&gt;</code>')
    expect(icons).toContain('<code>&lt;U1Button class="icon-eye-close" label="隐藏内容"/&gt;</code>')
    expect(icons).not.toContain('<code>hide</code>')
    expect(icons).not.toContain('icon-hide')
    expect(icons).not.toContain('<th>按钮用法</th>')
    expect(icons).not.toContain('<code>&lt;U1Button icon="add" label="新增动作"/&gt;</code>')
    expect(icons).not.toContain('<code>&lt;U1Button icon="eye-open" label="显示内容"/&gt;</code>')
    expect(icons).toContain('<template>')
    expect(icons).toContain('  <!-- icon不同的使用方式-->')
    expect(icons).toContain('<U1Button icon="eye-open" label="显示内容"/>')
    expect(icons).toContain('<U1Button icon-left="search" icon-right="check" label="搜索确认"/>')
    expect(icons).toContain('<U1Icon name="eye-open" />')
    expect(icons).not.toContain('u1-icon-card')
    expect(icons).not.toContain('<th>文件</th>')
    expect(icons).not.toContain('eye-open.vue')
    expect(icons).not.toContain('<h3>动作图标</h3>')
    expect(componentCss).toMatch(/\.u1-icon\s*{[^}]*display:\s*inline-block/s)
    expect(docsCss).toMatch(/\.vp-doc\s+\.u1-icon-table\s*{[^}]*display:\s*table/s)
    expect(docsCss).toMatch(/\.vp-doc\s+\.u1-icon-table\s*{[^}]*min-width:\s*100%/s)
    expect(docsCss).toMatch(/\.u1-icon-table-demo__body\s*{[^}]*padding:\s*8px/s)
    expect(docsCss).toMatch(/\.u1-icon-table__preview\s+\.u1-icon\s*{/)
    expect(componentCss).not.toContain('u1-icon-mark')
  })

  it('disables dialog transform transitions while dragging', () => {
    const css = readComponentCss()

    expect(css).toMatch(/\.u1-dialog\.is-dragging\s*{[^}]*transition:\s*none/s)
  })

  it('does not render a dialog open on page load', () => {
    const markdown = readDocsFile('component/dialog.md')

    expect(markdown).not.toContain('<U1Dialog model-value')
    expect(markdown).not.toContain('<U1Dialog :model-value="true"')
  })

  it('uses markdown headings for demo sections so outlines stay accurate', () => {
    const componentDir = resolve(docsRoot, 'component')
    const files = readdirSync(componentDir).filter((file) => file.endsWith('.md'))

    for (const file of files) {
      const markdown = readFileSync(resolve(componentDir, file), 'utf8')

      expect(markdown, file).not.toContain('u1-demo-title')
    }
  })

  it('renders a Show code footer for every component demo block', () => {
    const componentDir = resolve(docsRoot, 'component')
    const files = listMarkdownFiles(componentDir)

    for (const file of files) {
      const markdown = readFileSync(file, 'utf8')
      const demoCount = countMatches(markdown, /<div class="u1-demo(?:\s|")/g)

      if (demoCount === 0) {
        continue
      }

      expect(countMatches(markdown, /class="u1-demo__footer"/g), file).toBe(demoCount)
      expect(countMatches(markdown, /<summary>Show code<\/summary>/g), file).toBe(demoCount)
    }
  })

  it('wraps component demos with padded content containers', () => {
    const componentDir = resolve(docsRoot, 'component')
    const files = listMarkdownFiles(componentDir)
    const directComponentPattern = /<div class="u1-demo">\s*<(?!div class="u1-demo(?:__body|-row)"|details class="u1-demo__footer"|\/div)(U1|span|table|script)/g

    for (const file of files) {
      const markdown = readFileSync(file, 'utf8')

      expect(markdown, file).not.toMatch(directComponentPattern)
    }
  })

  it('keeps component navigation limited to developed components and design pages', () => {
    const config = readDocsFile('.vitepress/config.ts')
    const overview = readDocsFile('component/overview.md')
    const index = readDocsFile('index.md')

    expect(config).toContain("text: '基础组件'")
    expect(config).toContain("text: '高级组件'")
    expect(config).toContain("text: '设计分组'")
    expect(config).toContain('/component/design/colors')
    expect(config).toContain('/component/design/icons')
    expect(overview).toContain('设计分组')
    expect(overview).toContain('/component/design/colors')
    expect(overview).toContain('/component/design/icons')
    expect(index).not.toMatch(/表单控件|反馈组件|数据展示组件|导航组件/)
  })

  it('keeps visible keyboard focus for custom radio and checkbox controls', () => {
    const css = readComponentCss()

    expect(css).toContain('.u1-radio__original:focus-visible + .u1-radio__inner')
    expect(css).toContain('.u1-checkbox__original:focus-visible + .u1-checkbox__inner')
  })
})
