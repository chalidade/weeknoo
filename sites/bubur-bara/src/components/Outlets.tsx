import { motion } from 'motion/react'
import { Clock, MapPin, MessageCircle, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isOpenNow, OUTLETS, waLink } from '@/lib/bara'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Outlets() {
  return (
    <section id="outlet" className="scroll-mt-16 bg-card/60 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.p variants={fadeUp} className="text-sm font-bold tracking-wide text-primary uppercase">
          Lokasi gerai
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-2 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Temukan gerai terdekat
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 max-w-xl text-muted-foreground">
          Pesan online lalu pilih gerai saat checkout — pesananmu disiapkan sebelum kamu tiba.
        </motion.p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {OUTLETS.map((o) => {
            const open = isOpenNow(o)
            return (
              <motion.article key={o.id} variants={fadeUp} className="flex flex-col overflow-hidden rounded-3xl border bg-background">
                <div className="relative grid h-36 place-items-center bg-[linear-gradient(135deg,var(--color-secondary),var(--color-accent))]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklch,var(--color-foreground)_15%,transparent)_1px,transparent_0)] bg-[size:14px_14px]" />
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <Store className="size-7" />
                  </span>
                  <span
                    className={cn(
                      'absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-extrabold',
                      open ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground',
                    )}
                  >
                    {open ? '● Buka sekarang' : 'Tutup'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-bold text-primary uppercase">{o.format}</p>
                  <h3 className="mt-1 font-display text-xl font-extrabold">{o.name}</h3>
                  <p className="mt-3 flex gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0" /> {o.address}
                  </p>
                  <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
                    <Clock className="mt-0.5 size-4 shrink-0" /> {o.hours}
                  </p>
                  <a
                    href={waLink(`Halo Bubur Bara ${o.name}, saya mau tanya info / reservasi.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition hover:bg-muted"
                  >
                    <MessageCircle className="size-4" /> Info & reservasi
                  </a>
                </div>
              </motion.article>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
