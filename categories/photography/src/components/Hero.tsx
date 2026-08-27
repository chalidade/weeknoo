import { motion } from 'motion/react'
import { ArrowDown, Camera } from 'lucide-react'
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

type Frame = { label: string; className: string }

const FRAMES: Frame[] = [
  {
    label: 'Prosesi akad',
    className: 'aspect-[3/4] bg-gradient-to-br from-muted via-secondary to-accent',
  },
  {
    label: 'Potret pasangan',
    className:
      'aspect-[3/4] bg-gradient-to-tr from-accent via-muted to-primary/15 sm:mt-10',
  },
  {
    label: 'Detail resepsi',
    className: 'aspect-[3/4] bg-gradient-to-bl from-secondary via-accent to-muted',
  },
]

export function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_0%,theme(colors.primary/6%),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-6xl px-6 py-24 sm:py-32"
      >
        <motion.p
          variants={fadeUp}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
        >
          <Camera className="size-4" />
          Fotografer Wedding & Potret
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-display mt-6 max-w-4xl text-5xl font-light tracking-tight text-balance sm:text-7xl"
        >
          Cerita Anda, dalam cahaya yang <span className="italic">jujur</span>.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
        >
          Mendokumentasikan hari pernikahan dan potret keluarga dengan pendekatan
          candid — tanpa pose kaku, hanya momen yang benar-benar terjadi.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href="#gallery" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
            Lihat Galeri
            <ArrowDown className="transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="#contact"
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
          >
            Cek Ketersediaan Tanggal
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16 grid grid-cols-3 gap-3 sm:gap-6">
          {FRAMES.map((frame) => (
            <figure key={frame.label}>
              <div className={`w-full rounded-lg border ${frame.className}`} />
              <figcaption className="mt-3 text-xs tracking-widest text-muted-foreground uppercase">
                {frame.label}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
