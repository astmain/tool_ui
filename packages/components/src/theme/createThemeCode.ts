import { u1ThemeTokens } from './tokens'
import type { U1ThemeVars } from './tokens'

export function createU1ThemeCode(vars: U1ThemeVars): string {
  const entries = Object.entries(vars).filter(([, value]) => value !== '' && value !== undefined)

  const body = entries
    .map(([key, value]) => `  ${key}: '${value}'`)
    .join(',\n')

  return [
    `import { applyU1Theme } from 'tool_ui1/theme'`,
    ``,
    `applyU1Theme({`,
    body,
    `})`
  ].join('\n')
}
