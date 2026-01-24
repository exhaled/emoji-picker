import type { ComponentProps } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import { ShadcnUiPopoverPreview } from "./shadcnui-popover.client";

export function ShadcnUiPopover({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn("not-prose relative overflow-hidden", className)}
      {...props}
    >
      <div className="relative isolate flex items-center justify-center rounded-t-lg border border-b-0 border-dotted bg-background">
        <ShadcnUiPopoverPreview />
      </div>
      <CodeBlock className="max-h-[304px] rounded-t-none" lang="tsx">{`
          "use client";

          import * as React from "react";

          import { Button } from "@/components/ui/button";
          import {
            EmojiPicker,
            EmojiPickerSearch,
            EmojiPickerCategoryNav,
            EmojiPickerContent,
          } from "@/components/ui/emoji-picker";
          import {
            Popover,
            PopoverContent,
            PopoverTrigger,
          } from "@/components/ui/popover";
          import type { Emoji } from "frimousse";

          export default function Page() {
            const [isOpen, setIsOpen] = React.useState(false);
            const customEmojis: Emoji[] = Array.from({ length: 20 }, (_, index) => ({
              emoji:
                "https://cdn.discordapp.com/emojis/1314725686359101532.webp?size=48&test=" +
                index,
              label: "Custom " + index,
              tags: ["custom", "custom-" + index],
              isCustom: true,
              category: 1,
            }));
            const customCategories = [
              {
                id: 1,
                index: 1000,
                label: "Custom",
              },
            ];

            return (
              <main className="flex h-full min-h-screen w-full items-center justify-center p-4">
                <Popover onOpenChange={setIsOpen} open={isOpen}>
                  <PopoverTrigger asChild>
                    <Button>Open emoji picker</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-0">
                    <EmojiPicker
                      className="h-[342px]"
                      customCategories={customCategories}
                      customEmojis={customEmojis}
                      onEmojiSelect={({ emoji }) => {
                        setIsOpen(false);
                        console.log(emoji);
                      }}
                    >
                      <EmojiPickerSearch />
                      <div className="flex min-h-0 flex-1">
                        <EmojiPickerCategoryNav />
                        <EmojiPickerContent />
                      </div>
                    </EmojiPicker>
                  </PopoverContent>
                </Popover>
              </main>
            );
          }
        `}</CodeBlock>
    </figure>
  );
}
