import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  Pause,
  Play,
  RotateCw,
  Search,
} from 'lucide-react'
import {
  getAsbabunNuzulBySurah,
  getSurah,
  getSurahList,
  type AsbabunNuzul,
  type Surah,
  type SurahSummary,
} from '@/lib/api'
import { useUser } from '@/lib/auth'

// module-level caches — surah content doesn't change, so refetching on every
// visit would only waste data
let surahListCache: SurahSummary[] | null = null
const surahCache = new Map<number, Surah>()

/** Preferred qari: 05 = Misyari Rasyid Al-Afasy (equran.id ids "01"–"05"). */
function ayahAudioUrl(audio: Record<string, string>): string | null {
  return audio['05'] ?? Object.values(audio)[0] ?? null
}

interface LastRead {
  surah: number
  namaLatin: string
}

function lastReadKey(userId: string) {
  return `jaim:quran-last:${userId}`
}

function loadLastRead(userId: string): LastRead | null {
  try {
    const raw = localStorage.getItem(lastReadKey(userId))
    return raw ? (JSON.parse(raw) as LastRead) : null
  } catch {
    return null
  }
}

export function QuranReader() {
  const user = useUser()
  const [surahNo, setSurahNo] = useState<number | null>(null)
  const [lastRead, setLastRead] = useState<LastRead | null>(() => loadLastRead(user.id))

  const openSurah = (nomor: number, namaLatin: string) => {
    setSurahNo(nomor)
    const entry = { surah: nomor, namaLatin }
    setLastRead(entry)
    try {
      localStorage.setItem(lastReadKey(user.id), JSON.stringify(entry))
    } catch {
      // private mode — last-read for this visit only
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [surahNo])

  return surahNo === null ? (
    <SurahList lastRead={lastRead} onOpen={openSurah} />
  ) : (
    <SurahView nomor={surahNo} onBack={() => setSurahNo(null)} onOpen={openSurah} />
  )
}

function SurahList({
  lastRead,
  onOpen,
}: {
  lastRead: LastRead | null
  onOpen: (nomor: number, namaLatin: string) => void
}) {
  const [list, setList] = useState<SurahSummary[] | null>(surahListCache)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')

  const load = () => {
    setError(false)
    getSurahList()
      .then((rows) => {
        surahListCache = rows
        setList(rows)
      })
      .catch(() => setError(true))
  }

  useEffect(() => {
    if (!surahListCache) load()
  }, [])

  const filtered = useMemo(() => {
    if (!list) return null
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        String(s.nomor) === q,
    )
  }, [list, query])

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-5"
    >
      <h2 className="text-sm font-semibold">Al-Qur'an</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Teks, terjemahan & murottal dari equran.id · asbabun nuzul Kemenag.
      </p>

      {lastRead && (
        <button
          onClick={() => onOpen(lastRead.surah, lastRead.namaLatin)}
          className="mt-3 flex w-full items-center gap-2.5 rounded-xl bg-secondary px-3 py-2.5 text-left transition-opacity hover:opacity-90"
        >
          <BookMarked className="size-4 shrink-0 text-secondary-foreground" />
          <span className="flex-1 text-xs text-secondary-foreground">
            Terakhir dibaca:{' '}
            <span className="font-semibold">
              {lastRead.surah}. {lastRead.namaLatin}
            </span>
          </span>
          <ChevronRight className="size-3.5 text-secondary-foreground" />
        </button>
      )}

      <label className="mt-3 flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari surat (nama, arti, nomor)…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      {error && (
        <div className="mt-4 rounded-xl bg-muted px-3 py-2.5">
          <p className="inline-flex items-center gap-1.5 text-xs text-destructive">
            <CircleAlert className="size-3.5" />
            Gagal memuat daftar surat — periksa koneksi internet.
          </p>
          <button
            onClick={load}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium"
          >
            <RotateCw className="size-3" />
            Coba lagi
          </button>
        </div>
      )}
      {!list && !error && (
        <p className="mt-4 text-sm text-muted-foreground">Memuat daftar surat…</p>
      )}

      {filtered && (
        <ul className="mt-3 divide-y">
          {filtered.map((s) => (
            <li key={s.nomor}>
              <button
                onClick={() => onOpen(s.nomor, s.namaLatin)}
                className="flex w-full items-center gap-3 py-2.5 text-left transition-colors hover:text-primary"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold tabular-nums">
                  {s.nomor}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{s.namaLatin}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {s.arti} · {s.tempatTurun} · {s.jumlahAyat} ayat
                  </span>
                </span>
                <span className="font-quran shrink-0 text-lg" lang="ar" dir="rtl">
                  {s.nama}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-4 text-center text-xs text-muted-foreground">
              Tidak ada surat yang cocok dengan "{query}".
            </li>
          )}
        </ul>
      )}
    </motion.section>
  )
}

function SurahView({
  nomor,
  onBack,
  onOpen,
}: {
  nomor: number
  onBack: () => void
  onOpen: (nomor: number, namaLatin: string) => void
}) {
  const [surah, setSurah] = useState<Surah | null>(surahCache.get(nomor) ?? null)
  const [error, setError] = useState(false)
  const [asbab, setAsbab] = useState<Map<number, AsbabunNuzul[]>>(new Map())
  const [openAsbab, setOpenAsbab] = useState<Set<number>>(new Set())
  const [playing, setPlaying] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const load = () => {
    setError(false)
    getSurah(nomor)
      .then((s) => {
        surahCache.set(nomor, s)
        setSurah(s)
      })
      .catch(() => setError(true))
  }

  useEffect(() => {
    setSurah(surahCache.get(nomor) ?? null)
    setOpenAsbab(new Set())
    if (!surahCache.has(nomor)) load()
    // asbabun nuzul is bundled locally — grouping per ayah for this surah
    let cancelled = false
    void getAsbabunNuzulBySurah(nomor).then((entries) => {
      if (cancelled) return
      const map = new Map<number, AsbabunNuzul[]>()
      for (const e of entries) {
        const list = map.get(e.ayah) ?? []
        list.push(e)
        map.set(e.ayah, list)
      }
      setAsbab(map)
    })
    return () => {
      cancelled = true
    }
  }, [nomor])

  // one shared player — starting an ayah stops the previous one
  const toggleAudio = (ayahNo: number, url: string | null) => {
    if (!url) return
    if (playing === ayahNo) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => setPlaying((p) => (p === ayahNo ? null : p))
    audio.onerror = () => setPlaying((p) => (p === ayahNo ? null : p))
    void audio.play().catch(() => setPlaying(null))
    setPlaying(ayahNo)
  }

  useEffect(
    () => () => {
      audioRef.current?.pause()
    },
    [],
  )

  const toggleAsbab = (ayahNo: number) => {
    setOpenAsbab((prev) => {
      const next = new Set(prev)
      if (next.has(ayahNo)) next.delete(ayahNo)
      else next.add(ayahNo)
      return next
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          aria-label="Kembali ke daftar surat"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        {surah ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {surah.nomor}. {surah.namaLatin}{' '}
              <span className="font-quran" lang="ar" dir="rtl">
                {surah.nama}
              </span>
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {surah.arti} · {surah.tempatTurun} · {surah.jumlahAyat} ayat
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Memuat…</p>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-muted px-3 py-2.5">
          <p className="inline-flex items-center gap-1.5 text-xs text-destructive">
            <CircleAlert className="size-3.5" />
            Gagal memuat surat — periksa koneksi internet.
          </p>
          <button
            onClick={load}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium"
          >
            <RotateCw className="size-3" />
            Coba lagi
          </button>
        </div>
      )}

      {surah && (
        <>
          <ul className="mt-4 space-y-3">
            {surah.ayat.map((a) => {
              const entries = asbab.get(a.nomorAyat)
              const expanded = openAsbab.has(a.nomorAyat)
              const url = ayahAudioUrl(a.audio)
              return (
                <li key={a.nomorAyat} className="rounded-xl border p-4">
                  <p
                    className="font-quran text-right text-2xl leading-[2.2]"
                    lang="ar"
                    dir="rtl"
                  >
                    {a.teksArab}
                  </p>
                  <p className="mt-3 text-xs italic text-muted-foreground">{a.teksLatin}</p>
                  <p className="mt-2 text-sm">{a.teksIndonesia}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold tabular-nums">
                      {surah.nomor}:{a.nomorAyat}
                    </span>
                    {url && (
                      <button
                        onClick={() => toggleAudio(a.nomorAyat, url)}
                        aria-label={
                          playing === a.nomorAyat ? 'Hentikan murottal' : 'Putar murottal'
                        }
                        className={`inline-flex size-6 items-center justify-center rounded-full border transition-colors ${
                          playing === a.nomorAyat
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {playing === a.nomorAyat ? (
                          <Pause className="size-3" />
                        ) : (
                          <Play className="size-3" />
                        )}
                      </button>
                    )}
                    {entries && (
                      <button
                        onClick={() => toggleAsbab(a.nomorAyat)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                          expanded
                            ? 'border-primary bg-secondary text-secondary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <BookOpen className="size-3" />
                        Asbabun Nuzul
                        {expanded ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        )}
                      </button>
                    )}
                  </div>
                  {entries && expanded && (
                    <div className="mt-3 space-y-2 rounded-xl bg-muted px-3 py-2.5">
                      {entries.map((e, i) => (
                        <p key={i} className="text-xs leading-relaxed text-muted-foreground">
                          {e.text}
                        </p>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex gap-2">
            {surah.suratSebelumnya && (
              <button
                onClick={() =>
                  surah.suratSebelumnya &&
                  onOpen(surah.suratSebelumnya.nomor, surah.suratSebelumnya.namaLatin)
                }
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-3.5" />
                {surah.suratSebelumnya.namaLatin}
              </button>
            )}
            {surah.suratSelanjutnya && (
              <button
                onClick={() =>
                  surah.suratSelanjutnya &&
                  onOpen(surah.suratSelanjutnya.nomor, surah.suratSelanjutnya.namaLatin)
                }
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {surah.suratSelanjutnya.namaLatin}
                <ChevronRight className="size-3.5" />
              </button>
            )}
          </div>
        </>
      )}
    </motion.section>
  )
}
