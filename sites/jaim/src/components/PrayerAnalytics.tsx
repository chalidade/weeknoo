import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { db, type PrayerDay } from '@/lib/db/db'
import { useUser } from '@/lib/auth'
import { BASE_DAY_SCORE, dayScore } from '@/lib/score'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const MONTHS_LONG = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

type Mode = 'bulan' | 'tahun'

interface Bucket {
  key: string
  /** x-axis tick */
  label: string
  /** tooltip / list title */
  long: string
  points: number
  /** recorded days */
  days: number
  /** null = no data in this bucket */
  pct: number | null
}

function PctTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: Bucket }>
}) {
  const b = payload?.[0]?.payload
  if (!active || !b) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm">
      <p className="font-semibold">{b.long}</p>
      <p className="mt-0.5 text-muted-foreground">
        {b.pct === null ? 'Tidak ada catatan' : `${b.pct}% · ${b.points} poin · ${b.days} hari tercatat`}
      </p>
    </div>
  )
}

export function PrayerAnalytics() {
  const user = useUser()
  const [rows, setRows] = useState<PrayerDay[] | null>(null)
  const [mode, setMode] = useState<Mode>('bulan')
  const [year, setYear] = useState(() => new Date().getFullYear())

  useEffect(() => {
    let cancelled = false
    void db.prayerLogs
      .where('userId')
      .equals(user.id)
      .toArray()
      .then((r) => {
        if (!cancelled) setRows(r)
      })
    return () => {
      cancelled = true
    }
  }, [user.id])

  const { buckets, years } = useMemo(() => {
    const empty = { buckets: [] as Bucket[], years: [] as number[] }
    if (!rows) return empty

    const byKey = new Map<string, { points: number; days: number }>()
    const yearSet = new Set<number>()
    for (const row of rows) {
      yearSet.add(Number(row.date.slice(0, 4)))
      const key = mode === 'bulan' ? row.date.slice(0, 7) : row.date.slice(0, 4)
      const agg = byKey.get(key) ?? { points: 0, days: 0 }
      agg.points += dayScore(row)
      agg.days += 1
      byKey.set(key, agg)
    }
    const years = [...yearSet].sort((a, b) => a - b)

    const toBucket = (key: string, label: string, long: string): Bucket => {
      const agg = byKey.get(key)
      return {
        key,
        label,
        long,
        points: agg?.points ?? 0,
        days: agg?.days ?? 0,
        pct: agg ? Math.round((agg.points / (agg.days * BASE_DAY_SCORE)) * 100) : null,
      }
    }

    const buckets =
      mode === 'bulan'
        ? MONTHS.map((label, m) =>
            toBucket(`${year}-${String(m + 1).padStart(2, '0')}`, label, `${MONTHS_LONG[m]} ${year}`),
          )
        : years.map((y) => toBucket(String(y), String(y), `Tahun ${y}`))

    return { buckets, years }
  }, [rows, mode, year])

  if (!rows) return null

  const pcts = buckets.map((b) => b.pct).filter((p): p is number => p !== null)
  const hasData = pcts.length > 0
  const yMax = Math.max(100, Math.ceil(Math.max(0, ...pcts) / 10) * 10)
  const yTicks = yMax <= 100 ? [0, 25, 50, 75, 100] : [0, 50, 100, yMax]

  // list rows: only buckets with data, each with its delta vs the previous
  // recorded bucket (percentage points)
  const withData = buckets.filter((b) => b.pct !== null)
  const deltas = new Map(
    withData.map((b, i) => [b.key, i === 0 ? null : b.pct! - withData[i - 1].pct!]),
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Analisis & Perbandingan</h2>
        <div className="flex gap-1">
          {(['bulan', 'tahun'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                mode === m
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m === 'bulan' ? 'Antar bulan' : 'Antar tahun'}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Persentase = poin ÷ (hari tercatat × {BASE_DAY_SCORE}). Bonus masjid bisa membuatnya
        melebihi 100%.
      </p>

      {mode === 'bulan' && years.length > 0 && (
        <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-xl border px-3 py-1.5 text-xs tabular-nums transition-colors ${
                y === year
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {!hasData ? (
        <p className="mt-4 rounded-xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
          {mode === 'bulan'
            ? `Belum ada catatan pada tahun ${year}.`
            : 'Belum ada catatan sholat.'}
        </p>
      ) : (
        <>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={buckets}
                margin={{ top: 4, right: 0, left: mode === 'bulan' ? -24 : -18, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: mode === 'bulan' ? 9 : 10, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  domain={[0, yMax]}
                  ticks={yTicks}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                />
                <Tooltip content={PctTooltip} cursor={{ fill: 'var(--muted)' }} />
                <ReferenceLine
                  y={100}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
                <Bar
                  dataKey="pct"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={mode === 'bulan' ? 14 : 26}
                  fill="var(--primary)"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-3 divide-y">
            {withData.map((b) => {
              const delta = deltas.get(b.key) ?? null
              return (
                <li key={b.key} className="flex items-center gap-2 py-2 text-xs">
                  <span className="w-24 shrink-0 font-medium">{b.long}</span>
                  <span className="flex-1 text-muted-foreground">
                    {b.points} poin · {b.days} hari
                  </span>
                  <span className="font-semibold tabular-nums">{b.pct}%</span>
                  {delta === null ? (
                    <span className="inline-flex w-14 items-center justify-end gap-0.5 text-muted-foreground/60">
                      <Minus className="size-3" />
                    </span>
                  ) : (
                    <span
                      className={`inline-flex w-14 items-center justify-end gap-0.5 tabular-nums ${
                        delta > 0
                          ? 'text-success'
                          : delta < 0
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {delta > 0 ? (
                        <TrendingUp className="size-3" />
                      ) : delta < 0 ? (
                        <TrendingDown className="size-3" />
                      ) : (
                        <Minus className="size-3" />
                      )}
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            Kolom terakhir: selisih (poin persen) terhadap {mode === 'bulan' ? 'bulan' : 'tahun'}{' '}
            tercatat sebelumnya.
          </p>
        </>
      )}
    </motion.section>
  )
}
