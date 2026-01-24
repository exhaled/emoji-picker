import {
  forwardRef,
  type ChangeEvent as ReactChangeEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useEmojiPickerStore } from "../../store";
import type { EmojiPickerSearchProps } from "../../types";
import { useLayoutEffect } from "../../utils/use-layout-effect";

/**
 * A search input to filter the list of emojis.
 *
 * @example
 * ```tsx
 * <EmojiPicker.Root>
 *   <EmojiPicker.Search />
 *   <EmojiPicker.Viewport>
 *     <EmojiPicker.List />
 *   </EmojiPicker.Viewport>
 * </EmojiPicker.Root>
 * ```
 *
 * It can be controlled or uncontrolled.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState("");
 *
 * return (
 *   <EmojiPicker.Root>
 *     <EmojiPicker.Search
 *       value={search}
 *       onChange={(event) => setSearch(event.target.value)}
 *     />
 *     {\/* ... *\/}
 *   </EmojiPicker.Root>
 * );
 * ```
 */
const EmojiPickerSearch = forwardRef<HTMLInputElement, EmojiPickerSearchProps>(
  ({ value, defaultValue, onChange, ...props }, forwardedRef) => {
    const store = useEmojiPickerStore();
    const ref = useRef<HTMLInputElement>(null!);
    const callbackRef = useCallback((element: HTMLInputElement | null) => {
      if (element) {
        ref.current = element;
        store.set({ searchRef: ref });
      }
    }, []);
    const isControlled = typeof value === "string";
    const wasControlled = useRef(isControlled);

    useEffect(() => {
      if (
        process.env.NODE_ENV !== "production" &&
        wasControlled.current !== isControlled
      ) {
        console.warn(
          `EmojiPicker.Search is changing from ${
            wasControlled ? "controlled" : "uncontrolled"
          } to ${isControlled ? "controlled" : "uncontrolled"}.`,
        );
      }

      wasControlled.current = isControlled;
    }, [isControlled]);

    // Initialize search with a controlled or uncontrolled value
    useLayoutEffect(() => {
      store.set({
        search:
          typeof value === "string"
            ? value
            : typeof defaultValue === "string"
              ? defaultValue
              : "",
      });
    }, []);

    // Handle controlled value changes
    useLayoutEffect(() => {
      if (typeof value === "string") {
        store.get().onSearchChange(value);
      }
    }, [value]);

    const handleChange = useCallback(
      (event: ReactChangeEvent<HTMLInputElement>) => {
        onChange?.(event);

        if (!event.isDefaultPrevented()) {
          store.get().onSearchChange(event.target.value);
        }
      },
      [onChange],
    );

    useImperativeHandle(forwardedRef, () => ref.current);

    return (
      <input
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        enterKeyHint="done"
        frimousse-search=""
        placeholder="Search…"
        spellCheck={false}
        type="search"
        {...props}
        defaultValue={defaultValue}
        onChange={handleChange}
        ref={callbackRef}
        value={value}
      />
    );
  },
);

export { EmojiPickerSearch };
