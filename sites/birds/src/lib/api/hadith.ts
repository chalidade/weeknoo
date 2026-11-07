// Hadits — hadis-api-id (9 narrators, Indonesian translation, paginated) and
// api.myquran.com for Hadits Arba'in An-Nawawi. Free, no API key, CORS-enabled.
import { fetchJson } from "./http"

const BASE = "https://hadis-api-id.vercel.app"
const ARBAIN = "https://api.myquran.com/v2/hadits/arbain"

export interface HadithBook {
  /** e.g. "Bukhari" */
  name: string
  /** e.g. "bukhari" — use as the `book` argument below */
  slug: string
  total: number
}

export interface Hadith {
  number: number
  arab: string
  /** Indonesian translation */
  id: string
}

export interface HadithPage {
  name: string
  slug: string
  total: number
  pagination: {
    totalItems: number
    currentPage: number
    pageSize: number
    totalPages: number
  }
  items: Hadith[]
}

export interface HadithArbain {
  no: string
  judul: string
  arab: string
  /** Indonesian translation */
  indo: string
}

/** The 9 books (Bukhari, Muslim, Abu Dawud, …) with their hadith counts. */
export function getHadithBooks(): Promise<HadithBook[]> {
  return fetchJson<HadithBook[]>(`${BASE}/hadith`)
}

/** One page of hadiths from a book. */
export function getHadithPage(book: string, page = 1, limit = 20): Promise<HadithPage> {
  return fetchJson<HadithPage>(`${BASE}/hadith/${book}?page=${page}&limit=${limit}`)
}

/** A single hadith by book slug and number. */
export function getHadith(book: string, number: number): Promise<Hadith & { name: string; slug: string }> {
  return fetchJson<Hadith & { name: string; slug: string }>(`${BASE}/hadith/${book}/${number}`)
}

/** Hadits Arba'in An-Nawawi (1–42). */
export async function getArbain(no: number): Promise<HadithArbain> {
  return (await fetchJson<{ status: boolean; data: HadithArbain }>(`${ARBAIN}/${no}`)).data
}
