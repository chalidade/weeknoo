import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Droplet, Landmark } from 'lucide-react'
import {
  db,
  emptyDay,
  PRAYER_NAMES,
  type PrayerDay,
  type PrayerName,
  type PrayerStatus,
} from '@/lib/db/db'
import { PRAYER_LABELS } from '@/components/JadwalSholat'

const STATUS_OPTIONS: { value: PrayerStatus; label: string }[] = [
  { value: 'awal', label: 'Awal Waktu' },
  { value: 'akhir', label: 'Akhir Waktu' },
  { value: 'tidak', label: 'Tidak Sholat' },
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function PrayerTracker() {
  const days = useMemo(() => {
    const list: Date[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      list.push(d)
    }
    return list
  }, [])

  const todayKey = toKey(new Date())
  const [selected, setSelected] = useState(todayKey)
  const [day, setDay] = useState<PrayerDay | null>(null)

  useEffect(() => {
    let cancelled = false
    db.prayerDays.get(selected).then((row) => {
      if (!cancelled) setDay(row ?? emptyDay(selected))
    })
    return () => {
      cancelled = true
    }
  }, [selected])

  const save = (next: PrayerDay) => {
    setDay(next)
    void db.prayerDays.put(next)
  }

  const setStatus = (prayer: PrayerName, status: PrayerStatus) => {
    if (!day) return
    const current = day.prayers[prayer]
    save({
      ...day,
      prayers: {
        ...day.prayers,
        // tapping the active status clears it again
        [prayer]: { ...current, status: current.status === status ? null : status },
      },
    })
  }

  const toggleMasjid = (prayer: PrayerName) => {
    if (!day) return
    const current = day.prayers[prayer]
    save({
      ...day,
      prayers: { ...day.prayers, [prayer]: { ...current, masjid: !current.masjid } },
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl border bg-card p-5"
    >
      <h2 className="text-sm font-semibold">Catatan Sholat Harian</h2>

      <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {days.map((d) => {
          const key = toKey(d)
          const active = key === selected
          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`flex min-w-11 flex-col items-center rounded-xl border px-2 py-1.5 transition-colors ${
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-[10px]">{DAY_NAMES[d.getDay()]}</span>
              <span className="text-sm font-semibold tabular-nums">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      {day && (
        <>
          <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
            <input
              type="checkbox"
              checked={day.haid}
              onChange={() => save({ ...day, haid: !day.haid })}
              className="size-4 accent-[var(--primary)]"
            />
            <Droplet className="size-3.5 text-destructive" />
            <span className="text-sm">Sedang menstruasi</span>
          </label>

          {day.haid ? (
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2.5 text-xs text-secondary-foreground">
              Sedang haid — sholat tidak diwajibkan. Catatan hari ini tidak dihitung.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {PRAYER_NAMES.map((prayer) => {
                const entry = day.prayers[prayer]
                return (
                  <li key={prayer} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{PRAYER_LABELS[prayer]}</p>
                      <button
                        onClick={() => toggleMasjid(prayer)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                          entry.masjid
                            ? 'border-primary bg-secondary text-secondary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Landmark className="size-3" />
                        Di masjid
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {STATUS_OPTIONS.map((opt) => {
                        const active = entry.status === opt.value
                        const isNegative = opt.value === 'tidak'
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setStatus(prayer, opt.value)}
                            className={`rounded-lg border py-1.5 text-xs transition-colors ${
                              active
                                ? isNegative
                                  ? 'border-destructive bg-destructive text-white'
                                  : 'border-primary bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </motion.section>
  )
}
