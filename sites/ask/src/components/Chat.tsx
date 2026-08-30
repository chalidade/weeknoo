import { useCallback, useEffect, useRef, useState } from 'react'
import { Cpu } from 'lucide-react'
import { chatStream, getOllamaModels, isOllamaRunning, OLLAMA_MODEL, type ChatMessage } from '@/lib/ai'
import { Composer } from '@/components/chat/Composer'
import { Message, type Turn } from '@/components/chat/Message'
import { Offline } from '@/components/chat/Offline'

type Status = 'checking' | 'offline' | 'nomodel' | 'ready'

/**
 * Tanpa ini qwen3 berpikir dalam Bahasa Inggris dan memeriksa ulang jawabannya
 * berkali-kali — pertanyaan "ibukota Jawa Barat" sempat memakan 100 detik lebih
 * tanpa hasil. Dengan perintah ini: 14 detik, jawabannya "Bandung".
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

export function Chat() {
  const [status, setStatus] = useState<Status>('checking')
  const [models, setModels] = useState<string[]>([])
  const [model, setModel] = useState(OLLAMA_MODEL)
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)

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

  useEffect(() => {
    void connect()
  }, [connect])

  useEffect(() => {
    const el = scroller.current
    if (el && pinned.current) el.scrollTop = el.scrollHeight
  }, [turns])

  // Membatalkan permintaan yang masih jalan kalau halaman ditutup.
  useEffect(() => () => abort.current?.abort(), [])

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
      const patch = (change: (last: Extract<Turn, { role: 'assistant' }>) => Partial<Turn>) =>
        setTurns((t) => {
          const last = t[t.length - 1]
          if (last?.role !== 'assistant') return t
          return [...t.slice(0, -1), { ...last, ...change(last) }]
        })

      try {
        // Proses berpikir ikut memakan jatah token, jadi batasnya dinaikkan —
        // dengan 1024 bawaan, jawaban panjang bisa terpotong di tengah.
        for await (const chunk of chatStream(history, {
          model,
          maxTokens: 2048,
          signal: controller.signal,
        })) {
          patch((last) => ({
            content: last.content + chunk.content,
            reasoning: last.reasoning + chunk.reasoning,
            ms: Date.now() - started,
          }))
        }
      } catch (err) {
        // Berhenti karena tombol stop bukan kesalahan — biarkan apa adanya.
        if (!controller.signal.aborted) {
          patch(() => ({ error: err instanceof Error ? err.message : String(err) }))
        }
      } finally {
        patch(() => ({ done: true }))
        setBusy(false)
        abort.current = null
      }
    },
    [busy, turns, model],
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
      <div className="shrink-0 border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2 text-xs text-muted-foreground sm:px-6">
          <span className="size-1.5 rounded-full bg-accent" />
          <span>siap</span>
          <Cpu className="ml-2 size-3.5" />
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
