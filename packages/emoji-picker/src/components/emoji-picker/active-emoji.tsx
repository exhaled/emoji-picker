import { useActiveEmoji } from "../../hooks";
import type { EmojiPickerActiveEmojiProps } from "../../types";

/**
 * Exposes the currently active emoji (either hovered or selected
 * via keyboard navigation) via a render callback.
 *
 * @example
 * ```tsx
 * <EmojiPicker.ActiveEmoji>
 *   {({ emoji }) => <span>{emoji}</span>}
 * </EmojiPicker.ActiveEmoji>
 * ```
 *
 * It can be used to build a preview area next to the list.
 *
 * @example
 * ```tsx
 * <EmojiPicker.ActiveEmoji>
 *   {({ emoji }) => (
 *     <div>
 *       {emoji ? (
 *         <span>{emoji.emoji} {emoji.label}</span>
 *       ) : (
 *         <span>Select an emoji…</span>
 *       )}
 *     </div>
 *   )}
 * </EmojiPicker.ActiveEmoji>
 * ```
 *
 * @see
 * If you prefer to use a hook rather than a component,
 * {@link useActiveEmoji} is also available.
 */
function EmojiPickerActiveEmoji({ children }: EmojiPickerActiveEmojiProps) {
  const activeEmoji = useActiveEmoji();

  return children({ emoji: activeEmoji });
}

export { EmojiPickerActiveEmoji };
