import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

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
    <section id="mulai" className="relative isolate overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_100%,theme(colors.primary/15%),transparent)]"
      />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl"
        >
          Rapikan keuangan bisnismu mulai malam ini
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty"
        >
          Daftar dalam dua menit, impor data lamamu, dan lihat arus kas
          pertamamu tersusun otomatis. Gratis 14 hari.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href="#harga" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
            Mulai Uji Coba Gratis
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#faq"
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
          >
            Tanya Tim Sales
          </a>
        </motion.div>
        <motion.p variants={fadeUp} className="mt-4 text-xs text-muted-foreground">
          Tanpa kartu kredit · Data bisa diekspor kapan saja
        </motion.p>
      </motion.div>
    </section>
  )
}
