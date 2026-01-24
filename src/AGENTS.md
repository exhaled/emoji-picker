Emoji picker architecture guide

Overview
- Public API lives in `src/components/emoji-picker.tsx` and re-exports subcomponents under `EmojiPicker.*`.
- State is centralized in `src/store.ts` via a tiny batched store from `src/utils/store.tsx`.
- Emoji data is fetched and normalized in `src/data/emoji.ts`, then shaped for rendering in `src/data/emoji-picker.ts`.
- UI is split into focused parts in `src/components/emoji-picker/`.

Data and state flow
- `EmojiPicker.Root` creates the store with validated props (locale, columns, skin tone, sticky) and provides it via context.
- `EmojiPicker.Root` mounts `EmojiPickerDataHandler`, which fetches emoji data with `getEmojiData` and then, during idle time, computes list data with `getEmojiPickerData` (search + skin tone + chunking).
- `getEmojiData` uses localStorage and sessionStorage as caches, validates with `src/utils/validate.ts`, and filters unsupported emojis based on detected platform support.
- The store exposes selectors for derived UI state (active emoji, loading, empty, row counts) used by list, viewport, and status components.

Rendering and virtualization
- `EmojiPicker.Viewport` tracks size changes via `ResizeObserver` and feeds `viewportWidth`/`viewportHeight` back to the store.
- `EmojiPicker.List` renders only visible rows (based on `viewportStartRowIndex` and `viewportEndRowIndex`) and uses sizer elements to measure row and header heights.
- The store computes visible rows with overscan and accounts for sticky category headers while scrolling.
- CSS custom properties set on the root (`--frimousse-*`) allow layout to be driven by measured sizes without reflow-heavy recalculations.

Interaction model
- Search input updates `store.search` and toggles interaction mode (`keyboard` vs `none`).
- Pointer hover sets the active emoji; keyboard arrows move the active cell, and Enter selects it.
- When keyboard interaction changes the active row, the list scrolls the row into view while respecting sticky headers and scroll margins.

Component map
- `src/components/emoji-picker/root.tsx`: store creation, data loading, focus/keyboard handlers, CSS var sync.
- `src/components/emoji-picker/search.tsx`: controlled/uncontrolled search input wiring.
- `src/components/emoji-picker/viewport.tsx`: scroll container, ResizeObserver, live announcer.
- `src/components/emoji-picker/list.tsx`: grid rendering, row/category sizers, emoji item wiring.
- `src/components/emoji-picker/status.tsx`: loading/empty states.
- `src/components/emoji-picker/active-emoji.tsx`: render-prop helper for active emoji.
- `src/components/emoji-picker/skin-tone.tsx`: render-prop helper and cycling selector button.

Utilities and why they exist
- `src/utils/store.tsx`: small store with batched updates (requestAnimationFrame), selectors, and context wiring.
- `src/utils/use-stable-callback.ts`: stable callback identity with latest implementation (avoids stale closures).
- `src/utils/use-layout-effect.ts`: safe layout effect for SSR (falls back to useEffect).
- `src/utils/request-idle-callback.ts`: idle callback shim for browsers without native support.
- `src/utils/compare.ts`: shallow comparison for selector memoization.
- `src/utils/validate.ts`: strict internal validators used for cached data hydration.
- `src/utils/storage.ts`: JSON storage helpers with validation and null-on-failure behavior.
- `src/utils/chunk.ts`: fixed-size chunking used to build rows from flat emoji lists.
- `src/utils/is-emoji-supported.ts`: canvas-based detection for emoji support and ZWJ behavior.
- `src/utils/get-skin-tone-variations.ts`: generates skin tone variants for a base emoji.
- `src/utils/format-as-shortcode.ts`: converts emoji labels into :shortcode: format.
- `src/utils/range.ts`: inclusive numeric range helper.
- `src/utils/capitalize.ts`: title-cases labels and category names.
- `src/utils/noop.ts`: default no-op handlers for optional callbacks.

Key invariants to preserve
- Store updates must stay batched; avoid synchronous state churn from render paths.
- `getEmojiPickerData` must keep category boundaries and row indices stable for virtualization.
- Resize observers in viewport/list sizers must run before computing viewport ranges.
- Keyboard navigation should always align active row into view without breaking sticky headers.
