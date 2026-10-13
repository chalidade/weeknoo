import { motion } from 'motion/react'
import { ArrowRight, Clock, Flame, ShieldCheck, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const STATS = [
  { value: 'Rp 10rb', label: 'mulai dari' },
  { value: '< 3 mnt', label: 'saji di gerai' },
  { value: '100%', label: 'halal' },
]

export function Hero() {
  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_85%_20%,color-mix(in_oklch,var(--color-accent)_35%,transparent),transparent_70%),radial-gradient(50%_50%_at_0%_100%,color-mix(in_oklch,var(--color-primary)_12%,transparent),transparent_70%)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-bold text-primary"
          >
            <Flame className="size-3.5" /> Dimasak langsung di atas bara
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-5 font-display text-5xl leading-[1.02] font-black tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Sarapan hangat dari <span className="text-primary">claypot</span>, harum sampai suapan terakhir.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            Bubur bakar berkerak gurih dengan kuah laksa, semur, atau kuah kuning — plus wonton chili oil dan
            dim sum. Pesan dari sini, bayar QRIS, tinggal ambil di gerai.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a href="#menu" className={cn(buttonVariants({ size: 'lg' }), 'h-12 rounded-xl px-6 text-base font-bold')}>
              Pesan Sekarang <ArrowRight className="size-4" />
            </a>
            <a
              href="#outlet"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'h-12 rounded-xl px-6 text-base font-bold')}
            >
              Cari Gerai Terdekat
            </a>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl font-extrabold">{s.value}</dd>
                <dd className="text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          {/* The claypot, drawn in CSS: rim, bowl, porridge and toppings */}
          <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-primary via-primary/90 to-foreground/80 shadow-2xl" />
          <div className="absolute inset-[14%] rounded-full bg-gradient-to-br from-foreground/70 to-foreground/90" />
          <div className="absolute inset-[18%] overflow-hidden rounded-full bg-[radial-gradient(circle_at_40%_35%,var(--color-card),var(--color-secondary)_55%,var(--color-accent)_100%)]">
            <span className="absolute top-[22%] left-[30%] size-10 rounded-full bg-accent shadow-inner" />
            <span className="absolute top-[48%] left-[55%] size-14 rounded-full bg-card shadow-md">
              <span className="absolute inset-3 rounded-full bg-accent" />
            </span>
            <span className="absolute top-[60%] left-[22%] h-5 w-12 -rotate-12 rounded-full bg-primary/70" />
            <span className="absolute top-[30%] left-[62%] h-4 w-10 rotate-12 rounded-full bg-primary/60" />
            <span className="absolute top-[70%] left-[48%] size-3 rounded-full bg-[oklch(0.6_0.15_140)]" />
            <span className="absolute top-[40%] left-[20%] size-2.5 rounded-full bg-[oklch(0.6_0.15_140)]" />
            <span className="absolute top-[18%] left-[50%] size-2 rounded-full bg-[oklch(0.6_0.15_140)]" />
          </div>
          {/* steam */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute top-0 h-16 w-3 rounded-full bg-muted-foreground/20 blur-md"
              style={{ left: `${38 + i * 12}%` }}
              animate={{ y: [-4, -28], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}

          <div className="absolute -left-2 bottom-10 flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 shadow-lg sm:-left-6">
            <Star className="size-4 fill-accent text-accent" />
            <div className="text-xs">
              <p className="font-bold">4,9 / 5</p>
              <p className="text-muted-foreground">dari 1.200+ ulasan</p>
            </div>
          </div>
          <div className="absolute -right-2 top-12 flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 shadow-lg sm:-right-4">
            <Clock className="size-4 text-primary" />
            <p className="text-xs font-bold">Buka 05.30 WIB</p>
          </div>
          <div className="absolute right-6 bottom-2 flex items-center gap-2 rounded-2xl bg-primary px-3 py-2 text-primary-foreground shadow-lg">
            <ShieldCheck className="size-4" />
            <p className="text-xs font-bold">Halal & tanpa MSG berlebih</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
