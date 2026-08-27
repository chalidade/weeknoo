import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'

const MENU = [
  {
    name: 'Kopi Susu Senja',
    desc: 'Espresso rumahan dengan gula aren dan susu segar, signature Kopi Senja.',
    price: 'Rp 22.000',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80',
    tag: 'Best Seller',
  },
  {
    name: 'V60 Manual Brew',
    desc: 'Single origin pilihan, diseduh manual sesuai selera keasaman.',
    price: 'Rp 28.000',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    tag: 'Favorit',
  },
  {
    name: 'Butter Croissant',
    desc: 'Dipanggang segar setiap pagi, renyah di luar dan lembut di dalam.',
    price: 'Rp 18.000',
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    tag: 'Baru',
  },
  {
    name: 'Es Kopi Kelapa',
    desc: 'Perpaduan kopi hitam, santan kelapa, dan sedikit karamel.',
    price: 'Rp 25.000',
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80',
    tag: 'Segar',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function Menu() {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="max-w-xl">
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            Menu Unggulan
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl">
            Diseduh dengan hati, disajikan hangat
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Pilihan minuman dan camilan favorit tamu Kopi Senja — dari racikan
            signature sampai roti panggang segar setiap hari.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {MENU.map((item) => (
            <motion.div
              key={item.name}
              variants={fadeUp}
              className="group overflow-hidden rounded-2xl border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute left-4 top-4">{item.tag}</Badge>
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
                    {item.desc}
                  </p>
                </div>
                <span className="shrink-0 font-display text-lg text-primary">
                  {item.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
