import type { ReactNode } from 'react'
import type { ChartSpec } from '@/data/types'
import { cn } from '@/lib/utils'

export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-2 text-xs text-deck">
          {i.dashed ? (
            <span className="h-0 w-5 border-t-2 border-dashed" style={{ borderColor: i.color }} />
          ) : (
            <span className="size-2.5" style={{ background: i.color }} />
          )}
          {i.label}
        </span>
      ))}
    </div>
  )
}

export function ChartFrame({ spec, exhibit, legend, children, className }: { spec: ChartSpec; exhibit?: number; legend?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <figure className={cn('print-avoid my-12 border-t-2 border-navy pt-5', className)}>
      {exhibit !== undefined && <p className="text-xs font-semibold tracking-[0.12em] text-royal uppercase">Exhibit {exhibit}</p>}
      <figcaption>
        <p className="mt-2 text-lg leading-snug font-semibold text-ink md:text-xl">{spec.title}</p>
        {spec.subtitle && <p className="mt-1 text-sm text-deck">{spec.subtitle}</p>}
      </figcaption>
      {legend && <div className="mt-4">{legend}</div>}
      <div className="mt-6">{children}</div>
      <p className="mt-5 border-t border-border pt-3 text-[0.6875rem] leading-relaxed text-muted-foreground">Source: {spec.source}</p>
    </figure>
  )
}

export function Tip({ children, style, className }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      style={style}
      className={cn('pointer-events-none absolute z-10 rounded-sm bg-navy px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg print:hidden', className)}
    >
      {children}
    </div>
  )
}
