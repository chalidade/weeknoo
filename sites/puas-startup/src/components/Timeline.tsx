import { CalendarDays, FileText, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEADLINE, WAVE2_CLOSES, WAVE2_OPENS, phaseAt, timeLeft, type Phase } from '@/lib/waves'
import { useNow } from '@/lib/useNow'

const WAVES = [
  {
    name: 'Gelombang 1',
    registerLabel: 'Pendaftaran hingga',
    register: '25 Nov 2026',
    announce: 'Des 2026',
    status: (p: Phase, now: number) =>
      p === 'wave1' ? { text: `Dibuka, tutup ${timeLeft(now, DEADLINE)}`, live: true } : { text: 'Sudah ditutup', live: false },
  },
  {
    name: 'Gelombang 2',
    registerLabel: 'Pendaftaran',
    register: 'Jan – Feb 2027',
    announce: 'Mar 2027',
    status: (p: Phase, now: number) =>
      p === 'wave2'
        ? { text: `Dibuka, tutup ${timeLeft(now, WAVE2_CLOSES)}`, live: true }
        : p === 'closed'
          ? { text: 'Sudah ditutup', live: false }
          : p === 'between'
            ? { text: `Dibuka ${timeLeft(now, WAVE2_OPENS)}`, live: false }
            : { text: 'Belum dibuka', live: false },
  },
]

export function Timeline() {
  const now = useNow()

  return (
    <section id="jadwal" className="@container wrap scroll-mt-20">
      <h2 className="h-group group-head">Dua gelombang pendaftaran</h2>
      <div className="bento">
        {WAVES.map((w) => {
          // Filled in after mount: it depends on today's date.
          const status = now === null ? null : w.status(phaseAt(now), now)
          return (
            <article key={w.name} className="tile tile-white col-span-2 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5">
                <h3 className="flex items-center gap-3 text-[1.5rem] leading-none font-extrabold tracking-[-0.03em]">
                  <span className="chip bg-emerald text-white">
                    <CalendarDays className="size-6" strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  {w.name}
                </h3>
                {status && (
                  <span
                    className={cn(
                      'rounded-full px-3 py-1.5 text-sm font-bold',
                      status.live ? 'bg-amber text-ink' : 'bg-mist text-muted-foreground',
                    )}
                  >
                    {status.text}
                  </span>
                )}
              </div>

              <dl className="mt-5 grid grid-cols-1 gap-2.5 @min-[21rem]:grid-cols-2">
                <div className="rounded-2xl bg-mist p-3.5 sm:p-4">
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="size-4 shrink-0" aria-hidden="true" />
                    {w.registerLabel}
                  </dt>
                  <dd className="mt-2 text-[1.05rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[1.2rem]">{w.register}</dd>
                </div>
                <div className="rounded-2xl bg-mist p-3.5 sm:p-4">
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Megaphone className="size-4 shrink-0" aria-hidden="true" />
                    Pengumuman pemenang
                  </dt>
                  <dd className="mt-2 text-[1.05rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[1.2rem]">{w.announce}</dd>
                </div>
              </dl>
            </article>
          )
        })}
      </div>
    </section>
  )
}
