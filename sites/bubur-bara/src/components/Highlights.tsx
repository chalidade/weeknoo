import { motion } from 'motion/react'
import { CookingPot, HeartHandshake, Timer, Wallet, type LucideIcon } from 'lucide-react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

type Point = { icon: LucideIcon; title: string; body: string }

const POINTS: Point[] = [
  {
    icon: CookingPot,
    title: 'Dibakar per porsi',
    body: 'Setiap mangkuk tanah liat dipanaskan langsung di atas bara, jadi pinggir buburnya berkerak dan harum asap.',
  },
  {
    icon: Timer,
    title: 'Saji di bawah 3 menit',
    body: 'Dirancang untuk jam sibuk 06.00–09.00. Pesan dari rumah, tinggal ambil tanpa antre.',
  },
  {
    icon: Wallet,
    title: 'Mulai Rp 10 ribuan',
    body: 'Rasa sekelas resto dengan harga sarapan harian — cocok untuk pelajar, pekerja, dan keluarga.',
  },
  {
    icon: HeartHandshake,
    title: 'Bumbu dari dapur pusat',
    body: 'Kuah laksa, semur, dan kuah kuning diracik terpusat agar rasanya sama di setiap gerai.',
  },
]

export function Highlights() {
  return (
    <section aria-label="Keunggulan" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {POINTS.map(({ icon: Icon, title, body }) => (
          <motion.li key={title} variants={fadeUp} className="rounded-2xl border bg-card p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-extrabold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
