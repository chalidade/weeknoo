import { motion } from 'motion/react'
import {
  CalendarDays,
  Clock,
  Droplets,
  Leaf,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

type Reason = { icon: LucideIcon; title: string; desc: string }

const REASONS: Reason[] = [
  {
    icon: ShieldCheck,
    title: 'Tidak dicampur',
    desc: 'Cucian setiap pelanggan dikerjakan dalam mesin terpisah, dari cuci sampai lipat.',
  },
  {
    icon: Leaf,
    title: 'Deterjen ramah lingkungan',
    desc: 'Formula lembut di kain dan aman untuk kulit sensitif maupun pakaian bayi.',
  },
  {
    icon: Clock,
    title: 'Tepat waktu bergaransi',
    desc: 'Terlambat dari jadwal yang dijanjikan? Ongkos laundry Anda kami gratiskan.',
  },
  {
    icon: Truck,
    title: 'Antar-jemput gratis',
    desc: 'Cukup chat, kurir kami jemput ke rumah untuk area sekitar 5 km — tanpa minimum.',
  },
  {
    icon: Droplets,
    title: 'Pewangi bisa dipilih',
    desc: 'Lima varian pewangi premium, atau tanpa pewangi untuk Anda yang sensitif.',
  },
  {
    icon: CalendarDays,
    title: 'Buka 7 hari seminggu',
    desc: 'Termasuk hari libur nasional, pukul 07.00–21.00. Cucian tidak kenal tanggal merah.',
  },
]

export function WhyUs() {
  return (
    <section id="keunggulan" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground"
          >
            Kenapa Kami
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Laundry tetangga yang{' '}
            <span className="italic text-primary">bisa dipercaya</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Kami memperlakukan cucian Anda seperti milik sendiri — karena
            pelanggan kami adalah tetangga kami sendiri.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {REASONS.map((reason) => (
            <motion.div key={reason.title} variants={fadeUp} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <reason.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{reason.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {reason.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
