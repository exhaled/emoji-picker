# Emoji Picker

Fork of [Frimousse](https://github.com/liveblocks/frimousse) with support for custom emojis and category navigation.

## Installation

```bash
bun add @exhaled/emoji-picker
```

## Usage

Import the `EmojiPicker` parts and create your own component by composing them.

```tsx
import { EmojiPicker } from "@exhaled/emoji-picker";

export function MyEmojiPicker() {
  return (
    <EmojiPicker.Root>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
        <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
}
```

Apart from a few sizing and overflow defaults, the parts don’t have any styles out-of-the-box. Being composable, you can bring your own styles and apply them however you want: [Tailwind CSS](https://tailwindcss.com/), CSS-in-JS, vanilla CSS via inline styles, classes, or by targeting the `[frimousse-*]` attributes present on each part.

You might want to use it in a popover rather than on its own. This package only provides the emoji picker itself so if you don’t have a popover component in your app yet, there are several libraries available: [Radix UI](https://www.radix-ui.com/primitives/docs/components/popover), [Base UI](https://base-ui.com/react/components/popover), [Headless UI](https://headlessui.com/react/popover), and [React Aria](https://react-spectrum.adobe.com/react-aria/Popover.html), to name a few.

## Compatibility

- React 18 and 19
- TypeScript 5.1 and above

## Credits

The emoji data is based on [Emojibase](https://emojibase.dev/).
This fork is based on [Frimousse](https://github.com/liveblocks/frimousse).

### Development

Install dependencies and start development builds from the root.

```bash
bun install
bun run dev
```

The demo site runs alongside the package build when you start development from the root.

### Tests

The package has 95%+ test coverage with [Vitest](https://vitest.dev/). Some tests use Vitest’s [browser mode](https://vitest.dev/guide/browser-testing) with [Playwright](https://playwright.dev/), make sure to install the required browser first.

```bash
bunx playwright install chromium
```

Run the tests.

```bash
bun run test -- --filter=@exhaled/emoji-picker
cd packages/emoji-picker && bun run test:coverage
```

### Releases

Releases are triggered from [a GitHub action](.github/workflows/release.yml) via [release-it](https://github.com/release-it/release-it), and continuous releases are automatically triggered for every commit in PRs via [pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new).
