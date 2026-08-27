import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

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

type Work = {
  title: string
  category: string
  year: string
  description: string
  gradient: string
  tags: string[]
}

const WORKS: Work[] = [
  {
    title: 'Dasbor Analitik Keuangan',
    category: 'Aplikasi Web',
    year: '2025',
    description:
      'Desain ulang dasbor internal fintech: hierarki data lebih jelas, waktu analisis turun 40%.',
    gradient: 'from-primary/40 via-accent to-muted',
    tags: ['UI/UX', 'React', 'Design System'],
  },
  {
    title: 'Aplikasi Belajar Bahasa',
    category: 'Aplikasi Mobile',
    year: '2025',
    description:
      'Alur onboarding dan gamifikasi harian yang menaikkan retensi minggu pertama hingga 62%.',
    gradient: 'from-accent via-primary/25 to-secondary',
    tags: ['Riset', 'Prototipe', 'UI Mobile'],
  },
  {
    title: 'Situs Merek Kopi Lokal',
    category: 'Landing Page',
    year: '2024',
    description:
      'Identitas digital dan landing page e-commerce dengan skor Lighthouse 98 di perangkat seluler.',
    gradient: 'from-secondary via-muted to-primary/30',
    tags: ['Branding', 'Web', 'Animasi'],
  },
  {
    title: 'Platform Manajemen Acara',
    category: 'SaaS',
    year: '2024',
    description:
      'Sistem tiket dan check-in multi-acara — dari wireframe sampai frontend produksi.',
    gradient: 'from-muted via-accent to-primary/35',
    tags: ['Product Design', 'TypeScript', 'SaaS'],
  },
]

export function Works() {
  return (
    <section id="works" className="border-t bg-background py-20 sm:py-24">
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
          Karya Terpilih
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Proyek yang saya banggakan
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-xl text-muted-foreground">
          Sebagian pekerjaan terbaru — dari desain produk sampai implementasi
          frontend yang siap produksi.
        </motion.p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {WORKS.map((work) => (
            <motion.article key={work.title} variants={fadeUp} className="group">
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border bg-gradient-to-br ${work.gradient}`}
              >
                <span className="absolute top-4 left-4 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                  {work.category}
                </span>
                <span className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full border bg-background/70 backdrop-blur transition-transform group-hover:-translate-y-1">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-bold tracking-tight">
                  {work.title}
                </h3>
                <span className="text-sm text-muted-foreground">{work.year}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{work.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
