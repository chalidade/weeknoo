// Database lokal — IndexedDB lewat Dexie. Datanya tinggal di perangkat
// pembaca (profil browser, atau penyimpanan aplikasi di dalam APK) dan
// bertahan setelah halaman dimuat ulang; TIDAK ikut pindah antar perangkat.
// Untuk memindahkannya, pakai ekspor/impor di ./backup.ts.
//
// Satu interface + satu baris `stores` per tabel, dan naikkan nomor version
// setiap skemanya berubah. Arti indeks: "++id" kunci utama yang naik sendiri,
// nama setelah koma ikut diindeks (bisa dicari dengan .where()); kolom yang
// hanya disimpan tanpa pernah dicari tidak perlu didaftarkan.
import Dexie, { type EntityTable } from "dexie"

/** Satu percakapan. Judulnya diambil dari pertanyaan pertama. */
export interface Chat {
  id: number
  title: string
  /** Date.now() */
  createdAt: number
  /** Date.now() — dipakai mengurutkan daftar riwayat. */
  updatedAt: number
}

/** Satu giliran di dalam percakapan. */
export interface Message {
  id: number
  chatId: number
  role: "user" | "assistant"
  content: string
  /** Proses berpikir model — disimpan terpisah, sama seperti di layar. */
  reasoning: string
  /** Lama menjawab dalam milidetik. 0 untuk pesan dari pengguna. */
  ms: number
  /**
   * Gambar yang dilampirkan, base64 tanpa awalan data:. Tidak diindeks, jadi
   * penambahan kolom ini tidak perlu menaikkan version — Dexie hanya peduli
   * pada indeks, bukan pada bentuk isinya.
   */
  images?: string[]
  /** Date.now() */
  createdAt: number
}

const db = new Dexie("ask") as Dexie & {
  chats: EntityTable<Chat, "id">
  messages: EntityTable<Message, "id">
}

// v1 adalah tabel contoh bawaan template. Tidak dihapus dari berkas ini
// karena browser yang sudah pernah membuka situs ini terlanjur memilikinya —
// Dexie perlu tahu jalur lamanya untuk bisa naik ke v2 tanpa error.
db.version(1).stores({
  items: "++id, title, createdAt",
})

db.version(2).stores({
  items: null,
  chats: "++id, updatedAt",
  messages: "++id, chatId, createdAt",
})

export { db }
