import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Sparkles, Wallet } from 'lucide-react'
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

type MetricBar = { label: string; value: string; width: string }

const BARS: MetricBar[] = [
  { label: 'Faktur terbayar', value: 'Rp482 jt', width: '86%' },
  { label: 'Menunggu pembayaran', value: 'Rp96 jt', width: '42%' },
  { label: 'Jatuh tempo minggu ini', value: 'Rp24 jt', width: '18%' },
]

export function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_0%,theme(colors.primary/12%),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28"
      >
        <motion.div
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs"
        >
          <Sparkles className="size-3.5 text-primary" />
          Baru: rekonsiliasi bank otomatis
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="max-w-3xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl"
        >
          Arus kas bisnismu, rapi dalam <span className="text-primary">satu dasbor</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty"
        >
          Platform keuangan untuk bisnis kecil dan menengah: buat faktur dalam
          hitungan detik, tagih otomatis, dan pantau kas masuk-keluar tanpa
          spreadsheet lagi.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href="#mulai" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
            Coba Gratis 14 Hari
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#fitur"
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
          >
            Lihat Demo
          </a>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-4 text-xs text-muted-foreground">
          Tanpa kartu kredit · Batalkan kapan saja
        </motion.p>

        {/* dashboard mock */}
        <motion.div variants={fadeUp} className="mt-16 w-full max-w-4xl">
          <div className="rounded-xl border bg-card p-2 shadow-2xl">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="grid gap-4 rounded-lg bg-background p-6 sm:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col justify-between rounded-lg border bg-card p-5 text-left">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="size-4 text-primary" />
                  Saldo kas bulan ini
                </div>
                <div className="mt-4">
                  <p className="font-display text-3xl font-extrabold">Rp602 jt</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-primary">
                    <ArrowUpRight className="size-4" /> +18,4% dari bulan lalu
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 text-left">
                {BARS.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{bar.label}</span>
                      <span className="font-semibold text-foreground">{bar.value}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary/60 to-primary"
                        style={{ width: bar.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
