import { motion } from 'motion/react'
import { MessageCircle, Moon, Sun, UtensilsCrossed } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { asset, waLink } from '@/lib/cafe'

type Pick = { name: string; price: number }
type Paket = {
  title: string
  when: string
  icon: LucideIcon
  image?: string
  items: Pick[]
}

// Rekomendasi kombinasi dari halaman "Special Menu" di buku menu.
// Total = jumlah harga satuan menu (bukan harga promo).
const PAKET: Paket[] = [
  {
    title: 'Camilan Sore',
    when: 'Teman ngobrol jam 3 sore',
    icon: Sun,
    image: 'img/camilan-sore.jpg',
    items: [
      { name: 'Mix Platter', price: 26 },
      { name: 'Creamy Blueberry Day', price: 27 },
    ],
  },
  {
    title: 'Makan Malam',
    when: 'Berdua atau bertiga, pulang kenyang',
    icon: Moon,
    image: 'img/makan-malam.jpg',
    items: [
      { name: 'Nasi Beef Teriyaki', price: 37 },
      { name: 'Nasi Kulit Daun Jeruk', price: 31 },
      { name: 'Soft Tofu', price: 20 },
      { name: 'Milkshake Strawberry', price: 27 },
      { name: 'Lemon Grass Tea', price: 21 },
    ],
  },
  {
    title: 'Special Menu',
    when: 'Rasa nusantara + mocktail segar',
    icon: UtensilsCrossed,
    items: [
      { name: 'Nasi Bebek Nusantara', price: 39 },
      { name: 'Sunset & Sea', price: 25 },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export function Paket() {
  return (
    <section id="paket" className="scroll-mt-16 bg-secondary/60 py-24 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="mx-auto max-w-6xl px-5 sm:px-6"
      >
        <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
          Paduan Rekomendasi
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Bingung pesan apa? Ikuti pilihan lebah.
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PAKET.map((p, i) => {
            const total = p.items.reduce((sum, x) => sum + x.price, 0)
            return (
              <motion.article
                key={p.title}
                variants={fadeUp}
                className={cn(
                  'flex flex-col overflow-hidden rounded-[2rem] border bg-card shadow-xs',
                  i === 1 && 'lg:-translate-y-6 lg:shadow-xl',
                )}
              >
                {p.image ? (
                  <div className="aspect-[5/4] overflow-hidden bg-muted">
                    <img src={asset(p.image)} alt={p.title} loading="lazy" className="size-full object-cover" />
                  </div>
                ) : (
                  <div className="relative grid aspect-[5/4] place-items-center overflow-hidden bg-primary">
                    <div aria-hidden className="honeycomb absolute inset-0 text-primary-foreground/15" />
                    <p className="relative px-8 text-center font-display text-3xl leading-tight font-extrabold text-primary-foreground">
                      Nasi Bebek
                      <br />× Sunset &amp; Sea
                    </p>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                      <p.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl leading-none font-bold">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.when}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm">
                    {p.items.map((x) => (
                      <li key={x.name} className="flex justify-between gap-3">
                        <span>{x.name}</span>
                        <span className="text-muted-foreground">{x.price}K</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <div className="flex items-baseline justify-between border-t pt-4">
                      <span className="text-sm text-muted-foreground">Total harga menu</span>
                      <span className="font-display text-3xl font-extrabold text-primary">{total}K</span>
                    </div>
                    <a
                      href={waLink(`Halo Ha.Chi.Li, saya mau pesan paket ${p.title}: ${p.items.map((x) => x.name).join(', ')} 🐝`)}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 w-full rounded-full')}
                    >
                      <MessageCircle />
                      Tanya paket ini
                    </a>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
