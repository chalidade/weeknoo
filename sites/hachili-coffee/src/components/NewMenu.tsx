import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { asset } from '@/lib/cafe'

type NewItem = { name: string; price: number }
type Drop = { title: string; image: string; alt: string; items: NewItem[] }

const DROPS: Drop[] = [
  {
    title: 'Minuman',
    image: 'img/new-drinks.jpg',
    alt: 'Avocado Caramel, Avocado Coffee dan Berry Bang Bang',
    items: [
      { name: 'Avocado Caramel', price: 35 },
      { name: 'Avocado Coffee', price: 30 },
      { name: 'Berry Bang Bang', price: 25 },
    ],
  },
  {
    title: 'Makanan',
    image: 'img/new-food.jpg',
    alt: 'Soft Sourdough with Salad, Hachili Chicken Curry Rice dan Smoked Cheese Fries',
    items: [
      { name: 'Soft Sourdough with Salad', price: 35 },
      { name: 'Hachili Chicken Curry Rice', price: 30 },
      { name: 'Smoked Cheese Fries', price: 25 },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export function NewMenu() {
  return (
    <section id="baru" className="dark relative isolate scroll-mt-16 overflow-hidden bg-background py-24 text-foreground sm:py-28">
      <div aria-hidden className="honeycomb absolute inset-0 -z-10 text-primary/[0.08]" />
      <div aria-hidden className="absolute top-0 left-1/2 -z-10 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="mx-auto max-w-6xl px-5 sm:px-6"
      >
        <motion.p variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <Sparkles className="size-4" /> New Menu
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-5 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Baru keluar dari sarang — <span className="text-primary">alpukat, berry & sourdough</span>
        </motion.h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {DROPS.map((drop) => (
            <motion.article
              key={drop.title}
              variants={fadeUp}
              className="group overflow-hidden rounded-[2rem] border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={asset(drop.image)}
                  alt={drop.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-primary-foreground uppercase">
                  {drop.title}
                </span>
              </div>
              <ul className="space-y-1 p-6 pt-2">
                {drop.items.map((item) => (
                  <li key={item.name} className="flex items-baseline gap-3 py-2">
                    <span className="font-display text-xl font-semibold italic">{item.name}</span>
                    <span className="flex-1 border-b border-dashed border-foreground/20" />
                    <span className="font-display text-xl font-extrabold text-primary">{item.price}K</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
