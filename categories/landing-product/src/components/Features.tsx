import { motion } from 'motion/react'
import {
  Activity,
  BatteryFull,
  Bell,
  Droplets,
  HeartPulse,
  MoonStar,
} from 'lucide-react'

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

type Feature = {
  icon: typeof HeartPulse
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: HeartPulse,
    title: 'Sensor detak jantung presisi',
    description:
      'Sensor optik generasi terbaru membaca detak jantung setiap detik, siang dan malam, dengan akurasi setara alat medis konsumen.',
  },
  {
    icon: MoonStar,
    title: 'Analisis tidur mendalam',
    description:
      'Kenali fase tidur ringan, dalam, dan REM-mu. Bangun lebih segar dengan alarm pintar yang menunggu momen paling tepat.',
  },
  {
    icon: Activity,
    title: 'Pelacak 20+ mode olahraga',
    description:
      'Lari, sepeda, renang, hingga badminton — semua tercatat otomatis lengkap dengan kalori, pace, dan zona latihan.',
  },
  {
    icon: BatteryFull,
    title: 'Baterai 14 hari',
    description:
      'Sekali isi daya untuk dua minggu pemakaian normal. Tanpa charger di tas, tanpa cemas kehabisan daya di tengah aktivitas.',
  },
  {
    icon: Droplets,
    title: 'Tahan air 5 ATM',
    description:
      'Aman dipakai berenang hingga kedalaman 50 meter. Hujan, keringat, dan cipratan bukan masalah.',
  },
  {
    icon: Bell,
    title: 'Notifikasi pintar',
    description:
      'Pesan, telepon, dan pengingat penting tampil di pergelangan tangan — kamu tetap fokus tanpa harus membuka ponsel.',
  },
]

export function Features() {
  return (
    <section id="fitur" className="bg-muted/50 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm font-semibold tracking-widest text-primary uppercase"
        >
          Fitur Unggulan
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
        >
          Satu gelang, semua data kesehatan yang kamu butuhkan
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-muted-foreground">
          Dirancang untuk dipakai seharian tanpa terasa — dan bekerja diam-diam
          mengumpulkan data yang membantumu hidup lebih sehat.
        </motion.p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group rounded-xl border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
