import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  CircleAlert,
  CircleCheck,
  Droplet,
  Landmark,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { db, PRAYER_NAMES, type PrayerDay, type PrayerName } from '@/lib/db/db'
import { useUser } from '@/lib/auth'
import {
  BASE_DAY_SCORE,
  dayScore,
  evaluate,
  MAX_DAY_SCORE,
  MAX_PRAYER_SCORE,
  prayerScore,
  type Evaluation,
} from '@/lib/score'
import { PRAYER_LABELS } from '@/components/JadwalSholat'

const RANGES = [7, 14, 30] as const
type Range = (typeof RANGES)[number]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface ChartDatum {
  date: string
  /** day of month, the x tick */
  label: string
  /** "18 Agu" for the tooltip */
  long: string
  score: number
  haid: boolean
  recorded: boolean
}

const TONE_TEXT: Record<Evaluation['tone'], string> = {
  success: 'text-success',
  primary: 'text-primary',
  warning: 'text-warning',
  destructive: 'text-destructive',
}

const TONE_ICON: Record<Evaluation['tone'], typeof CircleCheck> = {
  success: Sparkles,
  primary: CircleCheck,
  warning: TrendingUp,
  destructive: CircleAlert,
}

function ScoreTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: ChartDatum }>
}) {
  const d = payload?.[0]?.payload
  if (!active || !d) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm">
      <p className="font-semibold">{d.long}</p>
      <p className="mt-0.5 text-muted-foreground">
        {d.haid
          ? `Hari haid — nilai ${d.score}`
          : d.recorded
            ? `Skor ${d.score} · target ${BASE_DAY_SCORE}`
            : 'Belum dicatat'}
      </p>
    </div>
  )
}

export function PrayerStats() {
  const user = useUser()
  const [range, setRange] = useState<Range>(7)
  const [rows, setRows] = useState<PrayerDay[] | null>(null)

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

  const stats = useMemo(() => {
    if (!rows) return null
    const byDate = new Map(rows.map((r) => [r.date, r]))
    const data: ChartDatum[] = []
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = toKey(d)
      const row = byDate.get(key)
      data.push({
        date: key,
        label: String(d.getDate()),
        long: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
        score: row ? dayScore(row) : 0,
        haid: row?.haid ?? false,
        recorded: !!row,
      })
    }

    const total = data.reduce((s, d) => s + d.score, 0)
    const pct = Math.round((total / (range * BASE_DAY_SCORE)) * 100)
    const fullDays = data.filter((d) => d.score >= BASE_DAY_SCORE).length
    const recordedDays = data.filter((d) => d.recorded).length

    let masjidCount = 0
    const perPrayer: Record<PrayerName, number> = {
      subuh: 0,
      dzuhur: 0,
      ashar: 0,
      maghrib: 0,
      isya: 0,
    }
    let scoredDays = 0
    for (const d of data) {
      const row = byDate.get(d.date)
      if (!row || row.haid) continue
      scoredDays++
      for (const name of PRAYER_NAMES) {
        perPrayer[name] += prayerScore(row.prayers[name])
        const entry = row.prayers[name]
        if (entry.masjid && entry.status !== null && entry.status !== 'tidak') masjidCount++
      }
    }

    return { data, total, pct, fullDays, recordedDays, masjidCount, perPrayer, scoredDays }
  }, [rows, range])

  if (!stats) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Memuat…</p>
  }

  const evaluation = evaluate(stats.pct)
  const EvalIcon = TONE_ICON[evaluation.tone]
  const hasHaid = stats.data.some((d) => d.haid)

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card p-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Evaluasi Sholat</h2>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full border px-2.5 py-1 text-[11px] tabular-nums transition-colors ${
                  range === r
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r} hari
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-muted p-4">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tabular-nums">{stats.pct}%</p>
            <p className="text-xs text-muted-foreground">
              {stats.total} poin · target {range * BASE_DAY_SCORE} (semua awal waktu)
            </p>
          </div>
          <p
            className={`mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold ${TONE_TEXT[evaluation.tone]}`}
          >
            <EvalIcon className="size-4" />
            {evaluation.label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{evaluation.detail}</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border px-3 py-2.5">
            <p className="text-lg font-bold tabular-nums">{stats.fullDays}</p>
            <p className="text-[11px] text-muted-foreground">hari capai target</p>
          </div>
          <div className="rounded-xl border px-3 py-2.5">
            <p className="inline-flex items-center gap-1.5 text-lg font-bold tabular-nums">
              <Landmark className="size-4 text-primary" />
              {stats.masjidCount}
            </p>
            <p className="text-[11px] text-muted-foreground">sholat di masjid</p>
          </div>
        </div>

        <div className="mt-5 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={range === 7 ? 0 : range === 14 ? 1 : 4}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                domain={[0, MAX_DAY_SCORE]}
                ticks={[0, 5, 10, 15]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip content={ScoreTooltip} cursor={{ fill: 'var(--muted)' }} />
              <ReferenceLine
                y={BASE_DAY_SCORE}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false}>
                {stats.data.map((d) => (
                  <Cell key={d.date} fill={d.haid ? 'var(--haid)' : 'var(--primary)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Skor harian — garis putus-putus = target {BASE_DAY_SCORE}, bonus masjid s.d.{' '}
            {MAX_DAY_SCORE}
          </span>
          {hasHaid && (
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-haid" />
              <Droplet className="size-3 text-haid" />
              Hari haid (nilai 2/sholat)
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          {stats.recordedDays} dari {range} hari tercatat — hari tanpa catatan dihitung 0.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5"
      >
        <h2 className="text-sm font-semibold">Rata-rata per Sholat</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Skor 0–{MAX_PRAYER_SCORE}: tidak sholat 0 · akhir waktu 1 · awal waktu 2. Bonus +1 di
          masjid bisa melampaui {MAX_PRAYER_SCORE}.
        </p>
        <ul className="mt-4 space-y-3">
          {PRAYER_NAMES.map((name) => {
            const avg = stats.scoredDays > 0 ? stats.perPrayer[name] / stats.scoredDays : 0
            return (
              <li key={name}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-medium">{PRAYER_LABELS[name]}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {avg.toFixed(1)}/{MAX_PRAYER_SCORE}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(100, (avg / MAX_PRAYER_SCORE) * 100)}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
        {stats.scoredDays === 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Belum ada catatan sholat pada rentang ini.
          </p>
        )}
      </motion.section>
    </>
  )
}
