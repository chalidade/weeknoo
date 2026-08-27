import { motion } from 'motion/react'
import { ArrowRight, BookOpen, Sparkles, Users } from 'lucide-react'
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

type Stat = { angka: string; label: string }

const STATS: Stat[] = [
  { angka: '2.400+', label: 'Alumni sejak 2015' },
  { angka: '35', label: 'Pengajar bersertifikat' },
  { angka: '92%', label: 'Lulus target belajar' },
]

export function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.primary/10%),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:py-28"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-accent-foreground"
          >
            <Sparkles className="size-4" />
            Pendaftaran semester ganjil dibuka
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Belajar Jadi Menyenangkan, Prestasi Jadi Kebiasaan
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
            Lembaga kursus dengan kelas kecil, pengajar berpengalaman, dan kurikulum
            terstruktur — dari matematika sekolah hingga coding dan bahasa asing.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pendaftaran"
              className={cn(buttonVariants({ size: 'lg' }), 'group rounded-full px-7 font-bold')}
            >
              Daftar Sekarang
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#program"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'rounded-full px-7 font-bold')}
            >
              Lihat Program
            </a>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                  {stat.angka}
                </dd>
                <dd className="mt-1 text-xs font-semibold text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div variants={fadeUp} className="relative">
          <div className="aspect-[4/3] rounded-3xl border bg-gradient-to-br from-primary/25 via-muted to-accent" />
          <div className="absolute -top-4 -right-2 rounded-2xl border bg-card px-4 py-3 shadow-xs sm:-right-4">
            <p className="inline-flex items-center gap-2 text-sm font-bold">
              <Users className="size-4 text-primary" /> Maks. 10 siswa/kelas
            </p>
          </div>
          <div className="absolute -bottom-4 -left-2 rounded-2xl border bg-card px-4 py-3 shadow-xs sm:-left-4">
            <p className="inline-flex items-center gap-2 text-sm font-bold">
              <BookOpen className="size-4 text-primary" /> Modul cetak &amp; digital
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
