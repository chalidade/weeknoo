import { motion } from 'motion/react'
import { Clock, MessageCircle, Sparkles, Truck, WashingMachine } from 'lucide-react'
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_0%,theme(colors.primary/10%),transparent)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs"
          >
            <Sparkles className="size-3.5 text-primary" />
            Laundry kiloan & satuan sejak 2019
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Cucian bersih, wangi, rapi —{' '}
            <span className="italic text-primary">tanpa repot</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
          >
            Antar-jemput gratis untuk area sekitar 5 km, selesai dalam 24 jam,
            dan setiap cucian dikerjakan terpisah per pelanggan. Mulai dari{' '}
            <strong className="font-semibold text-foreground">Rp7.000/kg</strong>.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#kontak"
              className={cn(buttonVariants({ size: 'lg' }), 'rounded-full')}
            >
              <MessageCircle />
              Pesan via WhatsApp
            </a>
            <a
              href="#layanan"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'rounded-full',
              )}
            >
              Lihat Daftar Harga
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              Buka setiap hari 07.00–21.00
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Antar-jemput gratis
            </span>
          </motion.div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-primary/25 via-muted to-accent" />
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl bg-[radial-gradient(theme(colors.primary/15%)_1px,transparent_1px)] bg-[size:18px_18px]"
            />
            <div className="absolute inset-0 grid place-items-center">
              <WashingMachine className="size-24 text-primary/50" strokeWidth={1.25} />
            </div>
            <div className="absolute -top-4 right-6 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-md">
              Selesai 24 jam ✓
            </div>
            <div className="absolute -bottom-5 left-6 rounded-2xl border bg-card p-4 shadow-lg">
              <p className="font-display text-2xl font-semibold text-primary">
                1.200+
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                pelanggan tetap di lingkungan kami
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
