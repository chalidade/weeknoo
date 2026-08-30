/**
 * Menyiapkan gambar sebelum dikirim ke model.
 *
 * Foto kamera zaman sekarang bisa 4000 piksel dan 5 MB. Model hanya melihat
 * versi kecilnya, jadi mengirim ukuran asli hanya membuang waktu — dan
 * salinannya ikut tersimpan di riwayat, yang lama-lama membengkakkan database
 * browser. Karena itu setiap gambar diperkecil dulu di sini.
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
