import {
  type ComponentProps,
  type CSSProperties,
  Fragment,
  forwardRef,
  memo,
  type SyntheticEvent as ReactSyntheticEvent,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  $activeEmoji,
  $categoriesRowsStartIndices,
  $rowsCount,
  sameEmojiPickerRow,
  useEmojiPickerStore,
} from "../../store";
import type {
  EmojiPickerCategory,
  EmojiPickerDataCategory,
  EmojiPickerEmoji,
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListComponents,
  EmojiPickerListEmojiProps,
  EmojiPickerListProps,
  EmojiPickerListRowProps,
  WithAttributes,
} from "../../types";
import { shallow } from "../../utils/compare";
import { useSelector, useSelectorKey } from "../../utils/store";
import { useLayoutEffect } from "../../utils/use-layout-effect";

function listEmojiProps(
  emoji: EmojiPickerEmoji,
  columnIndex: number,
  isActive: boolean,
): WithAttributes<EmojiPickerListEmojiProps> {
  return {
    emoji: { ...emoji, isActive },
    role: "gridcell",
    "aria-colindex": columnIndex,
    "aria-selected": isActive || undefined,
    "aria-label": emoji.label,
    "data-active": isActive ? "" : undefined,
    "frimousse-emoji": "",
    style: {
      fontFamily: "var(--frimousse-emoji-font)",
    },
    tabIndex: -1,
  };
}

function listRowProps(
  rowIndex: number,
  sizer = false,
): WithAttributes<EmojiPickerListRowProps> {
  return {
    role: !sizer ? "row" : undefined,
    "aria-rowindex": !sizer ? rowIndex : undefined,
    "frimousse-row": "",
    style: {
      contain: !sizer ? "content" : undefined,
      height: !sizer ? "var(--frimousse-row-height)" : undefined,
      display: "flex",
    },
  };
}

function listCategoryProps(
  categoryIndex: number,
  category?: EmojiPickerDataCategory,
): WithAttributes<ComponentProps<"div">> {
  return {
    "frimousse-category": "",
    style: {
      contain: "content",
      top: category
        ? `calc(${categoryIndex} * var(--frimousse-category-header-height) + ${category.startRowIndex} * var(--frimousse-row-height))`
        : undefined,
      height: category
        ? `calc(var(--frimousse-category-header-height) + ${category.rowsCount} * var(--frimousse-row-height))`
        : undefined,
      width: "100%",
      pointerEvents: "none",
      position: "absolute",
    },
  };
}

function listCategoryHeaderProps(
  category: EmojiPickerCategory,
  sizer = false,
  sticky = true,
): WithAttributes<EmojiPickerListCategoryHeaderProps> {
  return {
    category,
    "frimousse-category-header": "",
    style: {
      contain: !sizer ? "layout paint" : undefined,
      height: !sizer ? "var(--frimousse-category-header-height)" : undefined,
      pointerEvents: "auto",
      position: sticky ? "sticky" : undefined,
      top: 0,
    },
  };
}

function listSizerProps(
  rowsCount: number,
  categoriesCount: number,
  viewportStartRowIndex: number,
  previousHeadersCount: number,
): WithAttributes<ComponentProps<"div">> {
  return {
    "frimousse-list-sizer": "",
    style: {
      position: "relative",
      boxSizing: "border-box",
      height: `calc(${rowsCount} * var(--frimousse-row-height) + ${categoriesCount} * var(--frimousse-category-header-height))`,
      paddingTop: `calc(${viewportStartRowIndex} * var(--frimousse-row-height) + ${previousHeadersCount} * var(--frimousse-category-header-height))`,
    },
  };
}

function listProps(
  columns: number,
  rowsCount: number,
  style: CSSProperties | undefined,
): WithAttributes<EmojiPickerListProps> {
  return {
    "aria-colcount": columns,
    "aria-rowcount": rowsCount,
    "frimousse-list": "",
    style: {
      "--frimousse-list-columns": columns,
      ...style,
    } as CSSProperties,
    role: "grid",
  };
}

function preventDefault(event: ReactSyntheticEvent) {
  event.preventDefault();
}

const EmojiPickerListEmoji = memo(
  ({
    Emoji,
    emoji,
    columnIndex,
    rowIndex,
  }: {
    emoji: EmojiPickerEmoji;
    columnIndex: number;
    rowIndex: number;
  } & Pick<EmojiPickerListComponents, "Emoji">) => {
    const store = useEmojiPickerStore();
    const isActive = useSelector(
      store,
      (state) => $activeEmoji(state)?.emoji === emoji.emoji,
    );

    const handleSelect = useCallback(() => {
      store.get().onEmojiSelect(emoji);
    }, [emoji]);

    const handlePointerEnter = useCallback(() => {
      store.get().onActiveEmojiChange("pointer", columnIndex, rowIndex);
    }, [columnIndex, rowIndex]);

    const handlePointerLeave = useCallback(() => {
      store.get().onActiveEmojiReset();
    }, []);

    return (
      <Emoji
        {...listEmojiProps(emoji, columnIndex, isActive)}
        onClick={handleSelect}
        onPointerDown={preventDefault}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
    );
  },
);

const EmojiPickerListRow = memo(
  ({
    Row,
    Emoji,
    rowIndex,
  }: { rowIndex: number } & Pick<
    EmojiPickerListComponents,
    "Emoji" | "Row"
  >) => {
    const store = useEmojiPickerStore();
    const row = useSelector(
      store,
      (state) => state.data?.rows[rowIndex],
      sameEmojiPickerRow,
    );

    /* v8 ignore next 3 */
    if (!row) {
      return null;
    }

    return (
      <Row {...listRowProps(rowIndex)}>
        {row.emojis.map((emoji, columnIndex) => (
          <EmojiPickerListEmoji
            columnIndex={columnIndex}
            Emoji={Emoji}
            emoji={emoji}
            key={emoji.label}
            rowIndex={rowIndex}
          />
        ))}
      </Row>
    );
  },
);

const EmojiPickerListCategory = memo(
  ({
    CategoryHeader,
    categoryIndex,
  }: { categoryIndex: number } & Pick<
    EmojiPickerListComponents,
    "CategoryHeader"
  >) => {
    const store = useEmojiPickerStore();
    const category = useSelector(
      store,
      (state) => state.data?.categories[categoryIndex],
      shallow,
    );
    const sticky = useSelectorKey(store, "sticky");

    /* v8 ignore next 3 */
    if (!category) {
      return null;
    }

    return (
      <div {...listCategoryProps(categoryIndex, category)}>
        <CategoryHeader
          {...listCategoryHeaderProps(
            {
              label: category.label,
              icon: category.icon,
              isCustomIcon: category.isCustomIcon,
            },
            false,
            sticky,
          )}
        />
      </div>
    );
  },
);

const EmojiPickerListSizers = memo(
  ({
    CategoryHeader,
    Row,
    Emoji,
  }: Pick<EmojiPickerListComponents, "CategoryHeader" | "Row" | "Emoji">) => {
    const ref = useRef<HTMLDivElement>(null!);
    const store = useEmojiPickerStore();
    const columns = useSelectorKey(store, "columns");
    const emojis = useMemo(
      () =>
        Array<EmojiPickerEmoji>(columns).fill({
          emoji: "🙂",
          label: "",
        }),
      [columns],
    );
    const category: EmojiPickerCategory = useMemo(
      () => ({
        label: "Category",
        icon: "📁",
      }),
      [],
    );
    const rowRef = useRef<HTMLDivElement>(null!);
    const categoryHeaderRef = useRef<HTMLDivElement>(null!);

    useLayoutEffect(() => {
      const list = ref.current?.parentElement?.parentElement;

      /* v8 ignore next 3 */
      if (!list || !rowRef.current || !categoryHeaderRef.current) {
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height;

          const {
            onRowHeightChange,
            onCategoryHeaderHeightChange,
            rowHeight,
            categoryHeaderHeight,
          } = store.get();

          if (entry.target === rowRef.current && rowHeight !== height) {
            onRowHeightChange(height);
          }

          if (
            entry.target === categoryHeaderRef.current &&
            categoryHeaderHeight !== height
          ) {
            onCategoryHeaderHeightChange(height);
          }
        }
      });

      resizeObserver.observe(list);
      resizeObserver.observe(rowRef.current);
      resizeObserver.observe(categoryHeaderRef.current);

      const { onRowHeightChange, onCategoryHeaderHeightChange } = store.get();

      onRowHeightChange(rowRef.current.clientHeight);
      onCategoryHeaderHeightChange(categoryHeaderRef.current.clientHeight);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        aria-hidden
        ref={ref}
        style={{
          height: 0,
          visibility: "hidden",
        }}
      >
        <div frimousse-row-sizer="" ref={rowRef}>
          <Row {...listRowProps(-1, true)}>
            {emojis.map((emoji, index) => (
              <Emoji key={index} {...listEmojiProps(emoji, index, false)} />
            ))}
          </Row>
        </div>
        <div {...listCategoryProps(-1)}>
          <div frimousse-category-header-sizer="" ref={categoryHeaderRef}>
            <CategoryHeader {...listCategoryHeaderProps(category, true)} />
          </div>
        </div>
      </div>
    );
  },
);

function DefaultEmojiPickerListCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div {...props}>
      {category.icon && (
        <span style={{ marginRight: "0.5em" }}>
          {category.isCustomIcon ? (
            <img
              alt=""
              src={category.icon}
              style={{
                width: "1em",
                height: "1em",
                objectFit: "contain",
                verticalAlign: "middle",
              }}
            />
          ) : (
            category.icon
          )}
        </span>
      )}
      {category.label}
    </div>
  );
}

function DefaultEmojiPickerListEmoji({
  emoji,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button type="button" {...props}>
      {emoji.isCustom ? (
        <img
          alt={emoji.label}
          src={emoji.emoji}
          style={{
            width: "1em",
            height: "1em",
            objectFit: "contain",
            verticalAlign: "middle",
          }}
        />
      ) : (
        emoji.emoji
      )}
    </button>
  );
}

function DefaultEmojiPickerListRow({ ...props }: EmojiPickerListRowProps) {
  return <div {...props} />;
}

/**
 * The list of emojis.
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
 * Inner components within the list can be customized via the `components` prop.
 *
 * @example
 * ```tsx
 * <EmojiPicker.List
 *   components={{
 *     CategoryHeader: ({ category, ...props }) => (
 *       <div {...props}>{category.label}</div>
 *     ),
 *     Emoji: ({ emoji, ...props }) => (
 *       <button {...props}>
 *         {emoji.emoji}
 *       </button>
 *     ),
 *     Row: ({ children, ...props }) => <div {...props}>{children}</div>,
 *   }}
 * />
 * ```
 */
const EmojiPickerList = forwardRef<HTMLDivElement, EmojiPickerListProps>(
  ({ style, components, ...props }, forwardedRef) => {
    const store = useEmojiPickerStore();
    const ref = useRef<HTMLDivElement>(null!);
    const callbackRef = useCallback((element: HTMLDivElement | null) => {
      if (element) {
        ref.current = element;
        store.set({ listRef: ref });
      }
    }, []);
    const CategoryHeader =
      components?.CategoryHeader ?? DefaultEmojiPickerListCategoryHeader;
    const Emoji = components?.Emoji ?? DefaultEmojiPickerListEmoji;
    const Row = components?.Row ?? DefaultEmojiPickerListRow;
    const columns = useSelectorKey(store, "columns");
    const viewportStartRowIndex = useSelectorKey(
      store,
      "viewportStartRowIndex",
    );
    const viewportEndRowIndex = useSelectorKey(store, "viewportEndRowIndex");
    const rowsCount = useSelector(store, $rowsCount);
    const categoriesRowsStartIndices = useSelector(
      store,
      $categoriesRowsStartIndices,
      shallow,
    );
    const previousHeadersCount = useMemo(() => {
      return (
        categoriesRowsStartIndices?.filter(
          (index) => index < viewportStartRowIndex,
        ).length ?? 0
      );
    }, [categoriesRowsStartIndices, viewportStartRowIndex]);
    const categoriesCount = categoriesRowsStartIndices?.length ?? 0;

    useImperativeHandle(forwardedRef, () => ref.current);

    if (!rowsCount || !categoriesRowsStartIndices || categoriesCount === 0) {
      return (
        <div {...listProps(columns, 0, style)} {...props}>
          <div {...listSizerProps(0, 0, 0, 0)}>
            <EmojiPickerListSizers
              CategoryHeader={CategoryHeader}
              Emoji={Emoji}
              Row={Row}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        {...listProps(columns, rowsCount, style)}
        {...props}
        ref={callbackRef}
      >
        <div
          {...listSizerProps(
            rowsCount,
            categoriesCount,
            viewportStartRowIndex,
            previousHeadersCount,
          )}
        >
          <EmojiPickerListSizers
            CategoryHeader={CategoryHeader}
            Emoji={Emoji}
            Row={Row}
          />
          {Array.from(
            { length: viewportEndRowIndex - viewportStartRowIndex + 1 },
            (_, index) => {
              const rowIndex = viewportStartRowIndex + index;
              const categoryIndex =
                categoriesRowsStartIndices.indexOf(rowIndex);

              return (
                <Fragment key={rowIndex}>
                  {categoryIndex >= 0 && (
                    <div
                      style={{
                        height: "var(--frimousse-category-header-height)",
                      }}
                    />
                  )}
                  <EmojiPickerListRow
                    Emoji={Emoji}
                    Row={Row}
                    rowIndex={rowIndex}
                  />
                </Fragment>
              );
            },
          )}
          {Array.from({ length: categoriesCount }, (_, index) => (
            <EmojiPickerListCategory
              CategoryHeader={CategoryHeader}
              categoryIndex={index}
              key={index}
            />
          ))}
        </div>
      </div>
    );
  },
);

export { EmojiPickerList };
