// Wilayah Indonesia — emsifa/api-wilayah-indonesia (static, free, CORS-enabled).
// Four cascading levels: provinsi → kabupaten/kota → kecamatan → kelurahan/desa.
// Note: names come back in ALL CAPS (e.g. "JAWA TENGAH", "KOTA SEMARANG").
import { fetchJson } from "./http"

const BASE = "https://www.emsifa.com/api-wilayah-indonesia/api"

export interface Province {
  id: string
  name: string
}

export interface Regency {
  id: string
  province_id: string
  /** Prefixed "KABUPATEN " or "KOTA " */
  name: string
}

export interface District {
  id: string
  regency_id: string
  name: string
}

export interface Village {
  id: string
  district_id: string
  name: string
}

/** All 38 provinces. */
export function getProvinces(): Promise<Province[]> {
  return fetchJson<Province[]>(`${BASE}/provinces.json`)
}

/** Kabupaten & kota within a province. */
export function getRegencies(provinceId: string): Promise<Regency[]> {
  return fetchJson<Regency[]>(`${BASE}/regencies/${provinceId}.json`)
}

/** Kecamatan within a kabupaten/kota. */
export function getDistricts(regencyId: string): Promise<District[]> {
  return fetchJson<District[]>(`${BASE}/districts/${regencyId}.json`)
}

/** Kelurahan/desa within a kecamatan. */
export function getVillages(districtId: string): Promise<Village[]> {
  return fetchJson<Village[]>(`${BASE}/villages/${districtId}.json`)
}
