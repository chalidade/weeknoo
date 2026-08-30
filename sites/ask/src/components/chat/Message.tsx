import { useEffect, useRef, useState } from 'react'
import { Brain, ChevronDown, TriangleAlert, User } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Satu giliran percakapan. Jawaban model disimpan terpisah dari proses
 * berpikirnya — itulah yang membuat panel "proses berpikir" bisa ada.
 */
export type Turn =
  | { role: 'user'; content: string }
  | {
      role: 'assistant'
      content: string
      reasoning: string
      /** Lama menjawab, milidetik — dipakai untuk label "· 34 detik". */
      ms: number
      done: boolean
      error?: string
    }

export function Message({ turn }: { turn: Turn }) {
  if (turn.role === 'user') {
    return (
      <div className="flex justify-end gap-3">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground whitespace-pre-wrap">
          {turn.content}
        </p>
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="size-3.5" />
        </div>
      </div>
    )
  }

  return <Answer turn={turn} />
}

function Answer({ turn }: { turn: Extract<Turn, { role: 'assistant' }> }) {
  // Model reasoning berpikir dulu, baru menjawab. Selama belum ada jawaban,
  // panel dibuka supaya layar tidak terlihat menggantung; begitu jawaban
  // muncul ia menutup sendiri — kecuali pembaca sudah memilih sendiri.
  const [manual, setManual] = useState<boolean | null>(null)
  const thinking = !turn.content && !turn.done && !turn.error
  const open = manual ?? thinking
  const seconds = Math.round(turn.ms / 1000)

  // Selama berpikir, kotaknya ikut turun ke baris terbaru — kalau tidak,
  // pembaca hanya melihat paragraf pertama sementara isinya terus bertambah.
  const box = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (thinking && box.current) box.current.scrollTop = box.current.scrollHeight
  }, [turn.reasoning, thinking])

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Brain className={cn('size-3.5', thinking && 'animate-pulse')} />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {turn.reasoning && (
          <div className="overflow-hidden rounded-xl border border-border bg-card/60">
            <button
              type="button"
              onClick={() => setManual(!open)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className={cn('font-medium', thinking && 'text-primary')}>
                {thinking ? 'Sedang berpikir…' : 'Proses berpikir'}
              </span>
              {seconds > 0 && <span className="tabular-nums">· {seconds} detik</span>}
              <ChevronDown
                className={cn('ml-auto size-3.5 shrink-0 transition-transform', open && 'rotate-180')}
              />
            </button>
            {open && (
              <p
                ref={box}
                className="max-h-64 overflow-y-auto border-t border-border px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground"
              >
                {turn.reasoning}
              </p>
            )}
          </div>
        )}

        {turn.content && (
          <p className="leading-relaxed whitespace-pre-wrap">
            {turn.content}
            {!turn.done && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-primary" />}
          </p>
        )}

        {turn.error && (
          <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span className="min-w-0 break-words">{turn.error}</span>
          </p>
        )}
      </div>
    </div>
  )
}
