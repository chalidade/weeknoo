import { motion, type Variants } from 'motion/react'
import { Cpu, Globe2, Sprout } from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const WHO = [
  { icon: Sprout, title: 'Ide bisnis baru (startup)', body: 'Masih tahap ide atau MVP? Boleh. Tunjukkan masalah yang jelas dan solusi yang meyakinkan.' },
  { icon: Globe2, title: 'Ekspansi bisnis Indonesia ke Saudi', body: 'Bisnis yang sudah berjalan di Indonesia dan siap membuka pasar di Saudi Arabia.' },
  { icon: Cpu, title: 'Solusi teknologi, layanan & model bisnis', body: 'Inovasi yang relevan untuk kebutuhan pasar Saudi dan negara-negara GCC.' },
]

export function Eligibility() {
  return (
    <section id="peserta" className="relative scroll-mt-24 py-20 sm:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.25em] text-primary uppercase">
              Terbuka untuk
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Siapa yang <span className="text-gold">bisa ikut?</span>
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="max-w-sm text-muted-foreground">
            Founder Indonesia dengan ide atau bisnis yang punya peluang di Saudi Arabia & kawasan GCC.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {WHO.map((w) => (
            <motion.article
              key={w.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="glass group rounded-3xl p-7 transition-colors hover:border-primary/40"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:bg-gold group-hover:text-primary-foreground">
                <w.icon className="size-7" />
              </span>
              <h3 className="font-display mt-6 text-xl font-semibold">{w.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{w.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
