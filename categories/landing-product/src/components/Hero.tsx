import { motion } from 'motion/react'
import { ArrowRight, BatteryFull, Droplets, HeartPulse, Star } from 'lucide-react'
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

type HeroStat = { icon: typeof HeartPulse; label: string; value: string }

const STATS: HeroStat[] = [
  { icon: HeartPulse, label: 'Pemantauan jantung', value: '24/7' },
  { icon: BatteryFull, label: 'Daya tahan baterai', value: '14 hari' },
  { icon: Droplets, label: 'Tahan air', value: '5 ATM' },
]

export function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,theme(colors.primary/10%),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-2"
      >
        <div className="flex flex-col items-start text-left">
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs"
          >
            <Star className="size-3.5 fill-primary text-primary" />
            Dipercaya 50.000+ pengguna di Indonesia
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Pahami tubuhmu,{' '}
            <span className="text-primary">setiap detiknya</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
          >
            Gelang kesehatan pintar yang memantau detak jantung, kualitas tidur,
            dan aktivitas harianmu — lalu mengubahnya menjadi saran sederhana
            yang benar-benar bisa kamu lakukan.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#harga" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              Beli Sekarang — Rp649.000
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#fitur"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              Lihat Fitur
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid w-full grid-cols-3 gap-4 border-t pt-8"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <stat.icon className="size-5 text-primary" />
                <span className="font-display text-lg font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-muted to-accent" />
            <div className="absolute inset-8 rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                <HeartPulse className="size-10 text-primary" />
              </span>
              <span className="font-display text-3xl font-extrabold">72 bpm</span>
              <span className="text-sm text-muted-foreground">
                Detak jantung istirahat
              </span>
              <div className="mt-2 flex items-end gap-1" aria-hidden>
                {[8, 14, 10, 18, 12, 20, 9, 15, 11].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-primary/60"
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
