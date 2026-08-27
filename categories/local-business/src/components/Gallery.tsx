import { motion } from 'motion/react'
import {
  Package,
  Shirt,
  Sparkles,
  Truck,
  WashingMachine,
  Wind,
  type LucideIcon,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

type GalleryItem = { icon: LucideIcon; caption: string; gradient: string }

const ITEMS: GalleryItem[] = [
  {
    icon: WashingMachine,
    caption: 'Area cuci dengan 12 mesin kapasitas besar',
    gradient: 'from-primary/25 via-muted to-accent',
  },
  {
    icon: Wind,
    caption: 'Ruang pengering — cucian kering sempurna saat hujan',
    gradient: 'from-accent via-background to-primary/20',
  },
  {
    icon: Shirt,
    caption: 'Meja setrika uap untuk hasil licin maksimal',
    gradient: 'from-muted via-accent to-primary/15',
  },
  {
    icon: Sparkles,
    caption: 'Stasiun dry cleaning untuk pakaian premium',
    gradient: 'from-primary/20 via-accent to-muted',
  },
  {
    icon: Package,
    caption: 'Pengemasan rapi dengan label nama pelanggan',
    gradient: 'from-accent via-primary/15 to-background',
  },
  {
    icon: Truck,
    caption: 'Armada antar-jemput siap setiap hari',
    gradient: 'from-muted via-primary/20 to-accent',
  },
]

export function Gallery() {
  return (
    <section id="galeri" className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground"
          >
            Galeri
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Intip dapur kerja kami
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Bersih di hasil, bersih juga di proses. Silakan mampir kapan saja ke
            outlet kami.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ITEMS.map((item) => (
            <motion.figure key={item.caption} variants={fadeUp}>
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-3xl border bg-gradient-to-br ${item.gradient}`}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <item.icon className="size-14 text-primary/45" strokeWidth={1.25} />
                </div>
              </div>
              <figcaption className="mt-3 px-1 text-sm text-muted-foreground">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
