import { Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="shrink-0 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight">ask</h1>
          <p className="truncate text-xs text-muted-foreground">
            AI yang jalan di komputermu — gratis, tanpa internet, tanpa API key
          </p>
        </div>
      </div>
    </header>
  )
}
