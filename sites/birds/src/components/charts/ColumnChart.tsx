import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import type { ChartSpec } from '@/data/types'
import { formatValue } from '@/lib/format'
import { ChartFrame, Legend, Tip } from './ChartFrame'
import { niceScale } from './scale'

export function ColumnChart({ spec, exhibit, staticRender }: { spec: ChartSpec; exhibit?: number; staticRender?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' }) || staticRender
  const [hover, setHover] = useState<number | null>(null)
  const hasBench = spec.data.some((d) => d.benchmark !== undefined)
  const { max, ticks } = niceScale(Math.max(...spec.data.flatMap((d) => [d.value, d.benchmark ?? 0])))
  const unit = spec.unit ?? ''

  const legend = hasBench ? (
    <Legend items={[{ label: spec.valueLabel ?? 'Value', color: 'var(--chart-2)' }, { label: spec.benchmarkLabel ?? 'Benchmark', color: 'var(--chart-4)' }]} />
  ) : undefined

  return (
    <ChartFrame spec={spec} exhibit={exhibit} legend={legend}>
      <div ref={ref} className="flex">
        <div className="relative w-10 shrink-0 text-right text-[0.6875rem] text-muted-foreground" style={{ height: 260 }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-2" style={{ bottom: `${(t / max) * 100}%`, transform: 'translateY(50%)' }}>
              {formatValue(t)}
            </span>
          ))}
        </div>
        <div className="flex-1">
          <div className="relative border-b border-navy" style={{ height: 260 }}>
            {ticks.slice(1).map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-border" style={{ bottom: `${(t / max) * 100}%` }} />
            ))}
            <div className="absolute inset-0 flex items-end justify-around gap-2 px-1 sm:gap-4">
              {spec.data.map((d, i) => (
                <div
                  key={d.label}
                  className="relative flex h-full flex-1 items-end justify-center gap-1 sm:gap-1.5"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(hover === i ? null : i)}
                >
                  {[{ v: d.value, c: d.color ?? 'var(--chart-2)' }, ...(hasBench && d.benchmark !== undefined ? [{ v: d.benchmark, c: 'var(--chart-4)' }] : [])].map((bar, k) => (
                    <motion.div
                      key={k}
                      className="relative w-full max-w-12 cursor-pointer"
                      style={{ background: bar.c, opacity: hover === null || hover === i ? 1 : 0.35 }}
                      initial={{ height: staticRender ? `${(bar.v / max) * 100}%` : 0 }}
                      animate={{ height: inView ? `${(bar.v / max) * 100}%` : 0 }}
                      transition={{ duration: 0.8, delay: i * 0.07 + k * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {k === 0 && (
                        <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[0.6875rem] font-semibold text-navy sm:block">{formatValue(bar.v, unit)}</span>
                      )}
                    </motion.div>
                  ))}
                  {hover === i && (
                    <Tip style={{ left: '50%', bottom: `${(Math.max(d.value, d.benchmark ?? 0) / max) * 100 + 9}%`, top: 'auto', transform: 'translateX(-50%)' }}>
                      <p className="font-semibold">{d.label}</p>
                      <p>
                        {spec.valueLabel ?? 'Value'}: {formatValue(d.value, unit)}
                      </p>
                      {d.benchmark !== undefined && (
                        <p className="text-white/70">
                          {spec.benchmarkLabel ?? 'Benchmark'}: {formatValue(d.benchmark, unit)}
                        </p>
                      )}
                    </Tip>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-around gap-2 px-1 pt-2 sm:gap-4">
            {spec.data.map((d) => (
              <span key={d.label} className="flex-1 text-center text-[0.6875rem] leading-tight text-deck sm:text-xs">
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ChartFrame>
  )
}
