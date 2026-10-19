import Link from "next/link";
import { Sparkles, Layers } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Pixora<span className="text-violet-500">.ai</span>
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md hover:shadow-violet-600/20 active:scale-95"
          >
            <Layers className="h-4 w-4" />
            <span>Open Editor</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
