import { motion } from 'motion/react'
import { ArrowRight, Building2, ShieldCheck, TrendingUp } from 'lucide-react'
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

export function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_20%_0%,theme(colors.primary/10%),transparent)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 sm:py-32 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          >
            Mitra Pertumbuhan Bisnis Nasional
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Solusi korporat terintegrasi untuk perusahaan yang terus bertumbuh
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
          >
            Sejak 2008 kami mendampingi perusahaan di seluruh Indonesia — dari
            konsultansi manajemen hingga transformasi digital — dengan standar
            layanan yang terukur dan akuntabel.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#kontak" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              Jadwalkan Konsultasi
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#layanan"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              Lihat Layanan
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Tersertifikasi ISO 9001
            </span>
            <span className="inline-flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              250+ klien korporat aktif
            </span>
          </motion.div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl border bg-gradient-to-br from-primary/20 via-muted to-accent" />
            <div className="absolute inset-0 grid place-items-center">
              <Building2 className="size-24 text-primary/40" strokeWidth={1.25} />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-xl border bg-card p-5 shadow-lg">
              <p className="font-display text-3xl font-semibold text-primary">18+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tahun pengalaman industri
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
