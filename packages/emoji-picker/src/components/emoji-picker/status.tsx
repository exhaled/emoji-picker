import type { ReactNode } from "react";
import { $isEmpty, $isLoading, $search, useEmojiPickerStore } from "../../store";
import type { EmojiPickerEmptyProps, EmojiPickerLoadingProps } from "../../types";
import { useSelector } from "../../utils/store";

/**
 * Only renders when the emoji data is loading.
 *
 * @example
 * ```tsx
 * <EmojiPicker.Root>
 *   <EmojiPicker.Search />
 *   <EmojiPicker.Viewport>
 *     <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
 *     <EmojiPicker.List />
 *   </EmojiPicker.Viewport>
 * </EmojiPicker.Root>
 * ```
 */
function EmojiPickerLoading({ children, ...props }: EmojiPickerLoadingProps) {
  const store = useEmojiPickerStore();
  const isLoading = useSelector(store, $isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <span frimousse-loading="" {...props}>
      {children}
    </span>
  );
}

function EmojiPickerEmptyWithSearch({
  children,
}: {
  children: (props: { search: string }) => ReactNode;
}) {
  const store = useEmojiPickerStore();
  const search = useSelector(store, $search);

  return children({ search });
}

/**
 * Only renders when no emoji is found for the current search. The content is
 * rendered without any surrounding DOM element.
 *
 * @example
 * ```tsx
 * <EmojiPicker.Root>
 *   <EmojiPicker.Search />
 *   <EmojiPicker.Viewport>
 *     <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
 *     <EmojiPicker.List />
 *   </EmojiPicker.Viewport>
 * </EmojiPicker.Root>
 * ```
 *
 * It can also expose the current search via a render callback to build
 * a more detailed empty state.
 *
 *  @example
 * ```tsx
 * <EmojiPicker.Empty>
 *   {({ search }) => <>No emoji found for "{search}"</>}
 * </EmojiPicker.Empty>
 * ```
 */
function EmojiPickerEmpty({ children, ...props }: EmojiPickerEmptyProps) {
  const store = useEmojiPickerStore();
  const isEmpty = useSelector(store, $isEmpty);

  if (!isEmpty) {
    return null;
  }

  return (
    <span frimousse-empty="" {...props}>
      {typeof children === "function" ? (
        <EmojiPickerEmptyWithSearch>{children}</EmojiPickerEmptyWithSearch>
      ) : (
        children
      )}
    </span>
  );
}

export { EmojiPickerEmpty, EmojiPickerLoading };
