import { motion } from 'motion/react'
import { Smartphone, TrendingUp, Watch } from 'lucide-react'

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

type Step = {
  icon: typeof Watch
  step: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: Watch,
    step: '01',
    title: 'Pakai gelangnya',
    description:
      'Kenakan di pergelangan tangan seperti jam biasa. Ringan (19 gram) dan nyaman dipakai tidur — sensornya langsung mulai bekerja.',
  },
  {
    icon: Smartphone,
    step: '02',
    title: 'Sambungkan ke aplikasi',
    description:
      'Pindai kode QR di kemasan, sambungkan lewat Bluetooth, selesai dalam dua menit. Tersedia untuk Android dan iOS, gratis selamanya.',
  },
  {
    icon: TrendingUp,
    step: '03',
    title: 'Lihat progresmu tumbuh',
    description:
      'Setiap pagi kamu mendapat ringkasan tidur, energi, dan saran aktivitas — makin lama dipakai, makin personal rekomendasinya.',
  },
]

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="text-center">
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-widest text-primary uppercase"
          >
            Cara Kerja
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            Mulai dalam tiga langkah sederhana
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Tidak perlu jadi ahli teknologi. Dari buka kotak sampai data pertama
            masuk, kurang dari lima menit.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              className="relative rounded-xl border bg-card p-8"
            >
              <span
                aria-hidden
                className="absolute top-6 right-6 font-display text-5xl font-extrabold text-primary/10"
              >
                {step.step}
              </span>
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
