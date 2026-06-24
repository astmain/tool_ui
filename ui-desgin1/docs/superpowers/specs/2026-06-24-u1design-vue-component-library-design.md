# U1Design Vue Component Library Productization Design

## Goal

Complete U1Design as a usable Vue 3 component library product, not only as a buildable code sample. The work should improve the component package and the VitePress documentation site together.

The package name remains `@u1design/vue`. The current source already contains these public components:

- `U1Avatar`
- `U1Button`
- `U1Card`
- `U1Checkbox`
- `U1CheckboxGroup`
- `U1Dialog`
- `U1Input`
- `U1Menu`
- `U1Message`
- `U1Radio`
- `U1RadioGroup`
- `U1Select`
- `U1Switch`
- `U1Table`
- `U1Tag`

## Product Direction

U1Design should feel like a small Element Plus style component library with clear Chinese documentation, predictable Vue APIs, and working examples. The visual language should remain restrained, practical, and documentation first.

The product should not become a custom app builder or a marketing landing page in this phase. The first screen stays a documentation entry point. Component demos and API references are the main product experience.

## Technical Approach

Use the existing monorepo structure.

- `packages/components` owns Vue component source, shared styles, package exports, tests, and build config.
- `docs` owns the VitePress documentation site.
- The docs app imports `@u1design/vue` from the workspace package.
- The component package builds library output under `packages/components/dist`.

The implementation should continue to use Vue 3, TypeScript, Vite, VitePress, Vitest, and Vue Test Utils.

## Component Standards

Every public component should satisfy the same baseline.

- Has a stable `name` for plugin registration.
- Exports from its local `index.ts`.
- Exports from `packages/components/src/index.ts`.
- Uses the `u1-` CSS class prefix.
- Supports disabled state when the control is interactive.
- Emits Vue model updates consistently for model driven controls.
- Has tests for primary rendering, state, events, and disabled behavior.
- Has a documentation page with demos and an API table.

## Component Scope

### Basic Components

`U1Button` should support type, size, disabled, loading, plain, round, circle, dashed, text, link, background text, icon, and button group usage.

`U1Input` should support `v-model`, placeholder, disabled, clearable, password visibility, and emitted clear events.

`U1Radio` and `U1RadioGroup` should support standalone selection, grouped selection, disabled state, and labels.

`U1Checkbox` and `U1CheckboxGroup` should support boolean mode, value mode, grouped selection, disabled state, indeterminate state, and custom true or false values.

`U1Select` should support `v-model`, option lists, placeholder, disabled state, and empty option state.

`U1Switch` should support `v-model`, disabled state, active text, and inactive text.

`U1Avatar` should support image source, alt text, size, shape, fallback slot, and missing image fallback.

`U1Tag` should support type, effect, close button, close event, and slot content.

### Feedback And Data Components

`U1Message` should support type, message content, close button, and close event. It can remain an inline component in this phase. Programmatic message service is out of scope.

`U1Dialog` should support `v-model`, title, width, close button, overlay click close behavior, default slot, footer slot, and accessible dialog semantics.

`U1Table` should support column definitions, row data, empty state, bordered style, striped style, and stable key rendering.

`U1Menu` should support vertical and horizontal display, active item, disabled item, item click events, and basic keyboard focus behavior.

`U1Card` should support header, default body, footer, and shadow modes.

## Documentation Standards

The documentation site should be the source of truth for the component library.

- Home page explains what U1Design is, how to install it, and how to use it.
- Component overview lists only real component pages as developed.
- Sidebar labels are readable Chinese text.
- Each component page includes at least one interactive demo when the component has user input.
- Each component page includes an API table for props, events, and slots where applicable.
- Code examples should match the current component APIs.
- The docs should avoid stale status text from the earlier four component version.

## Visual And UX Standards

The documentation experience should remain close to Element Plus style without copying its internals.

- Use a clean documentation layout with top navigation, left sidebar, main content, and page outline.
- Keep component demos framed and scannable.
- Use flex layouts with `gap` for demo rows and component grids.
- Avoid card nesting in documentation sections.
- Keep typography practical and readable.
- Keep light and dark mode readable.
- Keep mobile pages free from horizontal overflow.

## Accessibility Standards

Interactive components should support the basics.

- Native controls should keep native semantics where possible.
- Disabled controls should set semantic disabled attributes.
- Dialog should expose role and modal state.
- Close buttons should have accessible labels.
- Menu items should be focusable buttons and mark disabled items.
- Form controls should remain keyboard operable.

## Testing

Tests should keep the current successful baseline and expand where behavior is missing.

- Component unit tests use Vitest and Vue Test Utils.
- New or changed behavior must have a failing test before implementation.
- Documentation build is part of final verification.
- Browser verification should cover the docs home, overview, and representative component pages.

## Build And Verification

The implementation is complete when these checks pass.

- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
- Local documentation site renders and component demos are interactive.
- Browser check confirms desktop and narrow viewport layouts do not overlap or overflow.

## Out Of Scope

The following work is intentionally excluded from this phase.

- Programmatic global message service.
- Popper based dropdown positioning.
- Form validation framework.
- Tree, pagination, tabs, drawer, tooltip, upload, date picker, and other new component families.
- Theme generator or design token editor.
- Publishing to npm.
