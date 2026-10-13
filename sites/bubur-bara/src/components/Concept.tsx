import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bike, Check, Store, Tent, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

type Format = {
  id: string
  icon: LucideIcon
  label: string
  title: string
  body: string
  points: string[]
}

const FORMATS: Format[] = [
  {
    id: 'motor',
    icon: Bike,
    label: 'Motor Tiga Roda',
    title: 'Street food yang jemput bola',
    body: 'Motor tiga roda custom dengan dapur claypot terpasang. Bebas sewa tempat, bisa pindah ke titik ramai sarapan: perkantoran, sekolah, perumahan, sampai acara.',
    points: ['Tanpa biaya sewa lahan', 'Rangka anti karat & irit BBM', 'Cocok untuk event & pesanan acara'],
  },
  {
    id: 'tenda',
    icon: Tent,
    label: 'Tenda Outdoor',
    title: 'Hangat dan akrab di pinggir jalan',
    body: 'Tenda modern untuk jalan utama atau area permukiman. Mengutamakan servis cepat dan suasana akrab pelanggan sarapan.',
    points: ['Bongkar pasang cepat', 'Kapasitas 10–15 kursi', 'Ideal untuk area permukiman'],
  },
  {
    id: 'booth',
    icon: Store,
    label: 'Booth Modular',
    title: 'Ringkas untuk area komersial',
    body: 'Booth kayu dan kontainer yang bersih, efisien, dan mencuri perhatian orang yang lalu-lalang — pas untuk ruko, stasiun, dan foodcourt.',
    points: ['Jendela ambil pesanan online', 'Footprint di bawah 6 m²', 'Tampilan seragam di semua lokasi'],
  },
  {
    id: 'house',
    icon: UtensilsCrossed,
    label: 'Bara House',
    title: 'Restoran sarapan keluarga',
    body: 'Outlet permanen dengan nuansa kayu hangat, area ber-AC, dan jendela pick-up khusus untuk takeaway dan ojek online.',
    points: ['Dine-in nyaman untuk keluarga', 'Menu lengkap + kopi', 'Pick-up window terpisah'],
  },
]

export function Concept() {
  const [active, setActive] = useState(FORMATS[0].id)
  const format = FORMATS.find((f) => f.id === active) ?? FORMATS[0]
  const Icon = format.icon

  return (
    <section id="konsep" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-20 sm:px-6 sm:py-24">
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <motion.p variants={fadeUp} className="text-sm font-bold tracking-wide text-primary uppercase">
          Konsep gerai
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-2 max-w-2xl font-display text-4xl font-black tracking-tight sm:text-5xl">
          Satu rasa, empat cara hadir di dekatmu
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div role="tablist" aria-label="Format gerai" className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {FORMATS.map((f) => {
              const FIcon = f.icon
              return (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={f.id === active}
                  onClick={() => setActive(f.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-3 text-left text-sm font-bold transition',
                    f.id === active ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'bg-card hover:bg-muted',
                  )}
                >
                  <FIcon className="size-5 shrink-0" />
                  {f.label}
                </button>
              )
            })}
          </div>

          <div className="overflow-hidden rounded-3xl border bg-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={format.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2"
              >
                <div className="relative grid min-h-56 place-items-center overflow-hidden bg-gradient-to-br from-primary via-primary/85 to-foreground">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_22px,color-mix(in_oklch,var(--color-background)_8%,transparent)_22px_24px)]" />
                  <div className="absolute -bottom-16 -left-10 size-56 rounded-full bg-accent/30 blur-2xl" />
                  <Icon className="relative size-24 text-primary-foreground drop-shadow-xl" strokeWidth={1.3} />
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="font-display text-2xl font-extrabold">{format.title}</h3>
                  <p className="mt-3 text-muted-foreground">{format.body}</p>
                  <ul className="mt-5 space-y-2.5">
                    {format.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm font-semibold">
                        <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                          <Check className="size-3" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
