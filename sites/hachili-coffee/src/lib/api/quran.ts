// Al-Qur'an — equran.id v2 (Indonesian translation, tafsir Kemenag, murottal audio).
// Free, no API key, CORS-enabled.
import { fetchJson } from "./http"

const BASE = "https://equran.id/api/v2"

export interface SurahSummary {
  nomor: number
  /** Arabic name */
  nama: string
  namaLatin: string
  jumlahAyat: number
  /** "Mekah" | "Madinah" */
  tempatTurun: string
  /** Indonesian meaning of the name */
  arti: string
  /** HTML description */
  deskripsi: string
  /** qari id → full-surah audio URL */
  audioFull: Record<string, string>
}

export interface Ayat {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  /** qari id → per-ayah audio URL */
  audio: Record<string, string>
}

export interface SurahNav {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
}

export interface Surah extends SurahSummary {
  ayat: Ayat[]
  suratSelanjutnya: SurahNav | false
  suratSebelumnya: SurahNav | false
}

export interface TafsirAyat {
  ayat: number
  teks: string
}

export interface SurahTafsir extends SurahSummary {
  tafsir: TafsirAyat[]
}

interface Wrapped<T> {
  code: number
  message: string
  data: T
}

/** All 114 surahs (metadata only, no verses). */
export async function getSurahList(): Promise<SurahSummary[]> {
  return (await fetchJson<Wrapped<SurahSummary[]>>(`${BASE}/surat`)).data
}

/** One surah (1–114) with all its verses: Arabic, Latin, translation, audio. */
export async function getSurah(nomor: number): Promise<Surah> {
  return (await fetchJson<Wrapped<Surah>>(`${BASE}/surat/${nomor}`)).data
}

/** Tafsir Kemenag for every verse of a surah (1–114). */
export async function getTafsir(nomor: number): Promise<SurahTafsir> {
  return (await fetchJson<Wrapped<SurahTafsir>>(`${BASE}/tafsir/${nomor}`)).data
}
