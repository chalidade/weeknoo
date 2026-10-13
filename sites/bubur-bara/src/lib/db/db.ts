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

export interface OrderLine {
  name: string
  qty: number
  unitPrice: number
  addons: string[]
}

/** An order the visitor placed from this device — their "Pesanan Saya" list. */
export interface Order {
  id: number
  /** short human code shown on the receipt, e.g. BB-7K2QX */
  code: string
  customer: string
  phone: string
  outletName: string
  /** "sekarang" = pick up today, "terjadwal" = booked for a later date */
  mode: "sekarang" | "terjadwal"
  /** YYYY-MM-DD, only for "terjadwal" */
  pickupDate: string
  pickupTime: string
  note: string
  lines: OrderLine[]
  total: number
  /** downscaled JPEG data URL of the transfer receipt */
  paymentProof: string
  /** Date.now() timestamp */
  createdAt: number
}

const db = new Dexie("bubur-bara") as Dexie & {
  orders: EntityTable<Order, "id">
}

db.version(1).stores({
  orders: "++id, code, createdAt",
})

export { db }
