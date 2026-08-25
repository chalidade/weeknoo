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

export interface Item {
  id: number
  title: string
  /** Date.now() timestamp */
  createdAt: number
}

const db = new Dexie("chalidade-portfolio-sites") as Dexie & {
  items: EntityTable<Item, "id">
}

db.version(1).stores({
  items: "++id, title, createdAt",
})

export { db }
