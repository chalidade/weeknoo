// Operasi riwayat percakapan. Semua tulisan lewat sini, supaya Chat.tsx tidak
// perlu tahu bentuk tabelnya.
import { db, type Message } from "./db"

/** Judul percakapan diambil dari pertanyaan pertama, dipotong seperlunya. */
function judulDari(pertanyaan: string): string {
  const bersih = pertanyaan.replace(/\s+/g, " ").trim()
  return bersih.length > 60 ? `${bersih.slice(0, 57)}…` : bersih || "Tanpa judul"
}

/** Percakapan baru, dinamai dari pertanyaan pertamanya. */
export async function buatChat(pertanyaanPertama: string): Promise<number> {
  const now = Date.now()
  return db.chats.add({ title: judulDari(pertanyaanPertama), createdAt: now, updatedAt: now })
}

/** Menyimpan satu pesan dan menyegarkan urutan percakapannya. */
export async function simpanPesan(pesan: Omit<Message, "id">): Promise<number> {
  const id = await db.messages.add(pesan)
  await db.chats.update(pesan.chatId, { updatedAt: Date.now() })
  return id
}

/**
 * Menimpa isi satu pesan. Dipakai selama jawaban mengalir: barisnya dibuat
 * sekali di awal, lalu ditimpa berkala — jauh lebih ringan daripada menulis
 * satu baris baru untuk tiap potongan yang datang.
 */
export async function perbaruiPesan(
  id: number,
  isi: Pick<Message, "content" | "reasoning" | "ms">,
): Promise<void> {
  await db.messages.update(id, isi)
}

/**
 * Seluruh pesan satu percakapan, urut kejadian. Diurut memakai id — bukan
 * createdAt — karena pertanyaan dan jawaban lahir pada milidetik yang sama,
 * sedangkan id selalu naik.
 */
export async function pesanDari(chatId: number): Promise<Message[]> {
  const rows = await db.messages.where("chatId").equals(chatId).toArray()
  return rows.sort((a, b) => a.id - b.id)
}

/** Daftar percakapan, yang terbaru di atas. */
export function daftarChat() {
  return db.chats.orderBy("updatedAt").reverse().toArray()
}

/** Percakapan yang paling terakhir disentuh — dipulihkan saat halaman dibuka. */
export async function chatTerakhir(): Promise<number | undefined> {
  const chats = await db.chats.orderBy("updatedAt").reverse().limit(1).toArray()
  return chats[0]?.id
}

/** Menghapus percakapan berikut seluruh pesannya. */
export async function hapusChat(chatId: number): Promise<void> {
  await db.transaction("rw", db.chats, db.messages, async () => {
    await db.messages.where("chatId").equals(chatId).delete()
    await db.chats.delete(chatId)
  })
}
