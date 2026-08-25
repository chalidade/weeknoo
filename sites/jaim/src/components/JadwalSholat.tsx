import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { LocateFixed, MapPin } from 'lucide-react'
import { PRAYER_NAMES, type PrayerName } from '@/lib/db/db'
import {
  DEFAULT_COORDS,
  getPrayerTimes,
  loadSavedCoords,
  saveCoords,
  type Coords,
  type PrayerTimes,
} from '@/lib/prayer-times'

export const PRAYER_LABELS: Record<PrayerName, string> = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya',
}

function nextPrayer(times: Record<PrayerName, string>, now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  for (const name of PRAYER_NAMES) {
    const [h, m] = times[name].split(':').map(Number)
    const at = new Date(today)
    at.setHours(h, m, 0, 0)
    if (at > now) return { name, at }
  }
  // all passed — next is tomorrow's Subuh (approximated with today's time)
  const [h, m] = times.subuh.split(':').map(Number)
  const at = new Date(today)
  at.setDate(at.getDate() + 1)
  at.setHours(h, m, 0, 0)
  return { name: 'subuh' as PrayerName, at, tomorrow: true }
}

function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function JadwalSholat() {
  const [coords, setCoords] = useState<Coords>(() => loadSavedCoords() ?? DEFAULT_COORDS)
  const [jadwal, setJadwal] = useState<PrayerTimes | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let cancelled = false
    setJadwal(null)
    setError(null)
    getPrayerTimes(new Date(), coords)
      .then((j) => {
        if (!cancelled) setJadwal(j)
      })
      .catch(() => {
        if (!cancelled) setError('Gagal memuat jadwal — periksa koneksi internet.')
      })
    return () => {
      cancelled = true
    }
  }, [coords])

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c: Coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: 'Lokasimu',
        }
        saveCoords(c)
        setCoords(c)
      },
      () => setError('Izin lokasi ditolak — memakai jadwal Jakarta.'),
    )
  }

  const next = useMemo(
    () => (jadwal ? nextPrayer(jadwal.times, now) : null),
    [jadwal, now],
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Jadwal Sholat</h2>
        <button
          onClick={useMyLocation}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <LocateFixed className="size-3" />
          Gunakan lokasiku
        </button>
      </div>
      <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3" />
        {coords.label} · {jadwal?.dateReadable ?? '…'}
      </p>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

      {jadwal && next && (
        <>
          <div className="mt-4 rounded-xl bg-primary p-4 text-primary-foreground">
            <p className="text-xs opacity-80">
              Menuju {PRAYER_LABELS[next.name]}
              {'tomorrow' in next && next.tomorrow ? ' (besok)' : ''}
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold tabular-nums">
              {fmtCountdown(next.at.getTime() - now.getTime())}
            </p>
          </div>
          <ul className="mt-4 grid grid-cols-5 gap-1 text-center">
            {PRAYER_NAMES.map((name) => (
              <li
                key={name}
                className={`rounded-lg py-2 ${
                  name === next.name ? 'bg-secondary text-secondary-foreground' : ''
                }`}
              >
                <p className="text-[11px] text-muted-foreground">{PRAYER_LABELS[name]}</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums">
                  {jadwal.times[name]}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
      {!jadwal && !error && (
        <p className="mt-4 text-sm text-muted-foreground">Memuat jadwal…</p>
      )}
    </motion.section>
  )
}
