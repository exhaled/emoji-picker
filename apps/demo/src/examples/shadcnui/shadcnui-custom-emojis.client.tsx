"use client";

import type { Emoji } from "frimousse";
import { toast } from "@/lib/toast";
import { ExamplePreview } from "../example-preview";
import {
  EmojiPicker,
  EmojiPickerCategoryNav,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "./ui/emoji-picker";

export function ShadcnUiCustomEmojisPreview() {
  const customEmojis: Emoji[] = [];

  for (let i = 0; i < 20; i++) {
    customEmojis.push({
      emoji:
        "https://cdn.discordapp.com/emojis/1314725686359101532.webp?size=48&test=" +
        i,
      label: "Custom " + i,
      tags: ["custom", "custom-" + i],
      isCustom: true,
      category: 1,
    });
  }

  const customCategories = [
    {
      id: 1,
      index: 1000,
      label: "Custom",
      icon: "",
    },
  ];

  return (
    <ExamplePreview className="not-base shadcnui h-[446px]">
      <EmojiPicker
        className="h-[342px]"
        customCategories={customCategories}
        customEmojis={customEmojis}
        onEmojiSelect={(emoji) => {
          toast(emoji);
        }}
      >
        <EmojiPickerSearch />
        <div className="flex min-h-0 flex-1">
          <EmojiPickerCategoryNav />
          <EmojiPickerContent />
        </div>
        <EmojiPickerFooter />
      </EmojiPicker>
    </ExamplePreview>
  );
}
