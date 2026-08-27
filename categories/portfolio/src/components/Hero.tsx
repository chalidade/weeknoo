import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
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

type Stat = { value: string; label: string }

const STATS: Stat[] = [
  { value: '7+', label: 'Tahun pengalaman' },
  { value: '40+', label: 'Proyek selesai' },
  { value: '25+', label: 'Klien puas' },
]

export function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.primary/15%),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-6xl flex-col items-start px-6 py-24 sm:py-32"
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-primary" />
          Terbuka untuk proyek freelance
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-display max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl"
        >
          Desainer produk & developer yang membangun{' '}
          <span className="text-primary">pengalaman digital</span>.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
        >
          Saya membantu startup dan brand merancang antarmuka yang rapi, cepat,
          dan menyenangkan dipakai — dari riset dan desain sampai kode produksi.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href="#works" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
            Lihat Karya
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
          >
            Hubungi Saya
            <ArrowUpRight />
          </a>
        </motion.div>

        <motion.dl
          variants={fadeUp}
          className="mt-16 grid w-full max-w-lg grid-cols-3 gap-6 border-t pt-8"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="font-display text-2xl font-bold sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  )
}
