import type { ComponentProps } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import { ShadcnUiPreview } from "./shadcnui.client";

export function ShadcnUi({
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children">) {
  return (
    <figure
      className={cn("not-prose relative overflow-hidden", className)}
      {...props}
    >
      <div className="relative isolate flex items-center justify-center rounded-t-lg border border-b-0 border-dotted bg-background">
        <ShadcnUiPreview />
      </div>
      <CodeBlock className="max-h-[304px] rounded-t-none" lang="tsx">{`
          "use client";

          import * as React from "react";

          import {
            EmojiPicker,
            EmojiPickerSearch,
            EmojiPickerContent,
          } from "@/components/ui/emoji-picker";

          export default function Page() {
            return (
              <main className="flex h-full min-h-screen w-full items-center justify-center p-4">
                <EmojiPicker
                  className="h-[326px] rounded-lg border shadow-md"
                  onEmojiSelect={({ emoji }) => {
                    console.log(emoji);
                  }}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                </EmojiPicker>
              </main>
            );
          }
        `}</CodeBlock>
    </figure>
  );
}
