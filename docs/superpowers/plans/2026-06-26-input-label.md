# InputLabel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independent `U1InputLabel` Vue component with label layout, input sizing, readonly and disabled states, and optional eye-button masking.

**Architecture:** Follow the current component package pattern. Keep component logic in `InputLabel.vue`, export from a local `index.ts`, register it in package `index.ts`, style it in the shared stylesheet, and document it in VitePress.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress.

---

### Task 1: Unit Tests

**Files:**
- Create: `packages/components/src/__tests__/input-label.test.ts`

- [ ] **Step 1: Write failing tests**

Cover label rendering, width props, input and change events, disabled and readonly attributes, number filtering, text passthrough, and masked display toggle.

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm vitest run packages/components/src/__tests__/input-label.test.ts`

Expected: fail because `../input-label` does not exist.

### Task 2: Component And Export

**Files:**
- Create: `packages/components/src/input-label/InputLabel.vue`
- Create: `packages/components/src/input-label/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Implement `InputLabel.vue`**

Create a focused Vue component using props, emits, computed input display value, local visibility state for `show`, and numeric normalization for `type="number"`.

- [ ] **Step 2: Export and register**

Export `U1InputLabel` and add it to the plugin component list.

- [ ] **Step 3: Run unit tests**

Run: `pnpm vitest run packages/components/src/__tests__/input-label.test.ts`

Expected: pass.

### Task 3: Styles And Docs

**Files:**
- Modify: `packages/components/src/styles/index.css`
- Create: `docs/component/input-label.md`
- Modify: `docs/.vitepress/config.ts`

- [ ] **Step 1: Add component styles**

Add layout, label, input wrapper, button, focus, disabled, and dark-mode styles.

- [ ] **Step 2: Add VitePress docs**

Document usage and API with live demos.

- [ ] **Step 3: Add sidebar entry**

Add `InputLabel 输入标签` to the basic component sidebar.

### Task 4: Verification

- [ ] **Step 1: Run targeted tests**

Run: `pnpm vitest run packages/components/src/__tests__/input-label.test.ts`

- [ ] **Step 2: Run full checks**

Run: `pnpm test`

Run: `pnpm typecheck`

Run: `pnpm build`
