import {
  forwardRef,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useMemo,
} from "react";
import { useSkinTone } from "../../hooks";
import { $skinTones, useEmojiPickerStore } from "../../store";
import type {
  EmojiPickerSkinToneProps,
  EmojiPickerSkinToneSelectorProps,
} from "../../types";
import { shallow } from "../../utils/compare";
import { useSelector } from "../../utils/store";

/**
 * A button to change the current skin tone by cycling through the
 * available skin tones.
 *
 * @example
 * ```tsx
 * <EmojiPicker.SkinToneSelector />
 * ```
 *
 * The emoji used as visual can be customized (by default, ✋).
 *
 * @example
 * ```tsx
 * <EmojiPicker.SkinToneSelector emoji="👋" />
 * ```
 *
 * @see
 * If you want to build a custom skin tone selector, you can use the
 * {@link EmojiPickerSkinTone|`<EmojiPicker.SkinTone />`} component or
 * {@link useSkinTone|`useSkinTone`} hook.
 */
const EmojiPickerSkinToneSelector = forwardRef<
  HTMLButtonElement,
  EmojiPickerSkinToneSelectorProps
>(
  (
    { emoji, onClick, "aria-label": ariaLabel = "Change skin tone", ...props },
    forwardedRef,
  ) => {
    const store = useEmojiPickerStore();
    const skinTones = useSelector(store, $skinTones, shallow);
    const [skinTone, setSkinTone, skinToneVariations] = useSkinTone(emoji);

    const skinToneVariationIndex = useMemo(
      () =>
        Math.max(
          0,
          skinToneVariations.findIndex(
            (variation) => variation.skinTone === skinTone,
          ),
        ),
      [skinTone, skinToneVariations],
    );

    const skinToneVariation = skinToneVariations[skinToneVariationIndex]!;
    const nextSkinToneVariation =
      skinToneVariations[
        (skinToneVariationIndex + 1) % skinToneVariations.length
      ]!;
    const nextSkinTone = nextSkinToneVariation.skinTone;

    const nextSkinToneLabel =
      nextSkinTone === "none" ? undefined : skinTones?.[nextSkinTone];

    const handleClick = useCallback(
      (event: ReactMouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (!event.isDefaultPrevented()) {
          setSkinTone(nextSkinTone);
        }
      },
      [onClick, setSkinTone, nextSkinTone],
    );

    return (
      <button
        type="button"
        {...props}
        aria-label={
          ariaLabel + (nextSkinToneLabel ? ` (${nextSkinToneLabel})` : "")
        }
        aria-live="polite"
        frimousse-skin-tone-selector=""
        onClick={handleClick}
        ref={forwardedRef}
      >
        {skinToneVariation.emoji}
      </button>
    );
  },
);

/**
 * Exposes the current skin tone and a function to change it via a render
 * callback.
 *
 * @example
 * ```tsx
 * <EmojiPicker.SkinTone>
 *   {({ skinTone, setSkinTone }) => (
 *     <div>
 *       <span>{skinTone}</span>
 *       <button onClick={() => setSkinTone("none")}>Reset skin tone</button>
 *     </div>
 *   )}
 * </EmojiPicker.SkinTone>
 * ```
 *
 * It can be used to build a custom skin tone selector: pass an emoji
 * you want to use as visual (by default, ✋) and it will return its skin tone
 * variations.
 *
 * @example
 * ```tsx
 * const [skinTone, setSkinTone, skinToneVariations] = useSkinTone("👋");
 *
 * // (👋) (👋🏻) (👋🏼) (👋🏽) (👋🏾) (👋🏿)
 * <EmojiPicker.SkinTone emoji="👋">
 *   {({ skinTone, setSkinTone, skinToneVariations }) => (
 *     skinToneVariations.map(({ skinTone, emoji }) => (
 *       <button key={skinTone} onClick={() => setSkinTone(skinTone)}>
 *         {emoji}
 *       </button>
 *     ))
 *   )}
 * </EmojiPicker.SkinTone>
 * ```
 *
 * @see
 * If you prefer to use a hook rather than a component,
 * {@link useSkinTone} is also available.
 *
 * @see
 * An already-built skin tone selector is also available,
 * {@link EmojiPicker.SkinToneSelector|`<EmojiPicker.SkinToneSelector />`}.
 */
function EmojiPickerSkinTone({ children, emoji }: EmojiPickerSkinToneProps) {
  const [skinTone, setSkinTone, skinToneVariations] = useSkinTone(emoji);

  return children({ skinTone, setSkinTone, skinToneVariations });
}

export { EmojiPickerSkinTone, EmojiPickerSkinToneSelector };
