// Local database — IndexedDB via Dexie. Data lives on the visitor's device
// (browser profile, or the app's storage inside the APK) and survives
// reloads; it is NOT shared between devices. For backup/restore across
// devices use the export/import helpers in ./backup.ts.
//
// Define one interface + one `stores` entry per table, then bump the version
// number whenever the schema changes. Index syntax: "++id" auto-increment
// primary key, plain fields after the comma are indexed (queryable with
// .where()); fields that are only stored, not queried, are not listed.
import Dexie, { type EntityTable } from "dexie"

/** The pitch a founder is writing, kept so a reload does not lose it. */
export interface PitchDraft {
  /** Always "pitch" — one draft per device. */
  id: string
  startup: string
  founders: string
  wa: string
  answers: string[]
  step: number
  /** Date.now() timestamp */
  updatedAt: number
}

const db = new Dexie("puas-startup") as Dexie & {
  drafts: EntityTable<PitchDraft, "id">
}

// v1 held the template's example `items` table; v2 replaces it with drafts.
db.version(2).stores({
  items: null,
  drafts: "id",
})

export { db }
