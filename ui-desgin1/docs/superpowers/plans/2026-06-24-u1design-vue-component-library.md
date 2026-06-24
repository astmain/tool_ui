# U1Design Vue Component Library Productization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Productize the existing U1Design Vue 3 component library and documentation site so the package APIs, tests, docs, and visible examples agree.

**Architecture:** Keep the current pnpm workspace. Improve component behavior inside `packages/components/src`, keep package exports in `packages/components/src/index.ts`, and make VitePress docs under `docs` the source of truth for examples and API tables.

**Tech Stack:** Vue 3, TypeScript, Vite, VitePress, Vitest, Vue Test Utils, pnpm.

---

## File Structure

- Modify: `packages/components/src/avatar/Avatar.vue`
- Modify: `packages/components/src/__tests__/avatar.test.ts`
- Modify: `packages/components/src/dialog/Dialog.vue`
- Modify: `packages/components/src/__tests__/dialog.test.ts`
- Modify: `packages/components/src/menu/Menu.vue`
- Modify: `packages/components/src/__tests__/menu.test.ts`
- Modify: `packages/components/src/table/Table.vue`
- Modify: `packages/components/src/__tests__/table.test.ts`
- Modify: `docs/index.md`
- Modify: `docs/component/overview.md`
- Modify: `docs/component/*.md`
- Modify: `docs/.vitepress/theme/style.css`
- Modify: `docs/superpowers/specs/2026-06-24-u1design-vue-component-library-design.md`
- Modify: `docs/superpowers/plans/2026-06-24-u1design-vue-component-library.md`

## Task 1: Avatar Fallback Behavior

**Files:**
- Modify: `packages/components/src/avatar/Avatar.vue`
- Modify: `packages/components/src/__tests__/avatar.test.ts`

- [ ] **Step 1: Write failing fallback test**

Add this test case to `packages/components/src/__tests__/avatar.test.ts`:

```ts
it('shows fallback slot when the image fails to load', async () => {
  const wrapper = mount(U1Avatar, {
    props: { src: 'missing.png', alt: 'Missing user' },
    slots: { default: 'MU' }
  })

  await wrapper.find('img').trigger('error')

  expect(wrapper.find('img').exists()).toBe(false)
  expect(wrapper.text()).toContain('MU')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/avatar.test.ts`

Expected: FAIL because the component keeps rendering the broken image after the error event.

- [ ] **Step 3: Implement fallback state**

Update `Avatar.vue` to track image error state and render the slot when `src` is missing or failed:

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'U1Avatar' })

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    size?: 'small' | 'default' | 'large'
    shape?: 'circle' | 'square'
  }>(),
  {
    alt: '',
    size: 'default',
    shape: 'circle'
  }
)

const imageFailed = ref(false)
const shouldShowImage = computed(() => Boolean(props.src) && !imageFailed.value)

watch(
  () => props.src,
  () => {
    imageFailed.value = false
  }
)
</script>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/avatar.test.ts`

Expected: PASS.

## Task 2: Dialog Accessibility

**Files:**
- Modify: `packages/components/src/dialog/Dialog.vue`
- Modify: `packages/components/src/__tests__/dialog.test.ts`

- [ ] **Step 1: Write failing accessibility test**

Add this test case to `packages/components/src/__tests__/dialog.test.ts`:

```ts
it('renders dialog semantics and accessible close button', () => {
  const wrapper = mount(U1Dialog, {
    props: { modelValue: true, title: 'Settings' }
  })

  const dialog = wrapper.find('.u1-dialog')
  expect(dialog.attributes('role')).toBe('dialog')
  expect(dialog.attributes('aria-modal')).toBe('true')
  expect(dialog.attributes('aria-label')).toBe('Settings')
  expect(wrapper.find('.u1-dialog__close').attributes('aria-label')).toBe('Close dialog')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/dialog.test.ts`

Expected: FAIL because role and aria attributes are missing.

- [ ] **Step 3: Add dialog semantics**

Add `role="dialog"`, `aria-modal="true"`, title based `aria-label`, and close button `aria-label="Close dialog"` to `Dialog.vue`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/dialog.test.ts`

Expected: PASS.

## Task 3: Menu Keyboard Behavior

**Files:**
- Modify: `packages/components/src/menu/Menu.vue`
- Modify: `packages/components/src/__tests__/menu.test.ts`

- [ ] **Step 1: Write failing keyboard test**

Add this test case to `packages/components/src/__tests__/menu.test.ts`:

```ts
it('activates enabled menu items with Enter and Space', async () => {
  const wrapper = mount(U1Menu, {
    props: {
      active: 'home',
      items: [
        { key: 'home', label: 'Home' },
        { key: 'docs', label: 'Docs' }
      ]
    }
  })

  const docs = wrapper.findAll('.u1-menu__item')[1]
  await docs.trigger('keydown', { key: 'Enter' })
  await docs.trigger('keydown', { key: ' ' })

  expect(wrapper.emitted('select')).toEqual([['docs'], ['docs']])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/menu.test.ts`

Expected: FAIL because keyboard activation is missing.

- [ ] **Step 3: Add keyboard activation**

Update menu item buttons to handle `keydown.enter.prevent` and `keydown.space.prevent` using the same selection function as click.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/menu.test.ts`

Expected: PASS.

## Task 4: Table Stable Row Keys

**Files:**
- Modify: `packages/components/src/table/Table.vue`
- Modify: `packages/components/src/__tests__/table.test.ts`

- [ ] **Step 1: Write failing row key test**

Add this test case to `packages/components/src/__tests__/table.test.ts`:

```ts
it('uses rowKey to render stable body rows', () => {
  const wrapper = mount(U1Table, {
    props: {
      rowKey: 'id',
      columns: [{ prop: 'name', label: 'Name' }],
      data: [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' }
      ]
    }
  })

  expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  expect(wrapper.text()).toContain('Alice')
  expect(wrapper.text()).toContain('Bob')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/components/src/__tests__/table.test.ts`

Expected: FAIL because `rowKey` is not accepted by the component props.

- [ ] **Step 3: Add rowKey prop**

Add optional `rowKey?: string | ((row: Record<string, unknown>, index: number) => string | number)` to `Table.vue`, then use it to calculate body row keys with index fallback.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/components/src/__tests__/table.test.ts`

Expected: PASS.

## Task 5: Documentation Content Refresh

**Files:**
- Modify: `docs/index.md`
- Modify: `docs/component/overview.md`
- Modify: `docs/component/avatar.md`
- Modify: `docs/component/button.md`
- Modify: `docs/component/card.md`
- Modify: `docs/component/checkbox.md`
- Modify: `docs/component/dialog.md`
- Modify: `docs/component/input.md`
- Modify: `docs/component/menu.md`
- Modify: `docs/component/message.md`
- Modify: `docs/component/radio.md`
- Modify: `docs/component/select.md`
- Modify: `docs/component/switch.md`
- Modify: `docs/component/table.md`
- Modify: `docs/component/tag.md`

- [ ] **Step 1: Update home and overview copy**

Rewrite stale status text so it names all current components and does not describe the earlier limited component set.

- [ ] **Step 2: Normalize component page structure**

Ensure every component page has these sections:

```md
# ComponentName ChineseName

Short purpose text.

## Basic Usage

Demo block.

## API

Props table.

## Events

Events table when events exist.

## Slots

Slots table when slots exist.
```

- [ ] **Step 3: Keep interactive docs interactive**

Pages for Input, Radio, Checkbox, Select, Switch, Dialog, Menu, and Table should keep `<script setup>` state where needed.

- [ ] **Step 4: Run docs build**

Run: `pnpm --filter docs build`

Expected: PASS.

## Task 6: Documentation Layout Polish

**Files:**
- Modify: `docs/.vitepress/theme/style.css`

- [ ] **Step 1: Add responsive demo guards**

Ensure demo rows can wrap, code blocks do not force horizontal page overflow, and component item cards become full width on small screens.

- [ ] **Step 2: Add accessible focus states**

Add visible focus styles for demo links, component overview links, and interactive controls inside demos without removing existing component styles.

- [ ] **Step 3: Run docs build**

Run: `pnpm --filter docs build`

Expected: PASS.

## Task 7: Final Verification

**Files:**
- Modify only if verification reveals issues.

- [ ] **Step 1: Run component tests**

Run: `pnpm test`

Expected: all test files pass.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`

Expected: exits with code 0.

- [ ] **Step 3: Run full build**

Run: `pnpm build`

Expected: component package and documentation site both build successfully.

- [ ] **Step 4: Run local docs server**

Run: `pnpm dev`

Expected: VitePress serves at a local 127.0.0.1 URL.

- [ ] **Step 5: Browser check**

Open the docs home, overview, Button, Input, Dialog, Menu, and Table pages. Check desktop and narrow viewport rendering, then fix visible overflow or broken demos.

## Self Review

- Spec coverage: The plan covers component behavior, accessibility, docs refresh, layout polish, and final verification.
- Placeholder scan: The plan has no `TBD`, `TODO`, `implement later`, or `fill in details` text.
- Type consistency: Component names, paths, and commands match the current workspace.
