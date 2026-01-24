import { EmojiPickerActiveEmoji } from "./emoji-picker/active-emoji";
import { EmojiPickerCategoryNav } from "./emoji-picker/category-nav";
import { EmojiPickerList } from "./emoji-picker/list";
import { EmojiPickerEmpty, EmojiPickerLoading } from "./emoji-picker/status";
import { EmojiPickerRoot } from "./emoji-picker/root";
import { EmojiPickerSearch } from "./emoji-picker/search";
import {
  EmojiPickerSkinTone,
  EmojiPickerSkinToneSelector,
} from "./emoji-picker/skin-tone";
import { EmojiPickerViewport } from "./emoji-picker/viewport";

EmojiPickerRoot.displayName = "EmojiPicker.Root";
EmojiPickerSearch.displayName = "EmojiPicker.Search";
EmojiPickerViewport.displayName = "EmojiPicker.Viewport";
EmojiPickerList.displayName = "EmojiPicker.List";
(
  EmojiPickerLoading as typeof EmojiPickerLoading & { displayName?: string }
).displayName = "EmojiPicker.Loading";
(
  EmojiPickerEmpty as typeof EmojiPickerEmpty & { displayName?: string }
).displayName = "EmojiPicker.Empty";
EmojiPickerSkinToneSelector.displayName = "EmojiPicker.SkinToneSelector";
(
  EmojiPickerActiveEmoji as typeof EmojiPickerActiveEmoji & {
    displayName?: string;
  }
).displayName = "EmojiPicker.ActiveEmoji";
(
  EmojiPickerCategoryNav as typeof EmojiPickerCategoryNav & {
    displayName?: string;
  }
).displayName = "EmojiPicker.CategoryNav";
(
  EmojiPickerSkinTone as typeof EmojiPickerSkinTone & { displayName?: string }
).displayName = "EmojiPicker.SkinTone";

export {
  EmojiPickerRoot as Root, //                         <EmojiPicker.Root />
  EmojiPickerSearch as Search, //                     <EmojiPicker.Search />
  EmojiPickerViewport as Viewport, //                 <EmojiPicker.Viewport />
  EmojiPickerList as List, //                         <EmojiPicker.List />
  EmojiPickerLoading as Loading, //                   <EmojiPicker.Loading />
  EmojiPickerEmpty as Empty, //                       <EmojiPicker.Empty />
  EmojiPickerSkinToneSelector as SkinToneSelector, // <EmojiPicker.SkinToneSelector />
  EmojiPickerActiveEmoji as ActiveEmoji, //           <EmojiPicker.ActiveEmoji />
  EmojiPickerCategoryNav as CategoryNav, //           <EmojiPicker.CategoryNav />
  EmojiPickerSkinTone as SkinTone, //                 <EmojiPicker.SkinTone />
};
