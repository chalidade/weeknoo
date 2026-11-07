import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import type { ChartSpec } from '@/data/types'
import { formatValue } from '@/lib/format'
import { ChartFrame, Legend } from './ChartFrame'
import { niceScale } from './scale'
import { cn } from '@/lib/utils'

export function BarChart({ spec, exhibit, staticRender }: { spec: ChartSpec; exhibit?: number; staticRender?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' }) || staticRender
  const [hover, setHover] = useState<number | null>(null)
  const hasBench = spec.data.some((d) => d.benchmark !== undefined)
  const { max } = niceScale(Math.max(...spec.data.flatMap((d) => [d.value, d.benchmark ?? 0])))
  const unit = spec.unit ?? ''
  const top = Math.max(...spec.data.map((d) => d.value))

  const legend = hasBench ? (
    <Legend items={[{ label: spec.valueLabel ?? 'Value', color: 'var(--chart-2)' }, { label: spec.benchmarkLabel ?? 'Benchmark', color: 'var(--chart-1)', dashed: true }]} />
  ) : undefined

  return (
    <ChartFrame spec={spec} exhibit={exhibit} legend={legend}>
      <div ref={ref} className="space-y-4">
        {spec.data.map((d, i) => (
          <div
            key={d.label}
            className="grid cursor-default grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:items-center sm:gap-5"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className={cn('text-sm leading-snug transition-colors', hover === i ? 'text-royal' : 'text-ink')}>{d.label}</span>
            <div className="flex items-center gap-3">
              <div className="relative h-7 flex-1 bg-muted">
                <motion.div
                  className="h-full"
                  style={{ background: d.color ?? (d.value === top ? 'var(--chart-1)' : 'var(--chart-2)'), opacity: hover === null || hover === i ? 1 : 0.4 }}
                  initial={{ width: staticRender ? `${(d.value / max) * 100}%` : 0 }}
                  animate={{ width: inView ? `${(d.value / max) * 100}%` : 0 }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
                {d.benchmark !== undefined && (
                  <div className="absolute -top-1 -bottom-1 border-l-2 border-dashed border-navy" style={{ left: `${(d.benchmark / max) * 100}%` }} title={`${spec.benchmarkLabel ?? 'Benchmark'}: ${formatValue(d.benchmark, unit)}`} />
                )}
              </div>
              <span className="w-16 shrink-0 text-right text-sm font-semibold text-navy tabular-nums">{formatValue(d.value, unit)}</span>
            </div>
          </div>
        ))}
      </div>
      {hasBench && hover !== null && spec.data[hover].benchmark !== undefined && (
        <p className="mt-4 text-xs text-deck">
          <span className="font-semibold text-navy">{spec.data[hover].label}:</span> {formatValue(spec.data[hover].value, unit)} vs {spec.benchmarkLabel ?? 'benchmark'} {formatValue(spec.data[hover].benchmark!, unit)}
        </p>
      )}
    </ChartFrame>
  )
}
