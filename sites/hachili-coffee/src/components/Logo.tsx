import { cn } from '@/lib/utils'

/** The Ha.Chi.Li mark: two interlocking honeycomb cells with bee antennae. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 52"
      fill="none"
      aria-hidden
      className={cn('size-8 text-primary', className)}
    >
      <g stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M22.5 16 L32 21.5 V36.5 L22.5 42 L13 36.5 V21.5 Z" />
        <path d="M41.5 16 L51 21.5 V36.5 L41.5 42 L32 36.5 V21.5 Z" />
        <path d="M27 18.6 Q24 10 19 6" />
        <path d="M37 18.6 Q40 10 45 6" />
      </g>
      <circle cx="18.5" cy="5.5" r="3" fill="currentColor" />
      <circle cx="45.5" cy="5.5" r="3" fill="currentColor" />
    </svg>
  )
}

/** A tiny bee — the menu book uses it to flag the crowd favourites. */
export function Bee({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-4', className)}>
      <ellipse cx="9" cy="7" rx="4" ry="3" className="fill-foreground/15" transform="rotate(-25 9 7)" />
      <ellipse cx="15" cy="6.5" rx="3.5" ry="2.6" className="fill-foreground/10" transform="rotate(20 15 6.5)" />
      <ellipse cx="12" cy="14" rx="7" ry="5" className="fill-accent" />
      <path d="M10 9.4 Q9 14 10 18.6 M13.5 9.2 Q12.5 14 13.5 18.8" className="stroke-foreground" strokeWidth="1.8" fill="none" />
      <circle cx="17.6" cy="13" r="1" className="fill-foreground" />
    </svg>
  )
}
