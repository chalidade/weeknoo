import { motion } from 'motion/react'
import { Clock, MapPin, Phone, TrainFront } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

type OpeningHour = { days: string; hours: string }

const HOURS: OpeningHour[] = [
  { days: 'Senin – Jumat', hours: '10.00 – 22.00 WIB' },
  { days: 'Sabtu – Minggu', hours: '09.00 – 23.00 WIB' },
  { days: 'Hari libur nasional', hours: '09.00 – 23.00 WIB' },
]

export function Location() {
  return (
    <section id="lokasi" className="border-t bg-muted/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium tracking-widest text-primary uppercase"
        >
          Lokasi & Jam Buka
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          Mudah dijangkau, nyaman untuk keluarga
        </motion.h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-xs sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MapPin className="size-5 text-primary" />
              </span>
              <div>
                <h3 className="font-medium">Alamat</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Jl. Kenanga No. 12, Kebayoran Baru,
                  <br />
                  Jakarta Selatan 12110
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Clock className="size-5 text-primary" />
              </span>
              <div className="w-full">
                <h3 className="font-medium">Jam buka</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {HOURS.map((row) => (
                    <li key={row.days} className="flex justify-between gap-4">
                      <span>{row.days}</span>
                      <span className="font-medium text-foreground">{row.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Phone className="size-5 text-primary" />
              </span>
              <div>
                <h3 className="font-medium">Reservasi & takeaway</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  (021) 555-0123 · WhatsApp 0812-3456-7890
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <TrainFront className="size-5 text-primary" />
              </span>
              <div>
                <h3 className="font-medium">Akses</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  5 menit jalan kaki dari stasiun MRT terdekat, parkir luas untuk
                  mobil dan bus keluarga.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/20 via-muted to-accent shadow-xs"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(theme(colors.border)_1px,transparent_1px),linear-gradient(90deg,theme(colors.border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"
            />
            <div className="relative flex h-full min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="flex size-14 items-center justify-center rounded-full border bg-card shadow-sm">
                <MapPin className="size-7 text-primary" />
              </span>
              <p className="font-display text-xl font-bold">Peta menuju restoran</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Cari kami di aplikasi peta favorit Anda dengan kata kunci nama
                restoran ini.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
