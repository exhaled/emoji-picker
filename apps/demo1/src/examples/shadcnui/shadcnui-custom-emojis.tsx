import type { ComponentProps } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import { ShadcnUiCustomEmojisPreview } from "./shadcnui-custom-emojis.client";

export function ShadcnUiCustomEmojis({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn("not-prose relative overflow-hidden", className)}
      {...props}
    >
      <div className="relative isolate flex items-center justify-center rounded-t-lg border border-b-0 border-dotted bg-background">
        <ShadcnUiCustomEmojisPreview />
      </div>
      <CodeBlock className="max-h-[304px] rounded-t-none" lang="tsx">{`
          "use client";

          import type { Emoji } from "frimousse";
          import * as React from "react";

          import {
            EmojiPicker,
            EmojiPickerSearch,
            EmojiPickerCategoryNav,
            EmojiPickerContent,
            EmojiPickerFooter,
          } from "@/components/ui/emoji-picker";

          export default function Page() {
            const customEmojis: Emoji[] = [];

            for (let i = 0; i < 20; i++) {
              customEmojis.push({
                emoji:
                  "https://cdn.discordapp.com/emojis/1314725686359101532.webp?size=48&test=" +
                  i,
                label: "Custom " + i,
                tags: ["custom", "custom-" + i],
                isCustom: true,
                category: 1, // References the category with id: 1
              });
            }

            const customCategories = [
              {
                id: 1, // Unique identifier for this category
                index: 1000, // Display order (lowest first)
                label: "Custom",
                icon: "",
              },
            ];

            return (
              <main className="flex h-full min-h-screen w-full items-center justify-center p-4">
                <EmojiPicker
                  className="h-[342px]"
                  customCategories={customCategories}
                  customEmojis={customEmojis}
                  onEmojiSelect={(emoji) => {
                    console.log(emoji);
                  }}
                >
                  <EmojiPickerSearch />
                  <div className="flex min-h-0 flex-1">
                    <EmojiPickerCategoryNav />
                    <EmojiPickerContent />
                  </div>
                  <EmojiPickerFooter />
                </EmojiPicker>
              </main>
            );
          }
        `}</CodeBlock>
    </figure>
  );
}
