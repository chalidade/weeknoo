import { motion } from 'motion/react'
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react'
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
    <section id="pesan" className="py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,theme(colors.primary-foreground/15%),transparent)]"
          />
          <motion.h2
            variants={fadeUp}
            className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance text-primary-foreground sm:text-4xl"
          >
            Mulai kebiasaan sehatmu hari ini
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-primary-foreground/80 text-pretty"
          >
            Stok terbatas untuk batch bulan ini. Pesan sekarang dan rasakan
            bedanya dalam 14 hari — atau uangmu kembali.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="#harga"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'secondary' }),
                'group',
              )}
            >
              Pesan Sekarang
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-primary-foreground/80 sm:flex-row sm:gap-8"
          >
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4" /> Gratis ongkir se-Indonesia
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4" /> Garansi uang kembali 14 hari
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
