import { motion } from 'motion/react'
import { Clock, MapPin, Phone } from 'lucide-react'

const HOURS = [
  { day: 'Senin – Jumat', time: '08.00 – 22.00' },
  { day: 'Sabtu – Minggu', time: '09.00 – 23.00' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function Visit() {
  return (
    <section id="lokasi" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="grid gap-10 overflow-hidden rounded-3xl border bg-card lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="relative min-h-72">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=80"
            alt="Interior Kopi Senja"
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col justify-center p-8 sm:p-12">
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            Kunjungi Kami
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Jam Buka &amp; Lokasi
          </h2>

          <div className="mt-8 space-y-6">
            <div className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-1 text-sm">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex justify-between gap-6">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-medium">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground text-pretty">
                Jl. Braga No. 45, Sumur Bandung, Kota Bandung, Jawa Barat 40111
              </p>
            </div>

            <div className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
              <a
                href="https://wa.me/6281234567890"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                +62 812-3456-7890 (WhatsApp)
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
