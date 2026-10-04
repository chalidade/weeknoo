import { motion } from 'motion/react'
import { ArrowUpRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { CAFE } from '@/lib/cafe'

// Hal yang paling sering disebut di ulasan & liputan tentang Ha.Chi.Li.
const HIGHLIGHTS = [
  { title: 'Tempatnya cozy', desc: 'Suasana nyaman, cocok untuk kerja maupun santai lama.' },
  { title: 'Outdoor lapang', desc: 'Area luar luas dengan pilihan bean bag atau kursi.' },
  { title: 'Menunya banyak', desc: 'Dari kopi, mocktail, milkshake sampai makanan berat.' },
  { title: 'Harga bersahabat', desc: 'Mulai Rp10 ribu — affordable untuk kantong pelajar.' },
  { title: 'Konsep unik', desc: 'Tema rumah lebah yang beda dari cafe lain di Singosari.' },
  { title: 'Ramah keluarga', desc: 'Ada mini playground untuk si kecil.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Ulasan() {
  const full = Math.floor(CAFE.rating)
  return (
    <section id="ulasan" className="scroll-mt-16 bg-secondary/60 py-24 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[22rem_1fr]"
      >
        <motion.div
          variants={fadeUp}
          className="relative flex flex-col overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground"
        >
          <div aria-hidden className="honeycomb absolute inset-0 text-primary-foreground/10" />
          <p className="relative text-sm font-semibold tracking-[0.2em] uppercase opacity-80">Rating Google</p>
          <p className="relative mt-4 font-display text-8xl leading-none font-extrabold">{CAFE.rating}</p>
          <div className="relative mt-3 flex gap-1" aria-label={`${CAFE.rating} dari 5 bintang`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn('size-6', i < full ? 'fill-current' : 'fill-current opacity-40')}
              />
            ))}
          </div>
          <p className="relative mt-4 opacity-90">
            dari <b>{CAFE.reviews}</b> ulasan pengunjung di Google Maps.
          </p>
          <a
            href={CAFE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'relative mt-8 self-start rounded-full',
            )}
          >
            Baca ulasan
            <ArrowUpRight />
          </a>
        </motion.div>

        <div>
          <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            Kata Pengunjung
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 max-w-xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Alasan orang balik lagi ke sarang
          </motion.h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div key={h.title} variants={fadeUp} className="flex gap-4 rounded-2xl border bg-card p-5">
                <span className="font-display text-3xl font-extrabold text-primary/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{h.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
