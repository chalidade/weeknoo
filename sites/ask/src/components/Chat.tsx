import { useCallback, useEffect, useRef, useState } from 'react'
import { Clock, Cpu, Plus } from 'lucide-react'
import { chatStream, getOllamaModels, isOllamaRunning, OLLAMA_MODEL, type ChatMessage } from '@/lib/ai'
import { buatChat, chatTerakhir, perbaruiPesan, pesanDari, simpanPesan } from '@/lib/db'
import { Composer } from '@/components/chat/Composer'
import { History } from '@/components/chat/History'
import { Message, type Turn } from '@/components/chat/Message'
import { Offline } from '@/components/chat/Offline'

type Status = 'checking' | 'offline' | 'nomodel' | 'ready'

/**
 * Tanpa ini qwen3 berpikir dalam Bahasa Inggris dan memeriksa ulang jawabannya
 * berkali-kali — pertanyaan "ibukota Jawa Barat" sempat memakan 100 detik lebih
 * tanpa hasil. Dengan perintah ini: 17 detik, jawabannya "Bandung".
 */
const SISTEM: ChatMessage = {
  role: 'system',
  content:
    'Kamu asisten berbahasa Indonesia. SELALU jawab dalam Bahasa Indonesia. ' +
    'Berpikirlah sesingkat mungkin: untuk pertanyaan faktual sederhana, langsung ' +
    'simpulkan tanpa memeriksa ulang berkali-kali. Jawaban ringkas dan jelas.',
}

const CONTOH = [
  'Jelaskan fotosintesis untuk anak SD',
  'Bikin 5 ide nama kedai kopi',
  'Apa beda let, const, dan var?',
]

/** Jeda minimum antar penulisan ke database selama jawaban mengalir. */
const JEDA_SIMPAN = 1500

/**
 * Menyimpan tidak boleh menjatuhkan percakapan: di mode penyamaran atau saat
 * penyimpanan situs diblokir, IndexedDB melempar error — jawabannya tetap harus
 * sampai ke layar.
 */
async function aman<T>(kerja: Promise<T>): Promise<T | undefined> {
  try {
    return await kerja
  } catch {
    return undefined
  }
}

export function Chat() {
  const [status, setStatus] = useState<Status>('checking')
  const [models, setModels] = useState<string[]>([])
  const [model, setModel] = useState(OLLAMA_MODEL)
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const [chatId, setChatId] = useState<number | null>(null)
  const [riwayatTerbuka, setRiwayatTerbuka] = useState(false)

  const abort = useRef<AbortController | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  // Ikut turun otomatis hanya selama pembaca memang sedang di bawah — kalau ia
  // menggulir ke atas untuk membaca ulang, jangan direbut.
  const pinned = useRef(true)

  const connect = useCallback(async () => {
    setStatus('checking')
    if (!(await isOllamaRunning())) return setStatus('offline')
    try {
      const names = (await getOllamaModels()).map((m) => m.name)
      setModels(names)
      if (names.length === 0) return setStatus('nomodel')
      setModel((current) => (names.includes(current) ? current : names[0]))
      setStatus('ready')
    } catch {
      setStatus('offline')
    }
  }, [])

  /** Memindahkan satu percakapan tersimpan ke layar. */
  const muat = useCallback(async (id: number) => {
    const rows = (await aman(pesanDari(id))) ?? []
    setChatId(id)
    setTurns(
      rows.map((r) =>
        r.role === 'user'
          ? { role: 'user', content: r.content }
          : { role: 'assistant', content: r.content, reasoning: r.reasoning, ms: r.ms, done: true },
      ),
    )
  }, [])

  useEffect(() => {
    void connect()
  }, [connect])

  // Percakapan terakhir dipulihkan sendiri saat halaman dibuka.
  useEffect(() => {
    void (async () => {
      const id = await aman(chatTerakhir())
      if (id !== undefined) await muat(id)
    })()
  }, [muat])

  useEffect(() => {
    const el = scroller.current
    if (el && pinned.current) el.scrollTop = el.scrollHeight
  }, [turns])

  // Membatalkan permintaan yang masih jalan kalau halaman ditutup.
  useEffect(() => () => abort.current?.abort(), [])

  const percakapanBaru = useCallback(() => {
    abort.current?.abort()
    setChatId(null)
    setTurns([])
    setRiwayatTerbuka(false)
  }, [])

  const send = useCallback(
    async (question: string) => {
      if (busy) return

      const history: ChatMessage[] = [
        SISTEM,
        ...turns
          .filter((t) => t.role === 'user' || (t.content !== '' && !t.error))
          .map((t) => ({ role: t.role, content: t.content })),
        { role: 'user', content: question },
      ]

      setTurns((t) => [
        ...t,
        { role: 'user', content: question },
        { role: 'assistant', content: '', reasoning: '', ms: 0, done: false },
      ])
      setBusy(true)
      pinned.current = true

      const controller = new AbortController()
      abort.current = controller
      const started = Date.now()

      /** Menambal giliran terakhir — selalu giliran asisten yang baru dibuat. */
      const patch = (change: Partial<Turn>) =>
        setTurns((t) => {
          const last = t[t.length - 1]
          if (last?.role !== 'assistant') return t
          return [...t.slice(0, -1), { ...last, ...change }]
        })

      // Percakapan dan kedua barisnya dibuat sekarang, sebelum jawaban datang,
      // supaya pertanyaan tetap tersimpan walau jawabannya nanti gagal.
      let id = chatId
      if (id === null) {
        id = (await aman(buatChat(question))) ?? null
        if (id !== null) setChatId(id)
      }
      let baris: number | undefined
      if (id !== null) {
        const now = Date.now()
        await aman(
          simpanPesan({ chatId: id, role: 'user', content: question, reasoning: '', ms: 0, createdAt: now }),
        )
        baris = await aman(
          simpanPesan({ chatId: id, role: 'assistant', content: '', reasoning: '', ms: 0, createdAt: now }),
        )
      }

      let isi = { content: '', reasoning: '', ms: 0 }
      let ditulis = 0

      try {
        // Proses berpikir ikut memakan jatah token, jadi batasnya dinaikkan —
        // dengan 1024 bawaan, jawaban panjang bisa terpotong di tengah.
        for await (const chunk of chatStream(history, {
          model,
          maxTokens: 2048,
          signal: controller.signal,
        })) {
          isi = {
            content: isi.content + chunk.content,
            reasoning: isi.reasoning + chunk.reasoning,
            ms: Date.now() - started,
          }
          patch(isi)
          // Ditulis berkala, bukan tiap potongan: satu jawaban bisa 300 potongan.
          if (baris !== undefined && Date.now() - ditulis > JEDA_SIMPAN) {
            ditulis = Date.now()
            void aman(perbaruiPesan(baris, isi))
          }
        }
      } catch (err) {
        // Berhenti karena tombol stop bukan kesalahan — biarkan apa adanya.
        if (!controller.signal.aborted) {
          patch({ error: err instanceof Error ? err.message : String(err) })
        }
      } finally {
        patch({ done: true })
        // Simpanan terakhir mencakup potongan setelah penulisan berkala tadi,
        // termasuk kalau jawabannya dihentikan di tengah.
        if (baris !== undefined) await aman(perbaruiPesan(baris, isi))
        setBusy(false)
        abort.current = null
      }
    },
    [busy, turns, model, chatId],
  )

  if (status === 'checking') {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Menghubungi Ollama…
      </div>
    )
  }

  if (status === 'offline' || status === 'nomodel') {
    return <Offline reason={status} onRetry={() => void connect()} />
  }

  return (
    <>
      {riwayatTerbuka && (
        <History
          activeId={chatId}
          onPick={(id) => {
            abort.current?.abort()
            void muat(id)
            setRiwayatTerbuka(false)
          }}
          onNew={percakapanBaru}
          onClose={() => setRiwayatTerbuka(false)}
        />
      )}

      <div className="shrink-0 border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2 text-xs text-muted-foreground sm:px-6">
          <button
            type="button"
            onClick={() => setRiwayatTerbuka(true)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Clock className="size-3.5" />
            Riwayat
          </button>
          <button
            type="button"
            onClick={percakapanBaru}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Baru
          </button>

          <span className="ml-auto flex items-center gap-1.5">
            <Cpu className="size-3.5" />
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={busy}
              className="rounded-md border border-input bg-card px-2 py-1 text-xs outline-none disabled:opacity-50"
            >
              {models.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget
          pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
        }}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {turns.length === 0 ? (
            <div className="pt-10 text-center">
              <p className="text-sm text-muted-foreground">Mau tanya apa hari ini?</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {CONTOH.map((contoh) => (
                  <button
                    key={contoh}
                    type="button"
                    onClick={() => void send(contoh)}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                  >
                    {contoh}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            turns.map((turn, i) => <Message key={i} turn={turn} />)
          )}
        </div>
      </div>

      <Composer busy={busy} onSend={(text) => void send(text)} onStop={() => abort.current?.abort()} />
    </>
  )
}
