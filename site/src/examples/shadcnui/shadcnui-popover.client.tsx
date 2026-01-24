"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import { ExamplePreview } from "../example-preview";
import { Button } from "./ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerCategoryNav,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "./ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function ShadcnUiPopoverPreview() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ExamplePreview className="not-base shadcnui h-[200px]">
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button>Open emoji picker</Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={(emoji) => {
              setIsOpen(false);
              toast(emoji);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerCategoryNav />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    </ExamplePreview>
  );
}
