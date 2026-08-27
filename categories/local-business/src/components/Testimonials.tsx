import { motion } from 'motion/react'
import { Star } from 'lucide-react'

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

type Testimonial = { quote: string; name: string; role: string }

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Langganan sejak anak kedua lahir. Baju bayi dicuci terpisah pakai deterjen khusus, wanginya lembut. Penjemputan juga selalu tepat waktu.',
    name: 'Bu Ratna',
    role: 'Pelanggan antar-jemput, 2 tahun',
  },
  {
    quote:
      'Jas kerja dan batik kantor saya percayakan ke sini. Dry cleaning-nya rapi, kancing tidak pernah lepas, dan selesai sesuai janji.',
    name: 'Pak Dimas',
    role: 'Pelanggan dry cleaning',
  },
  {
    quote:
      'Paling suka layanan express-nya. Pagi kirim seragam, sore sudah wangi dan licin. Penyelamat anak kos seperti saya.',
    name: 'Mbak Ayu',
    role: 'Pelanggan kiloan express',
  },
]

export function Testimonials() {
  return (
    <section id="testimoni" className="bg-background">
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
            Testimoni
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Kata tetangga tentang kami
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-6 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.figure
              key={testimonial.name}
              variants={fadeUp}
              className="flex flex-col rounded-3xl border bg-card p-7"
            >
              <div className="flex gap-1" aria-label="Rating 5 dari 5 bintang">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t pt-4">
                <p className="font-display font-semibold">{testimonial.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
