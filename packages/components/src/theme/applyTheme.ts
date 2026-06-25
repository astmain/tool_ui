import { u1ThemeTokens } from './tokens'
import type { U1ThemeVars } from './tokens'

export { u1ThemeTokens }

export function applyU1Theme(vars: U1ThemeVars): void {
  if (typeof document === 'undefined') {
    return
  }

  for (const [key, value] of Object.entries(vars)) {
    if (!value) continue
    const token = u1ThemeTokens[key as keyof typeof u1ThemeTokens]
    if (token) {
      document.documentElement.style.setProperty(token.cssVar, value)
    }
  }
}

export function resetU1Theme(): void {
  if (typeof document === 'undefined') {
    return
  }

  for (const token of Object.values(u1ThemeTokens)) {
    document.documentElement.style.removeProperty(token.cssVar)
  }
}
