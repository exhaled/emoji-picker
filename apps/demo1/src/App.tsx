import { Toaster } from "sonner";
import { ColorfulButtonsAlternate } from "@/examples/colorful-buttons/colorful-buttons-alternate";
import { ColorfulButtonsBlur } from "@/examples/colorful-buttons/colorful-buttons-blur";
import { ShadcnUi } from "@/examples/shadcnui/shadcnui";
import { ShadcnUiCustomEmojis } from "@/examples/shadcnui/shadcnui-custom-emojis";
import { ShadcnUiPopover } from "@/examples/shadcnui/shadcnui-popover";
import { Usage } from "@/examples/usage/usage";
import { ApiReference } from "@/sections/api-reference";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="bottom-right" richColors />
      <header className="border-border/70 border-b border-dotted">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:py-16">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-dotted border-muted-foreground/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Emoji Picker
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Frimousse demo playground
            </h1>
            <p className="max-w-2xl text-pretty text-muted-foreground">
              A Vite-powered sandbox with usage patterns, shadcn/ui variants,
              and styling experiments for the emoji picker.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-12 sm:py-16">
        <section className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Core Usage
            </p>
            <h2 className="text-2xl font-semibold">Compose the picker</h2>
            <p className="text-muted-foreground">
              Build a picker with Tailwind classes or raw CSS selectors.
            </p>
          </div>
          <Usage />
        </section>

        <section className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Shadcn/ui
            </p>
            <h2 className="text-2xl font-semibold">Drop-in components</h2>
            <p className="text-muted-foreground">
              Ready-made shadcn/ui compositions, including popovers and custom
              emojis.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <ShadcnUi />
            <ShadcnUiPopover />
            <ShadcnUiCustomEmojis />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Styling
            </p>
            <h2 className="text-2xl font-semibold">Colorful buttons</h2>
            <p className="text-muted-foreground">
              Two variations of colorful emoji button feedback.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ColorfulButtonsBlur />
            <ColorfulButtonsAlternate />
          </div>
        </section>

        <ApiReference />
      </main>
    </div>
  );
}

export default App;
