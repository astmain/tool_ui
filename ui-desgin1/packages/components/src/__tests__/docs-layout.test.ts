import { existsSync, readdirSync, readFileSync } from 'node:fs'
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

  it('keeps style design pages available from the component sidebar', () => {
    const config = readProjectFile('docs/.vitepress/config.ts')

    expect(config).toContain("text: '风格设计'")
    expect(config).toContain("link: '/component/design/colors'")
    expect(config).toContain("link: '/component/design/icons'")
    expect(existsSync(resolve(root, 'docs/component/design/colors.md'))).toBe(true)
    expect(existsSync(resolve(root, 'docs/component/design/icons.md'))).toBe(true)
  })

  it('uses Show code demos for global style design pages', () => {
    const files = [
      'docs/component/design/colors.md',
      'docs/component/design/icons.md'
    ]

    for (const file of files) {
      const markdown = readProjectFile(file)
      const demoCount = countMatches(markdown, /<div class="u1-demo(?:\s|")/g)

      expect(demoCount, file).toBeGreaterThan(0)
      expect(countMatches(markdown, /class="u1-demo__footer"/g), file).toBe(demoCount)
      expect(countMatches(markdown, /<summary>Show code<\/summary>/g), file).toBe(demoCount)
    }
  })

  it('keeps visible keyboard focus for custom radio and checkbox controls', () => {
    const css = readProjectFile('packages/components/src/styles/index.css')

    expect(css).toContain('.u1-radio__original:focus-visible + .u1-radio__inner')
    expect(css).toContain('.u1-checkbox__original:focus-visible + .u1-checkbox__inner')
  })
})
