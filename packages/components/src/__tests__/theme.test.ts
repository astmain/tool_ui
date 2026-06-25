import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import {
  u1ThemeTokens,
  applyU1Theme,
  resetU1Theme,
  createU1ThemeCode
} from '../theme'

describe('u1ThemeTokens', () => {
  it('has correct default color tokens', () => {
    expect(u1ThemeTokens.primary.defaultValue).toBe('#409eff')
    expect(u1ThemeTokens.success.defaultValue).toBe('#67c23a')
    expect(u1ThemeTokens.warning.defaultValue).toBe('#e6a23c')
    expect(u1ThemeTokens.danger.defaultValue).toBe('#f56c6c')
    expect(u1ThemeTokens.info.defaultValue).toBe('#909399')
    expect(u1ThemeTokens.text.defaultValue).toBe('#303133')
    expect(u1ThemeTokens.textRegular.defaultValue).toBe('#606266')
    expect(u1ThemeTokens.border.defaultValue).toBe('#dcdfe6')
    expect(u1ThemeTokens.borderLight.defaultValue).toBe('#e4e7ed')
    expect(u1ThemeTokens.background.defaultValue).toBe('#ffffff')
  })

  it('has correct size tokens', () => {
    expect(u1ThemeTokens.radiusBase.defaultValue).toBe('4px')
  })

  it('has correct shadow tokens', () => {
    expect(u1ThemeTokens.shadowLight.defaultValue).toBe('0 4px 12px rgb(31 45 61 / 8%)')
    expect(u1ThemeTokens.shadowFocus.defaultValue).toBe('0 0 0 3px rgb(64 158 255 / 18%)')
  })

  it('each token has cssVar property', () => {
    for (const token of Object.values(u1ThemeTokens)) {
      expect(token.cssVar).toMatch(/^--u1-/)
      expect(typeof token.cssVar).toBe('string')
      expect(typeof token.defaultValue).toBe('string')
    }
  })
})

describe('applyU1Theme', () => {
  beforeEach(() => {
    resetU1Theme()
  })

  afterEach(() => {
    resetU1Theme()
  })

  it('writes CSS variables to document.documentElement', () => {
    applyU1Theme({ primary: '#ff0000' })
    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('#ff0000')
  })

  it('writes multiple tokens at once', () => {
    applyU1Theme({
      primary: '#ff0000',
      success: '#00ff00',
      radiusBase: '8px'
    })
    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('#ff0000')
    expect(document.documentElement.style.getPropertyValue('--u1-color-success')).toBe('#00ff00')
    expect(document.documentElement.style.getPropertyValue('--u1-radius-base')).toBe('8px')
  })

  it('does not write empty values', () => {
    applyU1Theme({ primary: '' })
    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('')
  })

  it('accepts rgb and oklch color functions', () => {
    applyU1Theme({ primary: 'rgb(255, 0, 0)' })
    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('rgb(255, 0, 0)')
    applyU1Theme({ primary: 'oklch(59% 0.15 120' })
    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('oklch(59% 0.15 120')
  })

  it('returns early when document is unavailable (SSR guard)', () => {
    const originalDocument = globalThis.document
    // @ts-expect-error
    delete globalThis.document
    expect(() => applyU1Theme({ primary: '#ff0000' })).not.toThrow()
    globalThis.document = originalDocument
  })
})

describe('resetU1Theme', () => {
  beforeEach(() => {
    resetU1Theme()
  })

  afterEach(() => {
    resetU1Theme()
  })

  it('removes all theme inline styles from documentElement', () => {
    applyU1Theme({ primary: '#ff0000', success: '#00ff00', radiusBase: '8px' })
    resetU1Theme()
    expect(document.documentElement.style.getPropertyValue('--u1-color-primary')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--u1-color-success')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--u1-radius-base')).toBe('')
  })

  it('does not affect other inline styles on documentElement', () => {
    document.documentElement.style.setProperty('color', 'red')
    applyU1Theme({ primary: '#ff0000' })
    resetU1Theme()
    expect(document.documentElement.style.getPropertyValue('color')).toBe('red')
  })
})

describe('createU1ThemeCode', () => {
  it('generates complete JS code with all tokens', () => {
    const code = createU1ThemeCode({
      primary: '#1677ff',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
      info: '#1677ff',
      text: '#1f2937',
      textRegular: '#4b5563',
      border: '#d1d5db',
      borderLight: '#e5e7eb',
      background: '#ffffff',
      radiusBase: '8px',
      shadowLight: '0 6px 18px rgb(15 23 42 / 10%)',
      shadowFocus: '0 0 0 3px rgb(22 119 255 / 20%)'
    })
    expect(code).toContain("import { applyU1Theme } from 'tool_ui1/theme'")
    expect(code).toContain('primary: \'#1677ff\'')
    expect(code).toContain('success: \'#52c41a\'')
    expect(code).toContain('radiusBase: \'8px\'')
    expect(code).toContain('applyU1Theme({')
  })

  it('does not include empty values in generated code', () => {
    const code = createU1ThemeCode({ primary: '', success: '#52c41a' })
    expect(code).toContain('success: \'#52c41a\'')
    expect(code).not.toContain('primary:')
  })

  it('generates code that is a valid applyU1Theme call', () => {
    const code = createU1ThemeCode({ primary: '#1677ff', radiusBase: '8px' })
    expect(code).toContain("import { applyU1Theme } from 'tool_ui1/theme'")
    expect(code).toContain('applyU1Theme({')
    expect(code).toContain('})')
  })
})
