import { motion } from 'motion/react'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Dinda Ayu',
    role: 'Pelanggan tetap',
    quote:
      'Kopi susu gula arennya juara, dan tempat duduk outdoor-nya paling enak dipakai nongkrong pas senja.',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Rafi Pratama',
    role: 'Pekerja lepas',
    quote:
      'Wifi kenceng, colokan banyak, kopinya konsisten enak. Jadi kantor kedua saya tiap minggu.',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sarah Kusuma',
    role: 'Food blogger',
    quote:
      'Croissant-nya selalu fresh, staff-nya ramah banget. Suasananya bikin betah lama-lama.',
    avatar:
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=200&q=80',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function Testimonials() {
  return (
    <section className="bg-secondary/40 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-xl text-center">
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            Testimoni
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl">
            Kata mereka soal Kopi Senja
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border bg-card p-6"
            >
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm text-foreground/90 text-pretty">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
