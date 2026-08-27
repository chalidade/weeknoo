import { motion } from 'motion/react'
import { ArrowRight, MapPin } from 'lucide-react'
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
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=2000&q=80"
        alt="Suasana hangat Kopi Senja saat senja hari"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/10"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-4xl px-6 pb-20 pt-40 text-center sm:pb-28"
      >
        <motion.span
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm"
        >
          <MapPin className="size-3.5" />
          Bandung, buka tiap hari
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl font-medium text-balance text-white sm:text-7xl"
        >
          Kopi Senja
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-lg text-white/85 text-pretty"
        >
          Secangkir kopi, cahaya senja, dan tempat duduk favoritmu. Kopi Senja
          adalah rumah kedua untuk ngobrol santai atau sekadar menyendiri.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href="#menu" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
            Lihat Menu
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#lokasi"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white',
            )}
          >
            Jam Buka &amp; Lokasi
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
