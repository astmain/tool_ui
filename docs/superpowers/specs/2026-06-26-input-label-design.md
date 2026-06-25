# InputLabel Component Design

## Goal

Add an independent `U1InputLabel` component for a label and single-line input layout.

## Component API

- `modelValue`: input value, supports `string` and `number`.
- `label`: label text.
- `labelWidth`: label width, default `80px`.
- `labelPosition`: label text alignment, supports `left` and `right`, default `right`.
- `inputWidth`: input width, default `220px`.
- `placeholder`: input placeholder, default empty string.
- `disabled`: disable input and visibility button, default `false`.
- `readonly`: set input readonly, default `false`.
- `type`: input type, supports `text` and `number`, default `text`. `text` accepts any text. `number` keeps only numeric characters in the input value and emitted payload.
- `show`: enable masked display and eye button, default `false`.

## Behavior

When `show` is `false`, the component behaves like a normal text or number input.

When `show` is `true`, the component starts in hidden mode. Hidden mode displays `***` in the input and keeps the real `modelValue` in component state through props and emitted events. Clicking the eye button toggles visible mode. Visible mode displays the real value.

Typing while hidden replaces the value with the typed text. The mask only controls display, not the emitted payload.

The component emits `update:modelValue` on input and emits `change` on native change.

For `type="number"`, input and change values are normalized by removing non-numeric characters before rendering and emitting.

## Files

- Create `packages/components/src/input-label/InputLabel.vue`.
- Create `packages/components/src/input-label/index.ts`.
- Modify `packages/components/src/index.ts`.
- Modify `packages/components/src/styles/index.css`.
- Add `packages/components/src/__tests__/input-label.test.ts`.
- Add `docs/component/input-label.md`.
- Modify `docs/.vitepress/config.ts`.

## Testing

Add unit tests for rendering, width styles, update events, change events, disabled and readonly behavior, and show toggle behavior.
