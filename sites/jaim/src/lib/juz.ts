// Static juz map — start/end of each of the 30 juz (standard boundaries),
// so juz details work offline without an API call.
export interface JuzInfo {
  juz: number
  range: string
}

export const JUZ_LIST: JuzInfo[] = [
  { juz: 1, range: "Al-Fatihah 1 — Al-Baqarah 141" },
  { juz: 2, range: "Al-Baqarah 142 — Al-Baqarah 252" },
  { juz: 3, range: "Al-Baqarah 253 — Ali 'Imran 92" },
  { juz: 4, range: "Ali 'Imran 93 — An-Nisa' 23" },
  { juz: 5, range: "An-Nisa' 24 — An-Nisa' 147" },
  { juz: 6, range: "An-Nisa' 148 — Al-Ma'idah 81" },
  { juz: 7, range: "Al-Ma'idah 82 — Al-An'am 110" },
  { juz: 8, range: "Al-An'am 111 — Al-A'raf 87" },
  { juz: 9, range: "Al-A'raf 88 — Al-Anfal 40" },
  { juz: 10, range: "Al-Anfal 41 — At-Taubah 92" },
  { juz: 11, range: "At-Taubah 93 — Hud 5" },
  { juz: 12, range: "Hud 6 — Yusuf 52" },
  { juz: 13, range: "Yusuf 53 — Ibrahim 52" },
  { juz: 14, range: "Al-Hijr 1 — An-Nahl 128" },
  { juz: 15, range: "Al-Isra' 1 — Al-Kahf 74" },
  { juz: 16, range: "Al-Kahf 75 — Ta Ha 135" },
  { juz: 17, range: "Al-Anbiya' 1 — Al-Hajj 78" },
  { juz: 18, range: "Al-Mu'minun 1 — Al-Furqan 20" },
  { juz: 19, range: "Al-Furqan 21 — An-Naml 55" },
  { juz: 20, range: "An-Naml 56 — Al-'Ankabut 45" },
  { juz: 21, range: "Al-'Ankabut 46 — Al-Ahzab 30" },
  { juz: 22, range: "Al-Ahzab 31 — Ya Sin 27" },
  { juz: 23, range: "Ya Sin 28 — Az-Zumar 31" },
  { juz: 24, range: "Az-Zumar 32 — Fussilat 46" },
  { juz: 25, range: "Fussilat 47 — Al-Jasiyah 37" },
  { juz: 26, range: "Al-Ahqaf 1 — Az-Zariyat 30" },
  { juz: 27, range: "Az-Zariyat 31 — Al-Hadid 29" },
  { juz: 28, range: "Al-Mujadilah 1 — At-Tahrim 12" },
  { juz: 29, range: "Al-Mulk 1 — Al-Mursalat 50" },
  { juz: 30, range: "An-Naba' 1 — An-Nas 6" },
]
