import type { ReactNode } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

type DefinitionRowProps = {
  name: string;
  type?: ReactNode;
  defaultValue?: ReactNode;
  className?: string;
  children?: ReactNode;
};

function DefinitionRow({
  name,
  type,
  defaultValue,
  className,
  children,
}: DefinitionRowProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dotted border-muted-foreground/40 bg-background/40 p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <code className="text-sm font-semibold text-foreground">{name}</code>
        {type ? (
          <span className="text-xs text-muted-foreground">
            type {type}
          </span>
        ) : null}
        {defaultValue ? (
          <span className="text-xs text-muted-foreground">
            default {defaultValue}
          </span>
        ) : null}
      </div>
      {children ? (
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function DefinitionNote({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dotted border-muted-foreground/30 bg-background/20 p-4 text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ApiReference() {
  return (
    <section className="flex flex-col gap-10" id="api-reference">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Reference
        </p>
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <p className="text-muted-foreground">
          All parts and hooks, along their usage and options.
        </p>
      </header>

      <div className="space-y-12">
        <section className="space-y-4" id="emojipicker-root">
          <h3 className="text-xl font-semibold">EmojiPicker.Root</h3>
          <p className="text-muted-foreground">
            Surrounds all the emoji picker parts.
          </p>
          <CodeBlock lang="tsx">{`
            // [!code highlight:1]
            <EmojiPicker.Root onEmojiSelect={({ emoji }) => console.log(emoji)}>
              <EmojiPicker.Search />
              <EmojiPicker.Viewport>
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
            // [!code highlight:1]
            </EmojiPicker.Root>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            Options affecting the entire emoji picker are available on this
            component as props.
          </p>
          <CodeBlock lang="tsx">{`
            // [!code word:locale]
            // [!code word:columns]
            // [!code word:skinTone]
            <EmojiPicker.Root locale="fr" columns={10} skinTone="medium">
              {/* ... */}
            </EmojiPicker.Root>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            You can also inject custom emojis and categories.
          </p>
          <CodeBlock lang="tsx">{`
            const customCategories = [
              { id: 100, index: 0, label: "Brand", icon: "/icons/brand.png", isCustomIcon: true },
            ];

            const customEmojis = [
              { emoji: "🧁", label: "Cupcake", category: 100, isCustom: true },
              { emoji: "🧪", label: "Lab", isCustom: true },
            ];

            <EmojiPicker.Root
              customCategories={customCategories}
              customEmojis={customEmojis}
            >
              {/* ... */}
            </EmojiPicker.Root>
          `}</CodeBlock>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="onEmojiSelect"
              type={<code>(emoji: Emoji) =&gt; void</code>}
            >
              <p>A callback invoked when an emoji is selected.</p>
            </DefinitionRow>
            <DefinitionRow
              name="locale"
              type={<code>Locale</code>}
              defaultValue={<code>"en"</code>}
            >
              <p>The locale of the emoji picker.</p>
            </DefinitionRow>
            <DefinitionRow
              name="skinTone"
              type={<code>SkinTone</code>}
              defaultValue={<code>"none"</code>}
            >
              <p>The skin tone of the emoji picker.</p>
            </DefinitionRow>
            <DefinitionRow
              name="columns"
              type={<code>number</code>}
              defaultValue="10"
            >
              <p>The number of columns in the list.</p>
            </DefinitionRow>
            <DefinitionRow
              name="sticky"
              type={<code>boolean</code>}
              defaultValue="true"
            >
              <p>Whether the category headers should be sticky.</p>
            </DefinitionRow>
            <DefinitionRow
              name="emojiVersion"
              type={<code>number</code>}
              defaultValue="the most recent version supported by the current browser"
            >
              <p>
                Which Emoji version to use, to manually control which emojis are
                visible regardless of the current browser's supported Emoji
                versions.
              </p>
            </DefinitionRow>
            <DefinitionRow
              name="emojibaseUrl"
              type={<code>string</code>}
              defaultValue={
                <code>"https://cdn.jsdelivr.net/npm/emojibase-data"</code>
              }
            >
              <p>
                The base URL of where the Emojibase data should be fetched from,
                used as follows: {"${"}emojibaseUrl{"}"}/{"${"}locale{"}"}/{"${"}file{"}"}.json.
                (e.g. {"${"}emojibaseUrl{"}"}/en/data.json).
              </p>
              <p>
                The URL can be set to another CDN hosting the emojibase-data
                package and its raw JSON files, or to a self-hosted location. If
                self-hosting with a single locale (e.g. <code>en</code>), only
                that locale's directory needs to be hosted instead of the entire
                package.
              </p>
            </DefinitionRow>
            <DefinitionRow
              name="customEmojis"
              type={<code>Emoji[]</code>}
            >
              <p>Custom emojis to include in the picker.</p>
              <p>
                Set <code>category</code> to the category id/index you want to
                target, or omit it to place emojis in an auto-added{" "}
                <code>Custom</code> category at the end.
              </p>
            </DefinitionRow>
            <DefinitionRow
              name="customCategories"
              type={<code>CustomCategory[]</code>}
            >
              <p>Custom categories to include in the picker.</p>
              <p>
                Categories are sorted by <code>index</code> and merged before
                built-in categories. Use <code>id</code> when you want custom
                emoji <code>category</code> values that differ from the display
                index, and set <code>isCustomIcon</code> when <code>icon</code>{" "}
                is a URL.
              </p>
            </DefinitionRow>
            <DefinitionNote>All built-in <code>div</code> props.</DefinitionNote>
          </div>

          <h4 className="text-base font-semibold">Attributes</h4>
          <div className="grid gap-3">
            <DefinitionRow name="[frimousse-root]">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
            <DefinitionRow name="[data-focused]">
              <p>
                Present when the emoji picker or its inner elements are focused.
              </p>
            </DefinitionRow>
          </div>

          <h4 className="text-base font-semibold">CSS Variables</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="--frimousse-emoji-font"
              type={<code>&lt;string&gt;</code>}
            >
              <p>A list of font families to use when rendering emojis.</p>
            </DefinitionRow>
            <DefinitionRow
              name="--frimousse-viewport-width"
              type={<code>&lt;length&gt;</code>}
            >
              <p>The measured width of the viewport.</p>
            </DefinitionRow>
            <DefinitionRow
              name="--frimousse-viewport-height"
              type={<code>&lt;length&gt;</code>}
            >
              <p>The measured height of the viewport.</p>
            </DefinitionRow>
            <DefinitionRow
              name="--frimousse-row-height"
              type={<code>&lt;length&gt;</code>}
            >
              <p>The measured height of a row in the list.</p>
            </DefinitionRow>
            <DefinitionRow
              name="--frimousse-category-header-height"
              type={<code>&lt;length&gt;</code>}
            >
              <p>The measured height of a category header in the list.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-search">
          <h3 className="text-xl font-semibold">EmojiPicker.Search</h3>
          <p className="text-muted-foreground">A search input to filter the list of emojis.</p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.Root>
              // [!code highlight:1]
              <EmojiPicker.Search />
              <EmojiPicker.Viewport>
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          `}</CodeBlock>
          <p className="text-muted-foreground">It can be controlled or uncontrolled.</p>
          <CodeBlock lang="tsx">{`
            // [!code highlight:1]
            const [search, setSearch] = useState("");

            return (
              <EmojiPicker.Root>
                <EmojiPicker.Search
                  // [!code highlight:2]
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {/* ... */}
              </EmojiPicker.Root>
            );
          `}</CodeBlock>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionNote>All built-in <code>input</code> props.</DefinitionNote>
          </div>

          <h4 className="text-base font-semibold">Attributes</h4>
          <div className="grid gap-3">
            <DefinitionRow name="[frimousse-search]">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-viewport">
          <h3 className="text-xl font-semibold">EmojiPicker.Viewport</h3>
          <p className="text-muted-foreground">The scrolling container of the emoji picker.</p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.Root>
              <EmojiPicker.Search />
              // [!code highlight:1]
              <EmojiPicker.Viewport>
                <EmojiPicker.Loading>Loading...</EmojiPicker.Loading>
                <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
                <EmojiPicker.List />
              // [!code highlight:1]
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          `}</CodeBlock>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionNote>All built-in <code>div</code> props.</DefinitionNote>
          </div>

          <h4 className="text-base font-semibold">Attributes</h4>
          <div className="grid gap-3">
            <DefinitionRow name="[frimousse-viewport]">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-list">
          <h3 className="text-xl font-semibold">EmojiPicker.List</h3>
          <p className="text-muted-foreground">The list of emojis.</p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.Root>
              <EmojiPicker.Search />
              <EmojiPicker.Viewport>
                // [!code highlight:1]
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            Inner components within the list can be customized via the
            <code>components</code> prop.
          </p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.List
              // [!code highlight:11]
              components={{
                CategoryHeader: ({ category, ...props }) => (
                  <div {...props}>{category.label}</div>
                ),
                Emoji: ({ emoji, ...props }) => (
                  <button {...props}>
                    {emoji.emoji}
                  </button>
                ),
                Row: ({ children, ...props }) => <div {...props}>{children}</div>,
              }}
            />
          `}</CodeBlock>
          <p className="text-muted-foreground">
            Category headers receive icon metadata, and emojis can be flagged as custom.
          </p>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="components"
              type={<code>Partial&lt;EmojiPickerListComponents&gt;</code>}
            >
              <p>The inner components of the list.</p>
            </DefinitionRow>
            <DefinitionNote>All built-in <code>div</code> props.</DefinitionNote>
          </div>

          <h4 className="text-base font-semibold">Attributes</h4>
          <div className="grid gap-3">
            <DefinitionRow name="[frimousse-list]">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
          </div>

          <h4 className="text-base font-semibold">Inner Components</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="CategoryHeader"
              type={<code>EmojiPickerListCategoryHeaderProps</code>}
            >
              <p>The component used to render a sticky category header in the list.</p>
              <p className="text-muted-foreground/80">
                The <code>category</code> prop includes <code>icon</code> and{" "}
                <code>isCustomIcon</code> when provided.
              </p>
              <p className="text-muted-foreground/80">
                Note: All category headers should be of the same size.
              </p>
            </DefinitionRow>
            <DefinitionRow
              name="[frimousse-category-header]"
              className="ml-6"
            >
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
            <DefinitionRow
              name="category"
              type={<code>Category</code>}
              className="ml-6"
            >
              <p>The category for this sticky header.</p>
            </DefinitionRow>
            <DefinitionNote className="ml-6">
              All built-in <code>div</code> props.
            </DefinitionNote>

            <DefinitionRow name="Row" type={<code>EmojiPickerListRowProps</code>}>
              <p>The component used to render a row of emojis in the list.</p>
              <p className="text-muted-foreground/80">
                Note: All rows should be of the same size.
              </p>
            </DefinitionRow>
            <DefinitionRow name="[frimousse-row]" className="ml-6">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
            <DefinitionNote className="ml-6">
              All built-in <code>div</code> props.
            </DefinitionNote>

            <DefinitionRow name="Emoji" type={<code>EmojiPickerListEmojiProps</code>}>
              <p>The component used to render an emoji button in the list.</p>
              <p className="text-muted-foreground/80">
                The <code>emoji</code> prop includes <code>isCustom</code> for
                custom emojis.
              </p>
              <p className="text-muted-foreground/80">
                Note: All emojis should be of the same size.
              </p>
            </DefinitionRow>
            <DefinitionRow name="[frimousse-emoji]" className="ml-6">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
            <DefinitionRow name="[data-active]" className="ml-6">
              <p>
                Present when the emoji is currently active (either hovered or
                selected via keyboard navigation).
              </p>
            </DefinitionRow>
            <DefinitionRow
              name="emoji"
              type={
                <code>
                  Emoji &amp; {"{ isActive: boolean }"}
                </code>
              }
              className="ml-6"
            >
              <p>
                The emoji for this button, its label, and whether the emoji is
                currently active (either hovered or selected via keyboard
                navigation).
              </p>
            </DefinitionRow>
            <DefinitionNote className="ml-6">
              All built-in <code>button</code> props.
            </DefinitionNote>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-categorynav">
          <h3 className="text-xl font-semibold">EmojiPicker.CategoryNav</h3>
          <p className="text-muted-foreground">
            Exposes the available categories and scroll handlers via a render callback.
          </p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.CategoryNav>
              {({ categories }) => (
                <nav>
                  {categories.map(({ category, isActive, scrollTo }) => (
                    <button
                      key={category.label}
                      onClick={scrollTo}
                      data-active={isActive ? "" : undefined}
                    >
                      {category.icon ?? category.label}
                    </button>
                  ))}
                </nav>
              )}
            </EmojiPicker.CategoryNav>
          `}</CodeBlock>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="children"
              type={
                <code>
                  (props: EmojiPickerCategoryNavRenderProps) =&gt; ReactNode
                </code>
              }
            >
              <p>
                A render callback that receives the categories with active state
                and scroll handlers.
              </p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-loading">
          <h3 className="text-xl font-semibold">EmojiPicker.Loading</h3>
          <p className="text-muted-foreground">Only renders when the emoji data is loading.</p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.Root>
              <EmojiPicker.Search />
              <EmojiPicker.Viewport>
                // [!code highlight:1]
                <EmojiPicker.Loading>Loading...</EmojiPicker.Loading>
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          `}</CodeBlock>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionRow name="children" type={<code>ReactNode</code>}>
              <p>The content to render when the emoji data is loading.</p>
            </DefinitionRow>
            <DefinitionNote>All built-in <code>span</code> props.</DefinitionNote>
          </div>

          <h4 className="text-base font-semibold">Attributes</h4>
          <div className="grid gap-3">
            <DefinitionRow name="[frimousse-loading]">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-empty">
          <h3 className="text-xl font-semibold">EmojiPicker.Empty</h3>
          <p className="text-muted-foreground">
            Only renders when no emoji is found for the current search.
          </p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.Root>
              <EmojiPicker.Search />
              <EmojiPicker.Viewport>
                // [!code highlight:1]
                <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            It can also expose the current search via a render callback to build
            a more detailed empty state.
          </p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.Empty>
              {({ search }) => <>No emoji found for "{search}"</>}
            </EmojiPicker.Empty>
          `}</CodeBlock>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="children"
              type={
                <code>
                  ReactNode | ((props: EmojiPickerEmptyRenderProps) =&gt; ReactNode)
                </code>
              }
            >
              <p>
                The content to render when no emoji is found for the current
                search, or a render callback which receives the current search
                value.
              </p>
            </DefinitionRow>
            <DefinitionNote>All built-in <code>span</code> props.</DefinitionNote>
          </div>

          <h4 className="text-base font-semibold">Attributes</h4>
          <div className="grid gap-3">
            <DefinitionRow name="[frimousse-empty]">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-skintoneselector">
          <h3 className="text-xl font-semibold">EmojiPicker.SkinToneSelector</h3>
          <p className="text-muted-foreground">
            A button to change the current skin tone by cycling through the
            available skin tones.
          </p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.SkinToneSelector />
          `}</CodeBlock>
          <p className="text-muted-foreground">
            The emoji used as visual can be customized.
          </p>
          <CodeBlock lang="tsx">{`
            // [!code word:emoji]
            <EmojiPicker.SkinToneSelector emoji="👋" />
          `}</CodeBlock>
          <p className="text-muted-foreground">
            If you want to build a custom skin tone selector, you can use the
            <code>EmojiPicker.SkinTone</code> component or the
            <code>useSkinTone</code> hook.
          </p>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="emoji"
              type={<code>string</code>}
              defaultValue={<code>"✋"</code>}
            >
              <p>The emoji to use as visual for the skin tone variations.</p>
            </DefinitionRow>
            <DefinitionNote>All built-in <code>button</code> props.</DefinitionNote>
          </div>

          <h4 className="text-base font-semibold">Attributes</h4>
          <div className="grid gap-3">
            <DefinitionRow name="[frimousse-skin-tone-selector]">
              <p>Can be targeted in CSS for styling.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-skintone">
          <h3 className="text-xl font-semibold">EmojiPicker.SkinTone</h3>
          <p className="text-muted-foreground">
            Exposes the current skin tone and a function to change it via a
            render callback.
          </p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.SkinTone>
              {({ skinTone, setSkinTone }) => (
                <div>
                  <span>{skinTone}</span>
                  <button onClick={() => setSkinTone("none")}>Reset skin tone</button>
                </div>
              )}
            </EmojiPicker.SkinTone>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            It can be used to build a custom skin tone selector: pass an emoji
            you want to use as visual and it will return its skin tone
            variations.
          </p>
          <CodeBlock lang="tsx">{`
            const [skinTone, setSkinTone, skinToneVariations] = useSkinTone("👋");

            // (👋) (👋🏻) (👋🏼) (👋🏽) (👋🏾) (👋🏿)
            <EmojiPicker.SkinTone emoji="👋">
              {({ skinTone, setSkinTone, skinToneVariations }) => (
                skinToneVariations.map(({ skinTone, emoji }) => (
                  <button key={skinTone} onClick={() => setSkinTone(skinTone)}>
                    {emoji}
                  </button>
                ))
              )}
            </EmojiPicker.SkinTone>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            If you prefer to use a hook rather than a component, <code>useSkinTone</code> is
            also available. An already-built skin tone selector is also
            available via <code>EmojiPicker.SkinToneSelector</code>.
          </p>

          <h4 className="text-base font-semibold">Props</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="emoji"
              type={<code>string</code>}
              defaultValue={<code>"✋"</code>}
            >
              <p>The emoji to use as visual for the skin tone variations.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="emojipicker-activeemoji">
          <h3 className="text-xl font-semibold">EmojiPicker.ActiveEmoji</h3>
          <p className="text-muted-foreground">
            Exposes the currently active emoji (either hovered or selected via
            keyboard navigation) via a render callback.
          </p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.ActiveEmoji>
              {({ emoji }) => <span>{emoji}</span>}
            </EmojiPicker.ActiveEmoji>
          `}</CodeBlock>
          <p className="text-muted-foreground">It can be used to build a preview area next to the list.</p>
          <CodeBlock lang="tsx">{`
            <EmojiPicker.ActiveEmoji>
              {({ emoji }) => (
                <div>
                  {emoji ? (
                    <span>{emoji.emoji} {emoji.label}</span>
                  ) : (
                    <span>Select an emoji...</span>
                  )}
                </div>
              )}
            </EmojiPicker.ActiveEmoji>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            If you prefer to use a hook rather than a component, <code>useActiveEmoji</code> is
            also available.
          </p>
        </section>

        <section className="space-y-4" id="useskintone">
          <h3 className="text-xl font-semibold">useSkinTone</h3>
          <p className="text-muted-foreground">Returns the current skin tone and a function to change it.</p>
          <CodeBlock lang="tsx">{`
            const [skinTone, setSkinTone] = useSkinTone();
          `}</CodeBlock>
          <p className="text-muted-foreground">
            It can be used to build a custom skin tone selector: pass an emoji
            you want to use as visual and it will return its skin tone
            variations.
          </p>
          <CodeBlock lang="tsx">{`
            const [skinTone, setSkinTone, skinToneVariations] = useSkinTone("👋");

            // (👋) (👋🏻) (👋🏼) (👋🏽) (👋🏾) (👋🏿)
            skinToneVariations.map(({ skinTone, emoji }) => (
              <button key={skinTone} onClick={() => setSkinTone(skinTone)}>
                {emoji}
              </button>
            ));
          `}</CodeBlock>
          <p className="text-muted-foreground">
            If you prefer to use a component rather than a hook,
            <code>EmojiPicker.SkinTone</code> is also available. An already-built
            skin tone selector is also available via
            <code>EmojiPicker.SkinToneSelector</code>.
          </p>

          <h4 className="text-base font-semibold">Parameters</h4>
          <div className="grid gap-3">
            <DefinitionRow
              name="emoji"
              type={<code>string</code>}
              defaultValue={<code>"✋"</code>}
            >
              <p>The emoji to use as visual for the skin tone variations.</p>
            </DefinitionRow>
          </div>
        </section>

        <section className="space-y-4" id="useactiveemoji">
          <h3 className="text-xl font-semibold">useActiveEmoji</h3>
          <p className="text-muted-foreground">
            Returns the currently active emoji (either hovered or selected via
            keyboard navigation).
          </p>
          <CodeBlock lang="tsx">{`
            const activeEmoji = useActiveEmoji();
          `}</CodeBlock>
          <p className="text-muted-foreground">It can be used to build a preview area next to the list.</p>
          <CodeBlock lang="tsx">{`
            const activeEmoji = useActiveEmoji();

            <div>
              {activeEmoji ? (
                <span>{activeEmoji.emoji} {activeEmoji.label}</span>
              ) : (
                <span>Select an emoji...</span>
              )}
            </div>
          `}</CodeBlock>
          <p className="text-muted-foreground">
            If you prefer to use a component rather than a hook,
            <code>EmojiPicker.ActiveEmoji</code> is also available.
          </p>
        </section>
      </div>
    </section>
  );
}
