/**
 * Menyiapkan gambar sebelum dikirim ke model.
 *
 * Foto kamera zaman sekarang bisa 4000 piksel dan 5 MB, dan salinannya ikut
 * tersimpan di riwayat — tanpa diperkecil, database browser cepat membengkak.
 *
 * Yang TIDAK dihemat: waktu model. Terukur pada qwen2.5vl:3b, gambar 1024 px
 * dan 640 px sama-sama menghasilkan 1.098 token dan sama-sama makan ~250 detik
 * — Ollama mengubah ukurannya sendiri ke ukuran tetap sebelum diproses. Jadi
 * memperkecil di sini murni soal penyimpanan dan pengiriman, bukan kecepatan.
 */

/** Sisi terpanjang setelah diperkecil. Cukup untuk model membaca tulisan. */
const MAKS_SISI = 1024

/**
 * Memperkecil gambar lalu mengubahnya jadi base64 TANPA awalan
 * `data:image/...;base64,` — Ollama menolak yang masih berawalan.
 */
export async function siapkanGambar(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    const skala = Math.min(1, MAKS_SISI / Math.max(bitmap.width, bitmap.height))
    const lebar = Math.round(bitmap.width * skala)
    const tinggi = Math.round(bitmap.height * skala)

    const kanvas = document.createElement('canvas')
    kanvas.width = lebar
    kanvas.height = tinggi
    const ctx = kanvas.getContext('2d')
    if (!ctx) throw new Error('Browser ini tidak bisa memproses gambar')
    ctx.drawImage(bitmap, 0, 0, lebar, tinggi)

    const dataUrl = kanvas.toDataURL('image/jpeg', 0.85)
    return dataUrl.slice(dataUrl.indexOf(',') + 1)
  } finally {
    bitmap.close()
  }
}

/** Mengembalikan base64 jadi alamat yang bisa dipakai <img src>. */
export function sebagaiSumberGambar(base64: string): string {
  return `data:image/jpeg;base64,${base64}`
}
