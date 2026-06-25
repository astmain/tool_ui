export interface ThemeToken {
  cssVar: string
  defaultValue: string
}

export interface U1ThemeTokens {
  primary: ThemeToken
  success: ThemeToken
  warning: ThemeToken
  danger: ThemeToken
  info: ThemeToken
  text: ThemeToken
  textRegular: ThemeToken
  border: ThemeToken
  borderLight: ThemeToken
  background: ThemeToken
  radiusBase: ThemeToken
  shadowLight: ThemeToken
  shadowFocus: ThemeToken
}

export type U1ThemeVars = Partial<Record<keyof U1ThemeTokens, string>>

const tokens: U1ThemeTokens = {
  primary: { cssVar: '--u1-color-primary', defaultValue: '#409eff' },
  success: { cssVar: '--u1-color-success', defaultValue: '#67c23a' },
  warning: { cssVar: '--u1-color-warning', defaultValue: '#e6a23c' },
  danger: { cssVar: '--u1-color-danger', defaultValue: '#f56c6c' },
  info: { cssVar: '--u1-color-info', defaultValue: '#909399' },
  text: { cssVar: '--u1-color-text', defaultValue: '#303133' },
  textRegular: { cssVar: '--u1-color-text-regular', defaultValue: '#606266' },
  border: { cssVar: '--u1-color-border', defaultValue: '#dcdfe6' },
  borderLight: { cssVar: '--u1-color-border-light', defaultValue: '#e4e7ed' },
  background: { cssVar: '--u1-color-bg', defaultValue: '#ffffff' },
  radiusBase: { cssVar: '--u1-radius-base', defaultValue: '4px' },
  shadowLight: { cssVar: '--u1-shadow-light', defaultValue: '0 4px 12px rgb(31 45 61 / 8%)' },
  shadowFocus: { cssVar: '--u1-shadow-focus', defaultValue: '0 0 0 3px rgb(64 158 255 / 18%)' }
}

export { tokens as u1ThemeTokens }
