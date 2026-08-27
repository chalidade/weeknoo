import { motion } from 'motion/react'
import { ChefHat } from 'lucide-react'

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

type Stat = { value: string; label: string }

const STATS: Stat[] = [
  { value: '25+', label: 'Tahun melayani' },
  { value: '40', label: 'Menu Nusantara' },
  { value: '3', label: 'Generasi juru masak' },
]

export function Story() {
  return (
    <section id="cerita" className="border-t bg-muted/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="relative order-last lg:order-first">
          <div className="aspect-[4/3] rounded-3xl border bg-gradient-to-tr from-accent via-muted to-primary/25 shadow-md" />
          <div className="absolute -top-5 right-6 flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
            <ChefHat className="size-4 text-primary" />
            Dapur terbuka sejak 1998
          </div>
        </motion.div>

        <div>
          <motion.p
            variants={fadeUp}
            className="text-sm font-medium tracking-widest text-primary uppercase"
          >
            Cerita Kami
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Berawal dari dapur kecil di rumah nenek
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-muted-foreground text-pretty">
            Tahun 1998, nenek kami membuka warung sederhana berbekal lima resep
            keluarga. Kini generasi ketiga meneruskan dapur yang sama: bumbu tetap
            diulek tangan, santan diperas pagi hari, dan setiap gulai dicicipi
            sebelum sampai ke meja Anda.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-pretty">
            Bagi kami, makan bersama adalah cara keluarga Indonesia merawat
            silaturahmi — dan kami bangga menjadi bagian dari meja makan Anda.
          </motion.p>

          <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-card p-4 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-3xl font-bold text-primary">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  )
}
