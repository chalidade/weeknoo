import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import type { ChartSpec } from '@/data/types'
import { formatValue } from '@/lib/format'
import { ChartFrame } from './ChartFrame'
import { SERIES_COLORS } from './scale'
import { cn } from '@/lib/utils'

const R = 70
const C = 2 * Math.PI * R

export function PieChart({ spec, exhibit, staticRender }: { spec: ChartSpec; exhibit?: number; staticRender?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' }) || staticRender
  const [hover, setHover] = useState<number | null>(null)
  const total = spec.data.reduce((s, d) => s + d.value, 0)
  const unit = spec.unit ?? ''
  let acc = 0
  const segs = spec.data.map((d, i) => {
    const frac = d.value / total
    const seg = { ...d, i, frac, offset: acc, color: d.color ?? SERIES_COLORS[i % SERIES_COLORS.length] }
    acc += frac
    return seg
  })
  const focus = hover !== null ? segs[hover] : segs[0]

  return (
    <ChartFrame spec={spec} exhibit={exhibit}>
      <div ref={ref} className="grid items-center gap-8 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-12">
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[15rem]"
          initial={staticRender ? false : { opacity: 0, rotate: -40, scale: 0.92 }}
          animate={inView ? { opacity: 1, rotate: 0, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            {segs.map((s) => (
              <circle
                key={s.label}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={hover === s.i ? 40 : 32}
                strokeDasharray={`${Math.max(s.frac * C - 1.5, 0)} ${C}`}
                strokeDashoffset={-s.offset * C}
                className="cursor-pointer transition-[stroke-width]"
                style={{ opacity: hover === null || hover === s.i ? 1 : 0.35 }}
                onMouseEnter={() => setHover(s.i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover(hover === s.i ? null : s.i)}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
            <span className="text-3xl font-semibold tracking-tight text-navy tabular-nums">{formatValue(focus.value, unit)}</span>
            <span className="mt-1 text-[0.6875rem] leading-tight text-deck">{focus.label}</span>
          </div>
        </motion.div>
        <ul className="divide-y divide-border border-y border-border">
          {segs.map((s) => (
            <li
              key={s.label}
              className={cn('flex cursor-default items-center justify-between gap-4 py-3 text-sm transition-colors', hover === s.i ? 'text-royal' : 'text-ink')}
              onMouseEnter={() => setHover(s.i)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="flex items-center gap-3">
                <span className="size-3 shrink-0" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="font-semibold tabular-nums">{formatValue(s.value, unit)}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartFrame>
  )
}
