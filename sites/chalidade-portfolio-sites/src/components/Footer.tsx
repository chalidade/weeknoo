import { ArrowUp } from 'lucide-react'
import { profile } from '@/lib/profile'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            {profile.name}
            <span className="text-brand-ink">.</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {profile.role} · {profile.tagline}
          </p>
        </div>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
        >
          Back to top
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  )
}
