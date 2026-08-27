import { motion } from 'motion/react'
import {
  Coffee,
  CookingPot,
  Fish,
  Salad,
  Soup,
  UtensilsCrossed,
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

type GalleryItem = {
  label: string
  icon: LucideIcon
  gradient: string
}

const ITEMS: GalleryItem[] = [
  {
    label: 'Rendang di tungku kayu',
    icon: CookingPot,
    gradient: 'from-primary/35 via-accent to-muted',
  },
  {
    label: 'Gulai kakap kuning',
    icon: Fish,
    gradient: 'from-accent via-muted to-primary/25',
  },
  {
    label: 'Sop buntut kuah kaldu',
    icon: Soup,
    gradient: 'from-muted via-accent to-primary/30',
  },
  {
    label: 'Lalapan & sambal dadak',
    icon: Salad,
    gradient: 'from-primary/25 via-muted to-accent',
  },
  {
    label: 'Kopi tubruk gula aren',
    icon: Coffee,
    gradient: 'from-accent via-primary/20 to-muted',
  },
  {
    label: 'Ruang makan keluarga',
    icon: UtensilsCrossed,
    gradient: 'from-muted via-primary/25 to-accent',
  },
]

export function Gallery() {
  return (
    <section id="galeri" className="border-t bg-background py-20 sm:py-24">
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
          Galeri
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          Suasana hangat dari dapur hingga meja
        </motion.h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <motion.figure
              key={item.label}
              variants={fadeUp}
              className="group overflow-hidden rounded-2xl border bg-card shadow-xs"
            >
              <div
                className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${item.gradient} transition-transform duration-300 group-hover:scale-105`}
              >
                <item.icon className="size-10 text-primary/70" aria-hidden />
              </div>
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                {item.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
