// Local database — IndexedDB via Dexie. Membership and saved articles live on
// the reader's device; nothing is sent to a server. Bump the version number
// whenever the schema changes.
import Dexie, { type EntityTable } from "dexie"

export interface Member {
  id: number
  fullName: string
  email: string
  /** Date.now() timestamp */
  joinedAt: number
}

/** Single-row table: key "current" holds the signed-in member, if any. */
export interface Session {
  key: string
  memberId: number
}

export interface Bookmark {
  articleId: string
  savedAt: number
}

const db = new Dexie("birds") as Dexie & {
  members: EntityTable<Member, "id">
  session: EntityTable<Session, "key">
  bookmarks: EntityTable<Bookmark, "articleId">
}

db.version(1).stores({
  members: "++id, &email",
  session: "key",
  bookmarks: "articleId, savedAt",
})

export { db }
