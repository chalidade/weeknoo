import { motion } from 'motion/react'
import { ArrowRight, Phone } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

export function Cta() {
  return (
    <section id="kontak" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-accent px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          >
            Mulai Bersama Kami
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Siap membawa perusahaan Anda ke tahap pertumbuhan berikutnya?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-muted-foreground text-pretty"
          >
            Konsultasi awal tanpa biaya. Ceritakan tantangan bisnis Anda, dan tim
            kami akan menyusun rekomendasi pendekatan dalam 3 hari kerja.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a href="#beranda" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              Jadwalkan Konsultasi
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-primary" />
              (021) 5550 1234 — Senin–Jumat, 09.00–17.00 WIB
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
