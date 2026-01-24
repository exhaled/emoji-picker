"use client";

import type { Emoji } from "frimousse";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { ExamplePreview } from "../example-preview";
import { Button } from "./ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerCategoryNav,
  EmojiPickerSearch,
} from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function ShadcnUiPopoverPreview() {
  const [isOpen, setIsOpen] = useState(false);
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
    <ExamplePreview className="not-base shadcnui h-[200px]">
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button>Open emoji picker</Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <EmojiPicker
            className="h-[342px]"
            customCategories={customCategories}
            customEmojis={customEmojis}
            onEmojiSelect={(emoji) => {
              setIsOpen(false);
              toast(emoji);
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
    </ExamplePreview>
  );
}
