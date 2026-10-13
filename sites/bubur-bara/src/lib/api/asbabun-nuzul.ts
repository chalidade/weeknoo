// Asbabun Nuzul — the circumstances behind a verse's revelation (Kemenag data).
// The upstream API (muslim-api) has no CORS headers, so the full dataset
// (286 entries) is bundled locally in ./data/asbabun-nuzul.json and lazy-loaded
// to keep it out of the main bundle. Entries are keyed by (surah, ayah); not
// every verse has one — 54 of the 114 surahs are covered.

export interface AsbabunNuzul {
  surah: number
  ayah: number
  text: string
}

let cache: AsbabunNuzul[] | undefined

/** All 286 entries, loaded once. */
export async function getAsbabunNuzul(): Promise<AsbabunNuzul[]> {
  cache ??= (await import("./data/asbabun-nuzul.json")).default
  return cache
}

/** Entries for one surah (1–114). Empty array when the surah has none. */
export async function getAsbabunNuzulBySurah(surah: number): Promise<AsbabunNuzul[]> {
  return (await getAsbabunNuzul()).filter((e) => e.surah === surah)
}

/** Entries for one specific verse. Empty array when it has none. */
export async function getAsbabunNuzulByAyah(surah: number, ayah: number): Promise<AsbabunNuzul[]> {
  return (await getAsbabunNuzul()).filter((e) => e.surah === surah && e.ayah === ayah)
}
