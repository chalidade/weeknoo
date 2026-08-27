import { motion } from 'motion/react'
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react'
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

export function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,theme(colors.primary/10%),transparent)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs"
          >
            <Star className="size-3.5 text-primary" />
            Sejak 1998 · Masakan Nusantara
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Cita rasa <span className="italic text-primary">Nusantara</span> di meja
            keluarga Anda
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
          >
            Resep turun-temurun tiga generasi — rendang yang dimasak delapan jam,
            sambal ulek dadakan, dan nasi hangat langsung dari tungku. Selamat
            datang di rumah makan kami.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#menu" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              Lihat Menu
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#reservasi"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              Reservasi Meja
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              Buka setiap hari · 10.00–22.00 WIB
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Jl. Kenanga No. 12, Jakarta Selatan
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <motion.div
            variants={fadeUp}
            className="aspect-[4/5] rounded-3xl border bg-gradient-to-br from-primary/30 via-accent to-muted shadow-lg"
          />
          <motion.div
            variants={fadeUp}
            className="absolute -bottom-6 left-6 hidden rounded-2xl border bg-card p-4 shadow-md sm:block"
          >
            <p className="font-display text-2xl font-bold text-primary">4,9/5</p>
            <p className="text-sm text-muted-foreground">2.400+ ulasan pelanggan</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
