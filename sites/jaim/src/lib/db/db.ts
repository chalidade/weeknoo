// JAIM database — data is scoped per user (local "profiles"): one row per
// user+day for prayer logs, one row per user+juz for tilawah progress. Data
// lives on the device (IndexedDB); backup/restore via the JSON helpers in
// ./backup.ts.
import Dexie, { type EntityTable, type Table } from "dexie"

export const PRAYER_NAMES = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const
export type PrayerName = (typeof PRAYER_NAMES)[number]

/** "awal" = awal waktu, "akhir" = akhir waktu, "tidak" = tidak sholat */
export type PrayerStatus = "awal" | "akhir" | "tidak"

export interface User {
  id: string
  name: string
  /** SHA-256 hex of `${salt}:${pin}`; null = profile without a PIN */
  pinHash: string | null
  salt: string
  createdAt: number
}

export interface PrayerEntry {
  status: PrayerStatus | null
  masjid: boolean
}

export interface PrayerDay {
  userId: string
  /** YYYY-MM-DD (local) */
  date: string
  haid: boolean
  prayers: Record<PrayerName, PrayerEntry>
}

export interface TilawahJuz {
  userId: string
  /** 1–30 */
  juz: number
  done: boolean
  updatedAt: number
}

export function emptyDay(userId: string, date: string): PrayerDay {
  return {
    userId,
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
  users: EntityTable<User, "id">
  prayerLogs: Table<PrayerDay, [string, string]>
  tilawahLogs: Table<TilawahJuz, [string, number]>
}

db.version(1).stores({
  prayerDays: "date",
  tilawah: "juz",
})

// v2: introduce user profiles; logs move to compound [userId+…] keys.
// Pre-profile data is adopted by an auto-created "Pengguna" profile.
db.version(2)
  .stores({
    users: "id",
    prayerLogs: "[userId+date], userId",
    tilawahLogs: "[userId+juz], userId",
  })
  .upgrade(async (tx) => {
    const oldPrayers = (await tx.table("prayerDays").toArray()) as Omit<PrayerDay, "userId">[]
    const oldTilawah = (await tx.table("tilawah").toArray()) as Omit<TilawahJuz, "userId">[]
    if (oldPrayers.length === 0 && oldTilawah.length === 0) return
    const legacyId = "legacy"
    await tx.table("users").add({
      id: legacyId,
      name: "Pengguna",
      pinHash: null,
      salt: "",
      createdAt: Date.now(),
    })
    await tx.table("prayerLogs").bulkAdd(oldPrayers.map((p) => ({ ...p, userId: legacyId })))
    await tx.table("tilawahLogs").bulkAdd(oldTilawah.map((t) => ({ ...t, userId: legacyId })))
  })

// v3: drop the migrated pre-profile tables.
db.version(3).stores({
  prayerDays: null,
  tilawah: null,
})

export { db }
