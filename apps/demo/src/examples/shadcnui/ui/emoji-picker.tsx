"use client";

import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
} from "frimousse";
import { LoaderIcon, SearchIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const CATEGORY_ICON_BY_LABEL: Record<string, string> = {
  "smileys & emotion": "😀",
  "people & body": "🧑",
  "animals & nature": "🐻",
  "food & drink": "🍔",
  "travel & places": "✈️",
  activities: "⚽",
  objects: "💡",
  symbols: "💬",
  flags: "🏁",
};

function getCategoryIcon(label: string) {
  const normalizedLabel = label.toLowerCase();
  return CATEGORY_ICON_BY_LABEL[normalizedLabel];
}

function EmojiPicker({
  className,
  columns = 7,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      className={cn(
        "isolate flex h-full w-fit flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className,
      )}
      data-slot="emoji-picker"
      columns={columns}
      {...props}
    />
  );
}

function EmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <div
      className={cn("flex h-9 items-center gap-2 border-b px-3", className)}
      data-slot="emoji-picker-search-wrapper"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <EmojiPickerPrimitive.Search
        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        data-slot="emoji-picker-search"
        {...props}
      />
    </div>
  );
}

function EmojiPickerCategoryNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <EmojiPickerPrimitive.CategoryNav>
      {({ categories }) => (
        <div
          className={cn(
            "flex h-full w-11 flex-none flex-col items-center gap-1.5 overflow-y-auto overflow-x-hidden border-r bg-muted/40 px-1.5 py-2",
            className,
          )}
          data-slot="emoji-picker-category-nav"
          {...props}
        >
          {categories.map(({ category, scrollTo, isActive }, index) => (
            <button
              aria-label={category.label}
              className="relative flex size-8 items-center justify-center rounded-full text-base text-muted-foreground transition hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 before:absolute before:-left-1 before:h-4 before:w-1 before:rounded-full before:bg-foreground/70 before:opacity-0 before:transition before:content-[''] data-[active]:bg-accent data-[active]:text-accent-foreground data-[active]:before:opacity-100"
              data-active={isActive ? "" : undefined}
              key={`${category.label}-${index}`}
              onClick={scrollTo}
              type="button"
            >
              {category.icon ? (
                category.isCustomIcon ? (
                  <img
                    alt={category.label}
                    className="size-4 object-contain"
                    src={category.icon}
                  />
                ) : (
                  category.icon
                )
              ) : getCategoryIcon(category.label) ? (
                getCategoryIcon(category.label) ?? null
              ) : (
                <span className="text-[10px] font-semibold">
                  {category.label.slice(0, 1).toUpperCase()}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </EmojiPickerPrimitive.CategoryNav>
  );
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} className="scroll-my-1 px-1" data-slot="emoji-picker-row">
      {children}
    </div>
  );
}

function EmojiPickerEmoji({
  emoji,
  className,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      className={cn(
        "flex size-8 items-center justify-center rounded-sm text-lg data-[active]:bg-accent",
        className,
      )}
      data-slot="emoji-picker-emoji"
    >
      {emoji.isCustom ? (
        <img
          alt={emoji.label}
          className="size-5 object-contain"
          src={emoji.emoji}
        />
      ) : (
        emoji.emoji
      )}
    </button>
  );
}

function EmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="bg-popover px-3 pt-3.5 pb-2 text-muted-foreground text-xs leading-none"
      data-slot="emoji-picker-category-header"
    >
      {category.icon && (
        <span className="mr-2 inline-flex align-middle">
          {category.isCustomIcon ? (
            <img alt="" className="size-4 object-contain" src={category.icon} />
          ) : (
            category.icon
          )}
        </span>
      )}
      {category.label}
    </div>
  );
}

function EmojiPickerContent({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  return (
    <EmojiPickerPrimitive.Viewport
      className={cn("relative min-h-0 min-w-0 flex-1 outline-hidden", className)}
      data-slot="emoji-picker-viewport"
      {...props}
    >
      <EmojiPickerPrimitive.Loading
        className="absolute inset-0 flex items-center justify-center text-muted-foreground"
        data-slot="emoji-picker-loading"
      >
        <LoaderIcon className="size-4 animate-spin" />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty
        className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm"
        data-slot="emoji-picker-empty"
      >
        No emoji found.
      </EmojiPickerPrimitive.Empty>
      <EmojiPickerPrimitive.List
        className="select-none pb-1"
        components={{
          Row: EmojiPickerRow,
          Emoji: EmojiPickerEmoji,
          CategoryHeader: EmojiPickerCategoryHeader,
        }}
        data-slot="emoji-picker-list"
      />
    </EmojiPickerPrimitive.Viewport>
  );
}

function EmojiPickerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-(--frimousse-viewport-width) items-center gap-1 border-t p-2",
        className,
      )}
      data-slot="emoji-picker-footer"
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <>
              <div className="flex size-8 flex-none items-center justify-center text-xl">
                {emoji.isCustom ? (
                  <img
                    alt={emoji.label}
                    className="size-5 object-contain"
                    src={emoji.emoji}
                  />
                ) : (
                  emoji.emoji
                )}
              </div>
              <span className="truncate text-secondary-foreground text-xs">
                {emoji.label}
              </span>
            </>
          ) : (
            <span className="ml-1.5 flex h-7 items-center truncate text-muted-foreground text-xs">
              Select an emoji…
            </span>
          )
        }
      </EmojiPickerPrimitive.ActiveEmoji>
    </div>
  );
}

export {
  EmojiPicker,
  EmojiPickerCategoryNav,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
};
