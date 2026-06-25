import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '..', '..', '..', '..')

function readProjectFile(path: string) {
  return readFileSync(resolve(root, path), 'utf8')
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
    const css = readProjectFile('docs/.vitepress/theme/style.css')

    expect(css).not.toMatch(/\.VPContent\.has-sidebar/)
    expect(css).not.toMatch(/\.VPDoc\.has-aside\s+\.aside/)
    expect(css).not.toMatch(/\.VPDoc\.has-aside\s*>\s*\.container\s*>\s*\.content/)
  })

  it('does not show VitePress heading anchor marks in component docs', () => {
    const css = readProjectFile('docs/.vitepress/theme/style.css')

    expect(css).toMatch(/\.vp-doc\s+\.header-anchor\s*{[^}]*display:\s*none/s)
  })

  it('keeps documented icon mark utility styles available', () => {
    const css = readProjectFile('docs/.vitepress/theme/style.css')
    const icons = readProjectFile('docs/component/design/icons.md')

    expect(icons).toContain('u1-icon-mark is-add')
    expect(icons).toContain('u1-icon-mark is-search')
    expect(css).toMatch(/\.u1-icon-mark\s*{[^}]*display:\s*inline-flex/s)
    expect(css).toMatch(/\.u1-icon-mark\.is-add::before/)
    expect(css).toMatch(/\.u1-icon-mark\.is-search::before/)
  })

  it('disables dialog transform transitions while dragging', () => {
    const css = readProjectFile('packages/components/src/styles/index.css')

    expect(css).toMatch(/\.u1-dialog\.is-dragging\s*{[^}]*transition:\s*none/s)
  })

  it('does not render a dialog open on page load', () => {
    const markdown = readProjectFile('docs/component/dialog.md')

    expect(markdown).not.toContain('<U1Dialog model-value')
    expect(markdown).not.toContain('<U1Dialog :model-value="true"')
  })

  it('uses markdown headings for demo sections so outlines stay accurate', () => {
    const componentDir = resolve(root, 'docs/component')
    const files = readdirSync(componentDir).filter((file) => file.endsWith('.md'))

    for (const file of files) {
      const markdown = readFileSync(resolve(componentDir, file), 'utf8')

      expect(markdown, file).not.toContain('u1-demo-title')
    }
  })

  it('renders a Show code footer for every component demo block', () => {
    const componentDir = resolve(root, 'docs/component')
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
    const componentDir = resolve(root, 'docs/component')
    const files = listMarkdownFiles(componentDir)
    const directComponentPattern = /<div class="u1-demo">\s*<(?!div class="u1-demo(?:__body|-row)"|details class="u1-demo__footer"|\/div)(U1|span|table|script)/g

    for (const file of files) {
      const markdown = readFileSync(file, 'utf8')

      expect(markdown, file).not.toMatch(directComponentPattern)
    }
  })

  it('keeps component navigation limited to developed components and design pages', () => {
    const config = readProjectFile('docs/.vitepress/config.ts')
    const overview = readProjectFile('docs/component/overview.md')
    const index = readProjectFile('docs/index.md')

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
    const css = readProjectFile('packages/components/src/styles/index.css')

    expect(css).toContain('.u1-radio__original:focus-visible + .u1-radio__inner')
    expect(css).toContain('.u1-checkbox__original:focus-visible + .u1-checkbox__inner')
  })
})
