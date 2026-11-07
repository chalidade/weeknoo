/** Rounds up to a "nice" axis maximum and returns evenly spaced ticks. */
export function niceScale(maxValue: number, tickCount = 4) {
  const raw = maxValue / tickCount
  const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag
  const max = step * tickCount
  return { max, ticks: Array.from({ length: tickCount + 1 }, (_, i) => +(i * step).toFixed(6)) }
}

export const SERIES_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
