import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '..', '..', '..', '..')

function readProjectFile(path: string) {
  return readFileSync(resolve(root, path), 'utf8')
}

describe('docs layout regressions', () => {
  it('does not override VitePress shell layout primitives', () => {
    const css = readProjectFile('docs/.vitepress/theme/style.css')

    expect(css).not.toMatch(/\.VPContent\.has-sidebar/)
    expect(css).not.toMatch(/\.VPDoc\.has-aside\s+\.aside/)
    expect(css).not.toMatch(/\.VPDoc\.has-aside\s*>\s*\.container\s*>\s*\.content/)
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
})
