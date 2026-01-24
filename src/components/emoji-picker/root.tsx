import {
  type CSSProperties,
  forwardRef,
  type FocusEvent as ReactFocusEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { EMOJI_FONT_FAMILY } from "../../constants";
import { getEmojiData, validateLocale, validateSkinTone } from "../../data/emoji";
import { getEmojiPickerData } from "../../data/emoji-picker";
import {
  $activeEmoji,
  createEmojiPickerStore,
  type EmojiPickerStore,
  EmojiPickerStoreProvider,
  useEmojiPickerStore,
} from "../../store";
import type { EmojiData, EmojiPickerRootProps } from "../../types";
import { noop } from "../../utils/noop";
import { requestIdleCallback } from "../../utils/request-idle-callback";
import { useCreateStore, useSelectorKey } from "../../utils/store";
import { useLayoutEffect } from "../../utils/use-layout-effect";
import { useStableCallback } from "../../utils/use-stable-callback";

function EmojiPickerDataHandler({
  emojiVersion,
  emojibaseUrl,
}: Pick<EmojiPickerRootProps, "emojiVersion" | "emojibaseUrl">) {
  const [emojiData, setEmojiData] = useState<EmojiData | undefined>(undefined);
  const store = useEmojiPickerStore();
  const locale = useSelectorKey(store, "locale");
  const columns = useSelectorKey(store, "columns");
  const skinTone = useSelectorKey(store, "skinTone");
  const search = useSelectorKey(store, "search");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getEmojiData({ locale, emojiVersion, emojibaseUrl, signal })
      .then((data) => {
        setEmojiData(data);
      })
      .catch((error) => {
        if (!signal.aborted) {
          console.error(error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [emojiVersion, emojibaseUrl, locale]);

  useEffect(() => {
    if (!emojiData) {
      return;
    }

    return requestIdleCallback(
      () => {
        store
          .get()
          .onDataChange(
            getEmojiPickerData(emojiData, columns, skinTone, search),
          );
      },
      { timeout: 100 },
    );
  }, [emojiData, columns, skinTone, search]);

  return null;
}

/**
 * Surrounds all the emoji picker parts.
 *
 * @example
 * ```tsx
 * <EmojiPicker.Root onEmojiSelect={({ emoji }) => console.log(emoji)}>
 *   <EmojiPicker.Search />
 *   <EmojiPicker.Viewport>
 *     <EmojiPicker.List />
 *   </EmojiPicker.Viewport>
 * </EmojiPicker.Root>
 * ```
 *
 * Options affecting the entire emoji picker are available on this
 * component as props.
 *
 * @example
 * ```tsx
 * <EmojiPicker.Root locale="fr" columns={10} skinTone="medium">
 *   {\/* ... *\/}
 * </EmojiPicker.Root>
 * ```
 */
const EmojiPickerRoot = forwardRef<HTMLDivElement, EmojiPickerRootProps>(
  (
    {
      locale = "en",
      columns = 9,
      skinTone = "none",
      onEmojiSelect = noop,
      emojiVersion,
      emojibaseUrl,
      onFocusCapture,
      onBlurCapture,
      children,
      style,
      sticky = true,
      ...props
    },
    forwardedRef,
  ) => {
    const stableOnEmojiSelect = useStableCallback(onEmojiSelect);
    const store = useCreateStore(() =>
      createEmojiPickerStore(
        stableOnEmojiSelect,
        validateLocale(locale),
        columns,
        sticky,
        validateSkinTone(skinTone),
      ),
    );
    const [isFocusedWithin, setFocusedWithin] = useState(false);
    const ref = useRef<HTMLDivElement>(null!);
    const callbackRef = useCallback((element: HTMLDivElement | null) => {
      if (element) {
        ref.current = element;
        store.set({ rootRef: ref });
      }
    }, []);

    useLayoutEffect(() => {
      store.set({ locale: validateLocale(locale) });
    }, [locale]);

    useLayoutEffect(() => {
      store.set({ columns });
    }, [columns]);

    useLayoutEffect(() => {
      store.set({ sticky });
    }, [sticky]);

    useLayoutEffect(() => {
      store.set({ skinTone: validateSkinTone(skinTone) });
    }, [skinTone]);

    const handleFocusCapture = useCallback(
      (event: ReactFocusEvent<HTMLDivElement>) => {
        onFocusCapture?.(event);

        const { searchRef, viewportRef } = store.get();

        const isSearch =
          event.target === searchRef?.current ||
          event.target.hasAttribute("frimousse-search");

        const isViewport =
          event.target === viewportRef?.current ||
          event.target.hasAttribute("frimousse-viewport");

        if (!event.isDefaultPrevented()) {
          setFocusedWithin(isSearch || isViewport);

          if (!event.isDefaultPrevented()) {
            setFocusedWithin(isSearch || isViewport);

            if (isViewport) {
              store.get().onActiveEmojiChange("keyboard", 0, 0);
            } else if (isSearch && store.get().search === "") {
              store.set({ interaction: "none" });
            }
          }
        }
      },
      [onFocusCapture],
    );

    const handleBlurCapture = useCallback(
      (event: ReactFocusEvent<HTMLDivElement>) => {
        onBlurCapture?.(event);

        if (
          !event.isDefaultPrevented() &&
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setFocusedWithin(false);
        }
      },
      [onBlurCapture],
    );

    useLayoutEffect(() => {
      if (!isFocusedWithin) {
        store.get().onActiveEmojiReset();
      }
    }, [isFocusedWithin]);

    useImperativeHandle(forwardedRef, () => ref.current);

    useEffect(() => {
      if (!isFocusedWithin) {
        return;
      }

      function handleKeyDown(event: KeyboardEvent) {
        if (
          event.defaultPrevented ||
          (!event.key.startsWith("Arrow") && event.key !== "Enter")
        ) {
          return;
        }

        const {
          data,
          onEmojiSelect,
          onActiveEmojiChange,
          interaction,
          activeColumnIndex,
          activeRowIndex,
        } = store.get();

        // Select the active emoji with enter if it exists
        if (event.key === "Enter") {
          const activeEmoji = $activeEmoji(store.get());

          if (activeEmoji) {
            event.preventDefault();

            onEmojiSelect(activeEmoji);
          }
        }

        // Move the active emoji with arrow keys
        if (event.key.startsWith("Arrow")) {
          let columnIndex = activeColumnIndex;
          let rowIndex = activeRowIndex;

          event.preventDefault();

          if (interaction !== "none") {
            if (data?.rows && data.rows.length > 0) {
              switch (event.key) {
                case "ArrowLeft": {
                  if (columnIndex === 0) {
                    const previousRowIndex = rowIndex - 1;
                    const previousRow = data.rows[previousRowIndex];

                    // If first column, move to last column of previous row (if available)
                    if (previousRow) {
                      rowIndex = previousRowIndex;
                      columnIndex = previousRow.emojis.length - 1;
                    }
                  } else {
                    // Otherwise, move to previous column
                    columnIndex -= 1;
                  }

                  break;
                }

                case "ArrowRight": {
                  if (columnIndex === data.rows[rowIndex]!.emojis.length - 1) {
                    const nextRowIndex = rowIndex + 1;
                    const nextRow = data.rows[nextRowIndex];

                    // If last column, move to first column of next row (if available)
                    if (nextRow) {
                      rowIndex = nextRowIndex;
                      columnIndex = 0;
                    }
                  } else {
                    // Otherwise, move to next column
                    columnIndex += 1;
                  }

                  break;
                }

                case "ArrowUp": {
                  const previousRow = data.rows[rowIndex - 1];

                  // If not first row, move to previous row
                  if (previousRow) {
                    rowIndex -= 1;

                    // If previous row doesn't have the same column, move to last column of previous row
                    if (!previousRow.emojis[columnIndex]) {
                      columnIndex = previousRow.emojis.length - 1;
                    }
                  }

                  break;
                }

                case "ArrowDown": {
                  const nextRow = data.rows[rowIndex + 1];

                  // If not last row, move to next row
                  if (nextRow) {
                    rowIndex += 1;

                    // If next row doesn't have the same column, move to last column of next row
                    if (!nextRow.emojis[columnIndex]) {
                      columnIndex = nextRow.emojis.length - 1;
                    }
                  }

                  break;
                }
              }
            }

            onActiveEmojiChange("keyboard", columnIndex, rowIndex);
          } else {
            onActiveEmojiChange("keyboard", 0, 0);
          }
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isFocusedWithin]);

    useLayoutEffect(() => {
      let previousViewportWidth: EmojiPickerStore["viewportWidth"] = null;
      let previousViewportHeight: EmojiPickerStore["viewportHeight"] = null;
      let previousRowHeight: EmojiPickerStore["rowHeight"] = null;
      let previousCategoryHeaderHeight: EmojiPickerStore["categoryHeaderHeight"] =
        null;

      const unsubscribe = store.subscribe((state) => {
        /* v8 ignore next 3 */
        if (!ref.current) {
          return;
        }

        if (previousViewportWidth !== state.viewportWidth) {
          previousViewportWidth = state.viewportWidth;

          ref.current.style.setProperty(
            "--frimousse-viewport-width",
            `${state.viewportWidth}px`,
          );
        }

        if (previousViewportHeight !== state.viewportHeight) {
          previousViewportHeight = state.viewportHeight;

          ref.current.style.setProperty(
            "--frimousse-viewport-height",
            `${state.viewportHeight}px`,
          );
        }

        if (previousRowHeight !== state.rowHeight) {
          previousRowHeight = state.rowHeight;

          ref.current.style.setProperty(
            "--frimousse-row-height",
            `${state.rowHeight}px`,
          );
        }

        if (previousCategoryHeaderHeight !== state.categoryHeaderHeight) {
          previousCategoryHeaderHeight = state.categoryHeaderHeight;

          ref.current.style.setProperty(
            "--frimousse-category-header-height",
            `${state.categoryHeaderHeight}px`,
          );
        }
      });

      const { viewportWidth, viewportHeight, rowHeight, categoryHeaderHeight } =
        store.get();

      if (viewportWidth) {
        ref.current.style.setProperty(
          "--frimousse-viewport-width",
          `${viewportWidth}px`,
        );
      }

      if (viewportHeight) {
        ref.current.style.setProperty(
          "--frimousse-viewport-height",
          `${viewportHeight}px`,
        );
      }

      if (rowHeight) {
        ref.current.style.setProperty(
          "--frimousse-row-height",
          `${rowHeight}px`,
        );
      }

      if (categoryHeaderHeight) {
        ref.current.style.setProperty(
          "--frimousse-category-header-height",
          `${categoryHeaderHeight}px`,
        );
      }

      return unsubscribe;
    }, []);

    return (
      <div
        data-focused={isFocusedWithin ? "" : undefined}
        frimousse-root=""
        onBlurCapture={handleBlurCapture}
        onFocusCapture={handleFocusCapture}
        {...props}
        ref={callbackRef}
        style={
          {
            "--frimousse-emoji-font": EMOJI_FONT_FAMILY,
            ...style,
          } as CSSProperties
        }
      >
        <EmojiPickerStoreProvider store={store}>
          <EmojiPickerDataHandler
            emojibaseUrl={emojibaseUrl}
            emojiVersion={emojiVersion}
          />
          {children}
        </EmojiPickerStoreProvider>
      </div>
    );
  },
);

export { EmojiPickerRoot };
