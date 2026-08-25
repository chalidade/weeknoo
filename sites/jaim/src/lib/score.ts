// Prayer scoring — the evaluation scale of the app:
//   tidak sholat = 0, akhir waktu = 1, awal waktu = 2, +1 bila di masjid.
//   Hari haid: sholat tidak diwajibkan, tiap sholat dihitung 2 (setara awal
//   waktu) agar evaluasi tidak turun karena udzur.
import { PRAYER_NAMES, type PrayerDay, type PrayerEntry } from '@/lib/db/db'

/** Max per prayer: awal waktu (2) + masjid (1). */
export const MAX_PRAYER_SCORE = 3
export const HAID_PRAYER_SCORE = 2
export const MAX_DAY_SCORE = MAX_PRAYER_SCORE * PRAYER_NAMES.length

export function prayerScore(entry: PrayerEntry): number {
  if (entry.status === null || entry.status === 'tidak') return 0
  const base = entry.status === 'awal' ? 2 : 1
  return base + (entry.masjid ? 1 : 0)
}

export function dayScore(day: PrayerDay): number {
  if (day.haid) return HAID_PRAYER_SCORE * PRAYER_NAMES.length
  return PRAYER_NAMES.reduce((sum, name) => sum + prayerScore(day.prayers[name]), 0)
}

export interface Evaluation {
  label: string
  detail: string
  tone: 'success' | 'primary' | 'warning' | 'destructive'
}

/** Map a 0–100 percentage to an evaluation tier. */
export function evaluate(pct: number): Evaluation {
  if (pct >= 80)
    return {
      label: 'Istiqomah',
      detail: 'Masya Allah, pertahankan sholat di awal waktu!',
      tone: 'success',
    }
  if (pct >= 60)
    return {
      label: 'Baik',
      detail: 'Sudah bagus — kejar awal waktu dan berjamaah di masjid.',
      tone: 'primary',
    }
  if (pct >= 40)
    return {
      label: 'Perlu ditingkatkan',
      detail: 'Masih sering terlewat — pasang pengingat tiap masuk waktu.',
      tone: 'warning',
    }
  return {
    label: 'Butuh perhatian',
    detail: 'Yuk mulai lagi pelan-pelan, satu sholat tepat waktu tiap hari.',
    tone: 'destructive',
  }
}
