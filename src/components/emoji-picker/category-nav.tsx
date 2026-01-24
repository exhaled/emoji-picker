import { useMemo } from "react";
import { useEmojiPickerStore } from "../../store";
import type { EmojiPickerCategoryNavProps } from "../../types";
import { useSelectorKey } from "../../utils/store";

/**
 * Exposes the emoji categories and provides scroll handlers to navigate
 * to each category via a render callback.
 *
 * @example
 * ```tsx
 * <EmojiPicker.CategoryNav>
 *   {({ categories }) => (
 *     <div>
 *       {categories.map(({ category, scrollTo }) => (
 *         <button key={category.label} onClick={scrollTo}>
 *           {category.label}
 *         </button>
 *       ))}
 *     </div>
 *   )}
 * </EmojiPicker.CategoryNav>
 * ```
 *
 * This component allows building custom category navigation that can scroll
 * to the corresponding section in the emoji list.
 */
function EmojiPickerCategoryNav({
  children,
}: EmojiPickerCategoryNavProps) {
  const store = useEmojiPickerStore();
  const data = useSelectorKey(store, "data");
  const viewportRef = useSelectorKey(store, "viewportRef");
  const rowHeight = useSelectorKey(store, "rowHeight");
  const categoryHeaderHeight = useSelectorKey(store, "categoryHeaderHeight");
  const viewportStartCategoryIndex = useSelectorKey(
    store,
    "viewportStartCategoryIndex",
  );

  const categories = useMemo(() => {
    if (
      !data?.categories ||
      !viewportRef ||
      !rowHeight ||
      !categoryHeaderHeight
    ) {
      return [];
    }

    return data.categories.map((category, index) => ({
      category: { label: category.label },
      isActive: index === viewportStartCategoryIndex,
      scrollTo: () => {
        const viewport = viewportRef.current;

        if (!viewport) {
          return;
        }

        const scrollTop =
          index * categoryHeaderHeight + category.startRowIndex * rowHeight;

        viewport.scrollTo({
          top: scrollTop,
        });
      },
    }));
  }, [
    data?.categories,
    viewportRef,
    rowHeight,
    categoryHeaderHeight,
    viewportStartCategoryIndex,
  ]);

  return children({ categories });
}

export { EmojiPickerCategoryNav };
