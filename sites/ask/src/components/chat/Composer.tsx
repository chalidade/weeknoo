import { useEffect, useRef, useState } from 'react'
import { Send, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Kotak ketik. Enter mengirim, Shift+Enter ganti baris. */
export function Composer({
  busy,
  onSend,
  onStop,
}: {
  busy: boolean
  onSend: (text: string) => void
  onStop: () => void
}) {
  const [text, setText] = useState('')
  const box = useRef<HTMLTextAreaElement>(null)

  // Tinggi kotak mengikuti isinya, dibatasi supaya tidak menelan layar.
  useEffect(() => {
    const el = box.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [text])

  function submit() {
    const question = text.trim()
    if (!question || busy) return
    onSend(question)
    setText('')
  }

  return (
    <div className="shrink-0 border-t border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
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
          placeholder="Tanya apa saja…"
          className="max-h-45 min-h-11 flex-1 resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
        />
        {busy ? (
          <Button type="button" size="icon" variant="secondary" onClick={onStop} className="size-11 shrink-0" aria-label="Hentikan">
            <Square className="size-4 fill-current" />
          </Button>
        ) : (
          <Button type="button" size="icon" onClick={submit} disabled={!text.trim()} className="size-11 shrink-0" aria-label="Kirim">
            <Send className="size-4" />
          </Button>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
        Enter mengirim · Shift+Enter ganti baris · jawaban bisa 30–120 detik di CPU
      </p>
    </div>
  )
}
