import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import type { ChartSpec } from '@/data/types'
import { formatValue } from '@/lib/format'
import { ChartFrame, Legend, Tip } from './ChartFrame'
import { niceScale } from './scale'

const H = 260

export function LineChart({ spec, exhibit, staticRender }: { spec: ChartSpec; exhibit?: number; staticRender?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' }) || staticRender
  const [hover, setHover] = useState<number | null>(null)
  const hasBench = spec.data.some((d) => d.benchmark !== undefined)
  const all = spec.data.flatMap((d) => [d.value, d.benchmark ?? d.value])
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  // Start the axis near the data rather than at zero, as editorial trend charts do.
  const floorStep = Math.pow(10, Math.floor(Math.log10(Math.max(hi - lo, 1))))
  const min = Math.max(0, Math.floor((lo - (hi - lo) * 0.15) / floorStep) * floorStep)
  const { max: span, ticks: rawTicks } = niceScale(hi - min)
  const max = min + span
  const ticks = rawTicks.map((t) => t + min)
  const unit = spec.unit ?? ''
  const n = spec.data.length
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100)
  const y = (v: number) => 100 - ((v - min) / (max - min)) * 100
  const path = (key: 'value' | 'benchmark') =>
    spec.data
      .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y((key === 'value' ? d.value : d.benchmark) ?? d.value)}`)
      .join(' ')

  const legend = (
    <Legend
      items={[
        { label: spec.valueLabel ?? 'Value', color: 'var(--chart-2)' },
        ...(hasBench ? [{ label: spec.benchmarkLabel ?? 'Benchmark', color: 'var(--chart-4)', dashed: true }] : []),
      ]}
    />
  )

  return (
    <ChartFrame spec={spec} exhibit={exhibit} legend={legend}>
      <div ref={ref} className="flex">
        <div className="relative w-12 shrink-0 text-[0.6875rem] text-muted-foreground" style={{ height: H }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-2" style={{ bottom: `${((t - min) / (max - min)) * 100}%`, transform: 'translateY(50%)' }}>
              {formatValue(t)}
            </span>
          ))}
        </div>
        <div className="flex-1 pr-6">
          <div className="relative border-b border-navy" style={{ height: H }} onMouseLeave={() => setHover(null)}>
            {ticks.slice(1).map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-border" style={{ bottom: `${((t - min) / (max - min)) * 100}%` }} />
            ))}
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: staticRender ? 'inset(-10% 0% -10% 0%)' : 'inset(-10% 100% -10% 0%)' }}
              animate={{ clipPath: inView ? 'inset(-10% 0% -10% 0%)' : 'inset(-10% 100% -10% 0%)' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              {hasBench && (
                <path
                  d={path('benchmark')}
                  fill="none"
                  stroke="var(--chart-4)"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <path
                d={path('value')}
                fill="none"
                stroke="var(--chart-2)"
                strokeWidth="3"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            </motion.div>
            {hover !== null && <div className="absolute top-0 bottom-0 border-l border-navy/30" style={{ left: `${x(hover)}%` }} />}
            {spec.data.map((d, i) => (
              <div key={d.label}>
                <span
                  className="absolute size-3 rounded-full border-2 border-royal bg-white transition-transform"
                  style={{ left: `${x(i)}%`, bottom: `${100 - y(d.value)}%`, transform: `translate(-50%, 50%) scale(${hover === i ? 1.35 : 1})` }}
                />
                {d.benchmark !== undefined && (
                  <span className="absolute size-2 rounded-full bg-slate" style={{ left: `${x(i)}%`, bottom: `${100 - y(d.benchmark)}%`, transform: 'translate(-50%, 50%)' }} />
                )}
                {/* hover column */}
                <button
                  aria-label={`${d.label}: ${formatValue(d.value, unit)}`}
                  className="absolute top-0 bottom-0 cursor-crosshair"
                  style={{ left: `${x(i) - 50 / Math.max(n - 1, 1)}%`, width: `${100 / Math.max(n - 1, 1)}%` }}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onClick={() => setHover(i)}
                />
              </div>
            ))}
            {hover !== null && (
              <Tip
                style={{
                  left: `${Math.min(Math.max(x(hover), 12), 88)}%`,
                  bottom: `${100 - y(Math.max(spec.data[hover].value, spec.data[hover].benchmark ?? 0)) + 8}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <p className="font-semibold">{spec.data[hover].label}</p>
                <p>
                  {spec.valueLabel ?? 'Value'}: {formatValue(spec.data[hover].value, unit)}
                </p>
                {spec.data[hover].benchmark !== undefined && (
                  <p className="text-white/70">
                    {spec.benchmarkLabel ?? 'Benchmark'}: {formatValue(spec.data[hover].benchmark!, unit)}
                  </p>
                )}
              </Tip>
            )}
          </div>
          <div className="relative h-6">
            {spec.data.map((d, i) => (
              <span key={d.label} className="absolute top-2 -translate-x-1/2 text-[0.6875rem] text-deck sm:text-xs" style={{ left: `${x(i)}%` }}>
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ChartFrame>
  )
}
