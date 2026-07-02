import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const iconsDir = resolve(__dirname, '..', 'icon', 'icons')

describe('U1Icon source files', () => {
  it('keeps each icon as a directly editable vue svg file', () => {
    const files = readdirSync(iconsDir)
    const source = readFileSync(resolve(iconsDir, 'menu.vue'), 'utf8')

    expect(files).toContain('menu.vue')
    expect(files).toContain('eye-close.vue')
    expect(files).not.toContain('hide.vue')
    expect(files).not.toContain('menu.ts')
    expect(source).toContain('<template>')
    expect(source).toContain('<svg')
    expect(source).toContain('class="u1-icon"')
    expect(source).toContain('stroke="currentColor"')
    expect(source).toContain('viewBox="0 0 24 24"')
    expect(source).toContain('d="M4 6h16M4 12h16M4 18h16"')
  })
})
