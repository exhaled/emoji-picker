import { useDeferredValue } from "react";
import type * as EmojiPicker from "./components/emoji-picker";
import {
  $activeEmoji,
  sameEmojiPickerEmoji,
  useEmojiPickerStore,
} from "./store";
import type { Emoji } from "./types";
import { useSelector } from "./utils/store";

/**
 * Returns the currently active emoji (either hovered or selected
 * via keyboard navigation).
 *
 * @example
 * ```tsx
 * const activeEmoji = useActiveEmoji();
 * ```
 *
 * It can be used to build a preview area next to the list.
 *
 * @example
 * ```tsx
 * const activeEmoji = useActiveEmoji();
 *
 * <div>
 *   {activeEmoji ? (
 *     <span>{activeEmoji.emoji} {activeEmoji.label}</span>
 *   ) : (
 *     <span>Select an emoji…</span>
 *   )}
 * </div>
 * ```
 *
 * @see
 * If you prefer to use a component rather than a hook,
 * {@link EmojiPicker.ActiveEmoji|`<EmojiPicker.ActiveEmoji />`} is also available.
 */
export function useActiveEmoji(): Emoji | undefined {
  const store = useEmojiPickerStore();
  const activeEmoji = useSelector(store, $activeEmoji, sameEmojiPickerEmoji);

  return useDeferredValue(activeEmoji);
}
