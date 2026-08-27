import { motion } from 'motion/react'
import {
  Footprints,
  Layers,
  Shirt,
  Sparkles,
  Timer,
  WashingMachine,
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

type Service = { icon: LucideIcon; name: string; desc: string; price: string }

const SERVICES: Service[] = [
  {
    icon: WashingMachine,
    name: 'Cuci Komplit Kiloan',
    desc: 'Cuci, kering, setrika, dan lipat rapi. Wangi tahan lama dengan pewangi pilihan.',
    price: 'Rp7.000/kg',
  },
  {
    icon: Timer,
    name: 'Express 6 Jam',
    desc: 'Butuh cepat? Masukkan pagi, sore sudah bisa dipakai lagi. Kuota terbatas per hari.',
    price: 'Rp12.000/kg',
  },
  {
    icon: Shirt,
    name: 'Setrika Saja',
    desc: 'Pakaian sudah bersih tapi menumpuk? Kami setrika licin dan lipat per jenis.',
    price: 'Rp5.000/kg',
  },
  {
    icon: Layers,
    name: 'Bed Cover & Selimut',
    desc: 'Cuci satuan untuk bed cover, selimut tebal, sprei, dan gorden.',
    price: 'mulai Rp25.000',
  },
  {
    icon: Sparkles,
    name: 'Dry Cleaning',
    desc: 'Perawatan khusus jas, gaun, kebaya, dan batik premium tanpa merusak serat kain.',
    price: 'mulai Rp35.000',
  },
  {
    icon: Footprints,
    name: 'Cuci Sepatu',
    desc: 'Deep cleaning sepatu sneakers, kanvas, hingga kulit — kembali seperti baru.',
    price: 'mulai Rp30.000',
  },
]

export function Services() {
  return (
    <section id="layanan" className="border-t bg-muted/40">
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
            Layanan & Harga
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Semua urusan cucian, satu tempat
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Harga jujur tanpa biaya tersembunyi. Timbang di depan Anda saat
            penjemputan.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <motion.article
              key={service.name}
              variants={fadeUp}
              className="flex flex-col rounded-3xl border bg-card p-7 transition-shadow hover:shadow-md"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <service.icon className="size-6" />
              </span>
              <h3 className="font-display mt-5 text-xl font-semibold">{service.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.desc}
              </p>
              <p className="mt-5">
                <span className="rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground">
                  {service.price}
                </span>
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
