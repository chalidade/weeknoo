// Export/import the whole database as a JSON file — works on any Dexie
// instance. This is the bridge between the on-device database and a plain
// file: download a backup, move it to another device, import it there.
import type Dexie from "dexie"

interface DbBackup {
  db: string
  exportedAt: string
  data: Record<string, unknown[]>
}

/** Serialize every table to a JSON string. */
export async function exportDbJson(db: Dexie): Promise<string> {
  const data: DbBackup["data"] = {}
  for (const table of db.tables) {
    data[table.name] = await table.toArray()
  }
  const backup: DbBackup = {
    db: db.name,
    exportedAt: new Date().toISOString(),
    data,
  }
  return JSON.stringify(backup, null, 2)
}

/** Download the database as a .json backup file. */
export async function downloadDbBackup(db: Dexie, filename?: string): Promise<void> {
  const json = await exportDbJson(db)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename ?? `${db.name}-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Restore a backup produced by exportDbJson. By default existing rows are
 * cleared first; pass { merge: true } to upsert on top of current data
 * instead. Tables in the backup that no longer exist are skipped.
 */
export async function importDbJson(
  db: Dexie,
  json: string,
  opts: { merge?: boolean } = {},
): Promise<void> {
  const backup = JSON.parse(json) as DbBackup
  if (!backup || typeof backup !== "object" || typeof backup.data !== "object") {
    throw new Error("Not a valid database backup file")
  }
  await db.transaction("rw", db.tables, async () => {
    for (const table of db.tables) {
      const rows = backup.data[table.name]
      if (!Array.isArray(rows)) continue
      if (!opts.merge) await table.clear()
      await table.bulkPut(rows)
    }
  })
}

/** Restore a backup from a File (e.g. from an <input type="file">). */
export async function importDbFromFile(
  db: Dexie,
  file: File,
  opts: { merge?: boolean } = {},
): Promise<void> {
  await importDbJson(db, await file.text(), opts)
}
