import {
  forwardRef,
  memo,
  type UIEvent as ReactUIEvent,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { useActiveEmoji } from "../../hooks";
import { $categoriesCount, $rowsCount, useEmojiPickerStore } from "../../store";
import type { EmojiPickerViewportProps } from "../../types";
import { useSelector } from "../../utils/store";
import { useLayoutEffect } from "../../utils/use-layout-effect";

const ActiveEmojiAnnouncer = memo(() => {
  const activeEmoji = useActiveEmoji();

  if (!activeEmoji) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      style={{
        border: 0,
        clip: "rect(0, 0, 0, 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        whiteSpace: "nowrap",
        width: 1,
        wordWrap: "normal",
      }}
    >
      {activeEmoji.label}
    </div>
  );
});

/**
 * The scrolling container of the emoji picker.
 *
 * @example
 * ```tsx
 * <EmojiPicker.Root>
 *   <EmojiPicker.Search />
 *   <EmojiPicker.Viewport>
 *     <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
 *     <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
 *     <EmojiPicker.List />
 *   </EmojiPicker.Viewport>
 * </EmojiPicker.Root>
 * ```
 */
const EmojiPickerViewport = forwardRef<
  HTMLDivElement,
  EmojiPickerViewportProps
>(({ children, onScroll, onKeyDown, style, ...props }, forwardedRef) => {
  const store = useEmojiPickerStore();
  const ref = useRef<HTMLDivElement>(null!);
  const callbackRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      ref.current = element;
      store.set({ viewportRef: ref });
    }
  }, []);
  const rowsCount = useSelector(store, $rowsCount);
  const categoriesCount = useSelector(store, $categoriesCount);

  const handleScroll = useCallback(
    (event: ReactUIEvent<HTMLDivElement>) => {
      onScroll?.(event);

      store.get().onViewportScroll(event.currentTarget.scrollTop);
    },
    [onScroll],
  );

  useLayoutEffect(() => {
    /* v8 ignore next 3 */
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry?.borderBoxSize[0]?.inlineSize ?? 0;
      const height = entry?.borderBoxSize[0]?.blockSize ?? 0;

      const { onViewportSizeChange, viewportHeight, viewportWidth } =
        store.get();

      if (viewportHeight !== height || viewportWidth !== width) {
        onViewportSizeChange(width, height);
      }
    });

    resizeObserver.observe(ref.current);

    store
      .get()
      .onViewportSizeChange(ref.current.offsetWidth, ref.current.clientHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useImperativeHandle(forwardedRef, () => ref.current);

  return (
    <div
      frimousse-viewport=""
      {...props}
      onScroll={handleScroll}
      ref={callbackRef}
      style={{
        position: "relative",
        boxSizing: "border-box",
        contain: "layout paint",
        containIntrinsicSize:
          typeof rowsCount === "number" && typeof categoriesCount === "number"
            ? `var(--frimousse-viewport-width, auto) calc(${rowsCount} * var(--frimousse-row-height) + ${categoriesCount} * var(--frimousse-category-header-height))`
            : undefined,
        overflowY: "auto",
        overscrollBehavior: "contain",
        scrollbarGutter: "stable",
        willChange: "scroll-position",
        ...style,
      }}
    >
      <ActiveEmojiAnnouncer />
      {children}
    </div>
  );
});

export { EmojiPickerViewport };
