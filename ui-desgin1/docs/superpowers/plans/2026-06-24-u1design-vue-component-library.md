# U1Design Vue Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build U1Design as a Vue 3 component library package and Element Plus style documentation site.

**Architecture:** Create a pnpm workspace with one component package and one VitePress documentation app. The component package owns Vue components, styles, install entry, and tests. The docs app imports the local package and renders overview plus pages for Button, Input, Radio, and Card.

**Tech Stack:** Vue 3, TypeScript, Vite, VitePress, Vitest, Vue Test Utils, pnpm.

---

## File Structure

- Create: `package.json` for workspace scripts.
- Create: `pnpm-workspace.yaml` for workspace package discovery.
- Create: `tsconfig.json` for shared TypeScript settings.
- Create: `vitest.config.ts` for component test setup.
- Create: `packages/components/package.json` for `@u1design/vue`.
- Create: `packages/components/src/index.ts` for exports and Vue plugin install.
- Create: `packages/components/src/styles/index.css` for design tokens and component styles.
- Create: `packages/components/src/button/*` for `U1Button`.
- Create: `packages/components/src/input/*` for `U1Input`.
- Create: `packages/components/src/radio/*` for `U1Radio` and `U1RadioGroup`.
- Create: `packages/components/src/card/*` for `U1Card`.
- Create: `packages/components/src/__tests__/*` for behavior tests.
- Create: `docs/package.json` for docs scripts.
- Create: `docs/.vitepress/config.ts` for VitePress navigation and sidebar.
- Create: `docs/.vitepress/theme/index.ts` and `docs/.vitepress/theme/style.css` for local component registration and Element Plus style polish.
- Create: `docs/index.md`, `docs/component/overview.md`, and component docs pages.

## Task 1: Workspace Scaffold

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `packages/components/package.json`
- Create: `docs/package.json`

- [ ] **Step 1: Create package manifests**

Root `package.json`:

```json
{
  "name": "u1design-workspace",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm --filter docs dev",
    "build": "pnpm --filter @u1design/vue build && pnpm --filter docs build",
    "test": "vitest run",
    "typecheck": "vue-tsc --noEmit"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.4",
    "@vue/test-utils": "^2.4.6",
    "vite": "^6.3.5",
    "vitepress": "^1.6.3",
    "vitest": "^3.2.4",
    "vue": "^3.5.17",
    "vue-tsc": "^2.2.10",
    "typescript": "^5.8.3"
  }
}
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
  - "docs"
```

`packages/components/package.json`:

```json
{
  "name": "@u1design/vue",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/u1design.umd.cjs",
  "module": "dist/u1design.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/u1design.js"
    },
    "./style.css": "./dist/style.css"
  },
  "files": ["dist"],
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "scripts": {
    "build": "vite build --config vite.config.ts"
  }
}
```

- [ ] **Step 2: Add TypeScript and test config**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "paths": {
      "@u1design/vue": ["./packages/components/src/index.ts"]
    }
  },
  "include": ["packages", "docs", "vitest.config.ts"]
}
```

`vitest.config.ts`:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/components/src/**/*.test.ts']
  }
})
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`

Expected: lockfile is created and install exits with code 0.

## Task 2: Component Package Build Setup

**Files:**
- Create: `packages/components/vite.config.ts`
- Create: `packages/components/src/index.ts`
- Create: `packages/components/src/styles/index.css`

- [ ] **Step 1: Create failing install/export test**

Create `packages/components/src/__tests__/install.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import U1Design, { U1Button, U1Card, U1Input, U1Radio, U1RadioGroup } from '../index'

describe('U1Design plugin', () => {
  it('exports components and installs them globally', () => {
    const app = createApp({})

    app.use(U1Design)

    expect(U1Button.name).toBe('U1Button')
    expect(U1Input.name).toBe('U1Input')
    expect(U1Radio.name).toBe('U1Radio')
    expect(U1RadioGroup.name).toBe('U1RadioGroup')
    expect(U1Card.name).toBe('U1Card')
    expect(app.component('U1Button')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/install.test.ts`

Expected: FAIL because `../index` and components do not exist yet.

- [ ] **Step 3: Add package entry and build config**

Create `packages/components/vite.config.ts`:

```ts
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'U1Design',
      fileName: 'u1design'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

Create `packages/components/src/index.ts` after component files exist in later tasks:

```ts
import type { App, Plugin } from 'vue'
import './styles/index.css'
import { U1Button } from './button'
import { U1Card } from './card'
import { U1Input } from './input'
import { U1Radio, U1RadioGroup } from './radio'

const components = [U1Button, U1Input, U1Radio, U1RadioGroup, U1Card]

const U1Design: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name as string, component)
    })
  }
}

export { U1Button, U1Input, U1Radio, U1RadioGroup, U1Card }
export default U1Design
```

- [ ] **Step 4: Add shared styles**

Create `packages/components/src/styles/index.css` with U1Design tokens and classes for `.u1-button`, `.u1-input`, `.u1-radio`, and `.u1-card`.

- [ ] **Step 5: Run test**

Run: `pnpm test packages/components/src/__tests__/install.test.ts`

Expected: PASS after component tasks provide exports.

## Task 3: U1Button

**Files:**
- Create: `packages/components/src/button/Button.vue`
- Create: `packages/components/src/button/index.ts`
- Create: `packages/components/src/__tests__/button.test.ts`

- [ ] **Step 1: Write failing tests**

Create `packages/components/src/__tests__/button.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { U1Button } from '../button'

describe('U1Button', () => {
  it('renders default slot and variant class', () => {
    const wrapper = mount(U1Button, {
      props: { type: 'primary' },
      slots: { default: 'Save' }
    })

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('u1-button')
    expect(wrapper.classes()).toContain('u1-button--primary')
  })

  it('renders disabled and loading states', () => {
    const wrapper = mount(U1Button, {
      props: { disabled: true, loading: true },
      slots: { default: 'Submit' }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.text()).toContain('Submit')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/button.test.ts`

Expected: FAIL because `../button` does not exist.

- [ ] **Step 3: Implement U1Button**

Create `packages/components/src/button/Button.vue` with props `type`, `size`, `disabled`, `loading`, `plain`, `round`, and `circle`.

Create `packages/components/src/button/index.ts`:

```ts
import Button from './Button.vue'

export const U1Button = Button
export default U1Button
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/button.test.ts`

Expected: PASS.

## Task 4: U1Input

**Files:**
- Create: `packages/components/src/input/Input.vue`
- Create: `packages/components/src/input/index.ts`
- Create: `packages/components/src/__tests__/input.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests for rendering placeholder, emitting `update:modelValue`, clearing value, password type, and disabled state.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/input.test.ts`

Expected: FAIL because `../input` does not exist.

- [ ] **Step 3: Implement U1Input**

Create `Input.vue` with props `modelValue`, `placeholder`, `disabled`, `clearable`, `showPassword`, and emits `update:modelValue`, `clear`.

Create `packages/components/src/input/index.ts`:

```ts
import Input from './Input.vue'

export const U1Input = Input
export default U1Input
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/input.test.ts`

Expected: PASS.

## Task 5: U1Radio And U1RadioGroup

**Files:**
- Create: `packages/components/src/radio/Radio.vue`
- Create: `packages/components/src/radio/RadioGroup.vue`
- Create: `packages/components/src/radio/index.ts`
- Create: `packages/components/src/__tests__/radio.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests for standalone radio `v-model`, disabled state, and grouped selection.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/radio.test.ts`

Expected: FAIL because `../radio` does not exist.

- [ ] **Step 3: Implement radio components**

`U1Radio` accepts `modelValue`, `label`, `disabled`, and emits `update:modelValue`.

`U1RadioGroup` provides current value, disabled state, and a change function through Vue provide and inject.

Create `packages/components/src/radio/index.ts`:

```ts
import Radio from './Radio.vue'
import RadioGroup from './RadioGroup.vue'

export const U1Radio = Radio
export const U1RadioGroup = RadioGroup
export default U1Radio
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/radio.test.ts`

Expected: PASS.

## Task 6: U1Card

**Files:**
- Create: `packages/components/src/card/Card.vue`
- Create: `packages/components/src/card/index.ts`
- Create: `packages/components/src/__tests__/card.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests for header slot, default slot, footer slot, and shadow class.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/card.test.ts`

Expected: FAIL because `../card` does not exist.

- [ ] **Step 3: Implement U1Card**

Create `Card.vue` with prop `shadow` and slots `header`, `default`, and `footer`.

Create `packages/components/src/card/index.ts`:

```ts
import Card from './Card.vue'

export const U1Card = Card
export default U1Card
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/card.test.ts`

Expected: PASS.

## Task 7: Documentation Site

**Files:**
- Create: `docs/.vitepress/config.ts`
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/style.css`
- Create: `docs/index.md`
- Create: `docs/component/overview.md`
- Create: `docs/component/button.md`
- Create: `docs/component/input.md`
- Create: `docs/component/radio.md`
- Create: `docs/component/card.md`

- [ ] **Step 1: Configure VitePress**

Create navigation with brand `U1Design`, guide link, component overview link, and sidebar categories matching the design spec.

- [ ] **Step 2: Register package in docs theme**

Import `@u1design/vue` and `@u1design/vue/style.css`, then call `app.use(U1Design)`.

- [ ] **Step 3: Write docs pages**

Create home, overview, and four component pages. Overview lists developed items with `已开发` text and planned items with `未开发` text.

- [ ] **Step 4: Run docs locally**

Run: `pnpm dev`

Expected: VitePress serves the docs site and renders navigation.

## Task 8: Final Verification

**Files:**
- Modify files only if verification reveals issues.

- [ ] **Step 1: Run tests**

Run: `pnpm test`

Expected: all component tests pass.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`

Expected: exits with code 0.

- [ ] **Step 3: Run build**

Run: `pnpm build`

Expected: component package and docs build both exit with code 0.

- [ ] **Step 4: Browser verification**

Open local docs URL from `pnpm dev`, verify overview plus Button, Input, Radio, and Card pages render, and verify component demos are interactive.

