import { useEffect, useState } from 'react'
import { m, type Variants } from 'motion/react'
import { CalendarClock, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const WAVES = [
  {
    name: 'Gelombang 1',
    register: 'Hingga 25 Nov 2026',
    announce: 'Desember 2026',
    opens: new Date('2026-01-01T00:00:00+03:00'),
    closes: new Date('2026-11-25T23:59:59+03:00'),
  },
  {
    name: 'Gelombang 2',
    register: 'Januari – Februari 2027',
    announce: 'Maret 2027',
    opens: new Date('2027-01-01T00:00:00+03:00'),
    closes: new Date('2027-02-28T23:59:59+03:00'),
  },
]

function status(now: number | null, opens: Date, closes: Date) {
  if (now === null) return { label: '', live: false }
  if (now < opens.getTime()) return { label: 'Segera dibuka', live: false }
  if (now <= closes.getTime()) return { label: 'Sedang dibuka', live: true }
  return { label: 'Ditutup', live: false }
}

export function Timeline() {
  // Status depends on today's date, so it is filled in after mount (prerender-safe).
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => setNow(Date.now()), [])
  return (
    <section id="jadwal" className="relative scroll-mt-24 py-20 sm:py-28">
      <m.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        <m.p variants={fadeUp} className="font-mono text-xs tracking-[0.25em] text-primary uppercase">
          Jadwal
        </m.p>
        <m.h2 variants={fadeUp} className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Dua gelombang, <span className="text-gold">satu kesempatan emas.</span>
        </m.h2>

        <div className="relative mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {WAVES.map((w) => {
            const s = status(now, w.opens, w.closes)
            return (
              <m.article
                key={w.name}
                variants={fadeUp}
                className={cn('glass relative min-w-0 rounded-3xl p-5 sm:p-7', s.live && 'ring-gold shadow-2xl shadow-gold-1/10')}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold whitespace-nowrap sm:text-2xl">{w.name}</h3>
                  <span
                    hidden={!s.label}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap',
                      s.live ? 'bg-gold text-primary-foreground' : 'border border-border text-muted-foreground',
                    )}
                  >
                    {s.live && <span className="size-1.5 animate-pulse rounded-full bg-primary-foreground" />}
                    {s.label}
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <CalendarClock className="size-5 text-primary" />
                    <p className="mt-3 text-xs tracking-wide text-muted-foreground uppercase">Pendaftaran</p>
                    <p className="mt-1 font-semibold">{w.register}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <Megaphone className="size-5 text-primary" />
                    <p className="mt-3 text-xs tracking-wide text-muted-foreground uppercase">Pengumuman pemenang</p>
                    <p className="mt-1 font-semibold">{w.announce}</p>
                  </div>
                </div>
              </m.article>
            )
          })}
        </div>
      </m.div>
    </section>
  )
}
