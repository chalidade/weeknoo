// JAIM database — one row per day for prayer logs, one row per juz for
// tilawah progress. Data lives on the device (IndexedDB); backup/restore via
// the JSON helpers in ./backup.ts.
import Dexie, { type EntityTable } from "dexie"

export const PRAYER_NAMES = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const
export type PrayerName = (typeof PRAYER_NAMES)[number]

/** "awal" = awal waktu, "akhir" = akhir waktu, "tidak" = tidak sholat */
export type PrayerStatus = "awal" | "akhir" | "tidak"

export interface PrayerEntry {
  status: PrayerStatus | null
  masjid: boolean
}

export interface PrayerDay {
  /** YYYY-MM-DD (local), primary key */
  date: string
  haid: boolean
  prayers: Record<PrayerName, PrayerEntry>
}

export interface TilawahJuz {
  /** 1–30, primary key */
  juz: number
  done: boolean
  updatedAt: number
}

export function emptyDay(date: string): PrayerDay {
  return {
    date,
    haid: false,
    prayers: {
      subuh: { status: null, masjid: false },
      dzuhur: { status: null, masjid: false },
      ashar: { status: null, masjid: false },
      maghrib: { status: null, masjid: false },
      isya: { status: null, masjid: false },
    },
  }
}

const db = new Dexie("jaim") as Dexie & {
  prayerDays: EntityTable<PrayerDay, "date">
  tilawah: EntityTable<TilawahJuz, "juz">
}

db.version(1).stores({
  prayerDays: "date",
  tilawah: "juz",
})

export { db }
