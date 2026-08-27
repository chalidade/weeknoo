import { motion } from 'motion/react'
import { ArrowRight, CalendarDays, Clock3, PenLine } from 'lucide-react'
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.primary/8%),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:py-28"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="mb-4 text-xs font-medium tracking-[0.2em] text-primary uppercase"
          >
            Tulisan Unggulan · Edisi Minggu Ini
          </motion.p>

          <motion.div variants={fadeUp} className="mb-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Teknologi &amp; Budaya
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="size-3.5" /> 24 Agustus 2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock3 className="size-3.5" /> 12 menit baca
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Ketika Warung Kopi Menjadi Ruang Kerja: Budaya Digital di Kota Kecil
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
            Dari Salatiga hingga Bukittinggi, generasi pekerja jarak jauh mengubah wajah
            warung kopi — dan bersamanya, cara kita memaknai ruang publik, komunitas,
            dan pekerjaan itu sendiri.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#artikel" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              Baca Selengkapnya
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <PenLine className="size-4 text-primary" />
              Oleh Redaksi __SITE_NAME__
            </span>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="relative">
          <div className="aspect-[4/3] rounded-xl border bg-gradient-to-br from-primary/25 via-muted to-accent" />
          <div className="absolute -bottom-4 -left-4 hidden rounded-lg border bg-card px-4 py-3 shadow-xs sm:block">
            <p className="font-display text-lg font-medium">Esai · Longform</p>
            <p className="text-xs text-muted-foreground">Seri Kota &amp; Teknologi #4</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
