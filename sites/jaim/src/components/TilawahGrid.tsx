import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { BookOpen } from 'lucide-react'
import { db } from '@/lib/db/db'
import { JUZ_LIST } from '@/lib/juz'

export function TilawahGrid() {
  const [done, setDone] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    void db.tilawah.toArray().then((rows) => {
      setDone(new Set(rows.filter((r) => r.done).map((r) => r.juz)))
    })
  }, [])

  const toggle = (juz: number) => {
    setSelected(juz)
    const next = new Set(done)
    const nowDone = !next.has(juz)
    if (nowDone) next.add(juz)
    else next.delete(juz)
    setDone(next)
    void db.tilawah.put({ juz, done: nowDone, updatedAt: Date.now() })
  }

  const detail = selected ? JUZ_LIST[selected - 1] : null
  const progress = Math.round((done.size / 30) * 100)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Progres Tilawah</h2>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-success">{done.size}</span>/30 Juz
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-success transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-6 gap-1.5">
        {JUZ_LIST.map(({ juz }) => {
          const isDone = done.has(juz)
          return (
            <button
              key={juz}
              onClick={() => toggle(juz)}
              aria-label={`Juz ${juz}`}
              className={`aspect-square rounded-lg border text-xs font-medium tabular-nums transition-all active:scale-90 ${
                isDone
                  ? 'border-success bg-success text-white'
                  : 'bg-background text-muted-foreground hover:border-success/50 hover:text-foreground'
              } ${selected === juz ? 'ring-2 ring-ring ring-offset-1 ring-offset-card' : ''}`}
            >
              {juz}
            </button>
          )
        })}
      </div>

      {detail && (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
          <BookOpen className="mt-0.5 size-3.5 shrink-0 text-success" />
          <span>
            <span className="font-semibold text-foreground">Juz {detail.juz}</span> ·{' '}
            {detail.range} —{' '}
            {done.has(detail.juz) ? 'sudah dibaca ✓' : 'belum dibaca'}
          </span>
        </p>
      )}
    </motion.section>
  )
}
