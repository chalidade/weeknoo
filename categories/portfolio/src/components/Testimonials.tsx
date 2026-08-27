import { motion } from 'motion/react'
import { Quote } from 'lucide-react'

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

type Testimonial = {
  quote: string
  name: string
  role: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Jarang ada desainer yang juga paham kode sedalam ini. Handoff nyaris tanpa revisi — hemat berminggu-minggu waktu tim kami.',
    name: 'Rina Ayudia',
    role: 'Manajer Produk, startup fintech',
  },
  {
    quote:
      'Landing page baru kami dua kali lebih cepat dan konversi naik 35%. Prosesnya rapi, komunikatif, dan selalu tepat waktu.',
    name: 'Bagas Firmansyah',
    role: 'Pemilik brand kopi lokal',
  },
  {
    quote:
      'Design system yang dibangunnya masih kami pakai dua tahun kemudian. Investasi terbaik untuk tim desain dan engineering kami.',
    name: 'Sari Andini',
    role: 'Head of Engineering, perusahaan SaaS',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t bg-background py-20 sm:py-24">
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
          Testimoni
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Kata mereka yang pernah bekerja sama
        </motion.h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <motion.figure
              key={testimonial.name}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border bg-card p-6"
            >
              <Quote className="size-6 text-primary" />
              <blockquote className="mt-4 flex-1 text-sm text-card-foreground">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t pt-4">
                <p className="font-display text-sm font-bold">{testimonial.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
