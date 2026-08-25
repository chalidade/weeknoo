// Jadwal sholat — Aladhan API (free, keyless, CORS-enabled), method 20 =
// KEMENAG (Kementerian Agama RI).
import type { PrayerName } from "@/lib/db/db"

export interface PrayerTimes {
  /** "HH:MM" per prayer */
  times: Record<PrayerName, string>
  dateReadable: string
}

export interface Coords {
  latitude: number
  longitude: number
  label: string
}

/** Fallback when geolocation is unavailable or denied. */
export const DEFAULT_COORDS: Coords = {
  latitude: -6.2,
  longitude: 106.816666,
  label: "Jakarta (default)",
}

const COORDS_KEY = "jaim:coords"

export function loadSavedCoords(): Coords | null {
  try {
    const raw = localStorage.getItem(COORDS_KEY)
    return raw ? (JSON.parse(raw) as Coords) : null
  } catch {
    return null
  }
}

export function saveCoords(coords: Coords): void {
  try {
    localStorage.setItem(COORDS_KEY, JSON.stringify(coords))
  } catch {
    // private mode — session only
  }
}

interface AladhanResponse {
  data: {
    timings: Record<string, string>
    date: { readable: string }
  }
}

export async function getPrayerTimes(date: Date, coords: Coords): Promise<PrayerTimes> {
  const d = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`
  const url = `https://api.aladhan.com/v1/timings/${d}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=20`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Gagal memuat jadwal sholat (${res.status})`)
  const json = (await res.json()) as AladhanResponse
  const t = json.data.timings
  const clean = (v: string) => v.split(" ")[0]
  return {
    times: {
      subuh: clean(t.Fajr),
      dzuhur: clean(t.Dhuhr),
      ashar: clean(t.Asr),
      maghrib: clean(t.Maghrib),
      isya: clean(t.Isha),
    },
    dateReadable: json.data.date.readable,
  }
}
