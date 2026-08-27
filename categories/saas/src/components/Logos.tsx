import { motion } from 'motion/react'
import { Boxes, Coffee, Layers, Ship, Store, Waves } from 'lucide-react'

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

type Logo = { icon: typeof Store; name: string }

const LOGOS: Logo[] = [
  { icon: Store, name: 'Arunika Retail' },
  { icon: Ship, name: 'Baswara Logistik' },
  { icon: Layers, name: 'Candra Kreatif' },
  { icon: Coffee, name: 'Dwipa Foods' },
  { icon: Waves, name: 'Elang Media' },
  { icon: Boxes, name: 'Gita Solusi' },
]

export function Logos() {
  return (
    <section id="klien" className="border-y bg-card/40 py-12">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-center text-sm text-muted-foreground"
        >
          Dipercaya 1.200+ tim keuangan di seluruh Indonesia
        </motion.p>
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {LOGOS.map((logo) => (
            <motion.div
              key={logo.name}
              variants={fadeUp}
              className="flex items-center justify-center gap-2 text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              <logo.icon className="size-4 shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
