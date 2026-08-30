import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Send, Square, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sebagaiSumberGambar, siapkanGambar } from '@/lib/gambar'
import { cn } from '@/lib/utils'

/** Kotak ketik. Enter mengirim, Shift+Enter ganti baris. */
export function Composer({
  busy,
  bisaLihat,
  onSend,
  onStop,
}: {
  busy: boolean
  /** Model yang sedang dipakai bisa membaca gambar atau tidak. */
  bisaLihat: boolean
  onSend: (text: string, images: string[]) => void
  onStop: () => void
}) {
  const [text, setText] = useState('')
  const [gambar, setGambar] = useState<string[]>([])
  const [memproses, setMemproses] = useState(false)
  const box = useRef<HTMLTextAreaElement>(null)
  const berkas = useRef<HTMLInputElement>(null)

  // Tinggi kotak mengikuti isinya, dibatasi supaya tidak menelan layar.
  useEffect(() => {
    const el = box.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [text])

  // Model teks tidak bisa membaca gambar — lampiran yang terlanjur dipilih
  // dibuang saat model diganti, supaya tidak terkirim diam-diam lalu diabaikan.
  useEffect(() => {
    if (!bisaLihat) setGambar([])
  }, [bisaLihat])

  async function tambahGambar(files: FileList | null) {
    if (!files || files.length === 0) return
    setMemproses(true)
    try {
      const baru = await Promise.all(
        Array.from(files)
          .filter((f) => f.type.startsWith('image/'))
          .map(siapkanGambar),
      )
      setGambar((lama) => [...lama, ...baru])
    } catch {
      // Berkas rusak atau format aneh — abaikan saja, jangan menjatuhkan halaman.
    } finally {
      setMemproses(false)
      if (berkas.current) berkas.current.value = ''
    }
  }

  function submit() {
    const question = text.trim()
    if ((!question && gambar.length === 0) || busy) return
    onSend(question, gambar)
    setText('')
    setGambar([])
  }

  return (
    <div className="shrink-0 border-t border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      {gambar.length > 0 && (
        <div className="mx-auto mb-2 flex max-w-3xl flex-wrap gap-2">
          {gambar.map((g, i) => (
            <div key={i} className="relative">
              <img
                src={sebagaiSumberGambar(g)}
                alt={`Lampiran ${i + 1}`}
                className="size-16 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                aria-label={`Hapus lampiran ${i + 1}`}
                onClick={() => setGambar((lama) => lama.filter((_, n) => n !== i))}
                className="absolute -top-1.5 -right-1.5 rounded-full bg-secondary p-0.5 text-secondary-foreground shadow transition-colors hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <input
          ref={berkas}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void tambahGambar(e.target.files)}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={!bisaLihat || busy || memproses}
          onClick={() => berkas.current?.click()}
          className={cn('size-11 shrink-0 text-muted-foreground', !bisaLihat && 'opacity-40')}
          title={
            bisaLihat
              ? 'Lampirkan gambar'
              : 'Model ini tidak bisa membaca gambar — ganti ke model dengan kemampuan melihat'
          }
          aria-label="Lampirkan gambar"
        >
          <ImagePlus className="size-4" />
        </Button>

        <textarea
          ref={box}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={bisaLihat ? 'Tanya apa saja, atau lampirkan gambar…' : 'Tanya apa saja…'}
          className="max-h-45 min-h-11 flex-1 resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
        />

        {busy ? (
          <Button type="button" size="icon" variant="secondary" onClick={onStop} className="size-11 shrink-0" aria-label="Hentikan">
            <Square className="size-4 fill-current" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            onClick={submit}
            disabled={(!text.trim() && gambar.length === 0) || memproses}
            className="size-11 shrink-0"
            aria-label="Kirim"
          >
            <Send className="size-4" />
          </Button>
        )}
      </div>

      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
        {memproses
          ? 'Menyiapkan gambar…'
          : 'Enter mengirim · Shift+Enter ganti baris · jawaban bisa 30–120 detik di CPU'}
      </p>
    </div>
  )
}
