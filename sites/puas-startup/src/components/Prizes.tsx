import { motion, type Variants } from 'motion/react'
import { Crown, Star, Trophy } from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const TIERS = [
  {
    icon: Crown,
    rank: 'Peringkat 1 – 3',
    price: 'Free of Cost',
    note: 'Pendirian perusahaan + proses Iqama 2 orang tanpa biaya.',
    featured: true,
  },
  {
    icon: Star,
    rank: 'Peringkat 4 – 5',
    price: 'SAR 20,000',
    note: 'Paket pendirian perusahaan + proses Iqama 2 orang, cukup SAR 20,000 saja.',
    featured: false,
  },
]

export function Prizes() {
  return (
    <section id="hadiah" className="relative scroll-mt-24 py-20 sm:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="glass ring-gold relative overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14">
          <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,#000,transparent_70%)]" />
          <div className="absolute -top-32 -left-20 -z-10 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(251_180_74/0.22),transparent)] blur-2xl" />

          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div variants={fadeUp}>
              <p className="font-mono text-xs tracking-[0.25em] text-primary uppercase">Program Kompetisi Ide & Startup</p>
              <div className="mt-5 flex items-end gap-4">
                <Trophy className="size-16 text-gold-1 drop-shadow-[0_8px_30px_rgb(251_180_74/0.5)] sm:size-20" strokeWidth={1.5} />
                <span className="font-display text-gold text-8xl leading-none font-extrabold sm:text-9xl">10</span>
              </div>
              <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">Pemenang</h2>
              <p className="mt-2 inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                Dibagi dalam 2 gelombang
              </p>
              <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">
                Termasuk pendampingan pendirian perusahaan dan proses izin tinggal (Iqama) untuk 2 orang — Founder &
                Co-founder/Investor.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {TIERS.map((t) => (
                <motion.article
                  key={t.rank}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={
                    t.featured
                      ? 'bg-gold relative overflow-hidden rounded-3xl p-7 text-primary-foreground shadow-2xl shadow-gold-1/25'
                      : 'relative overflow-hidden rounded-3xl border border-border bg-background/60 p-7'
                  }
                >
                  {t.featured && (
                    <span className="absolute top-5 right-5 rounded-full bg-primary-foreground px-2.5 py-1 font-mono text-[10px] tracking-widest text-primary uppercase">
                      Terbaik
                    </span>
                  )}
                  <t.icon className={t.featured ? 'size-8' : 'size-8 text-primary'} />
                  <p className={`mt-8 text-sm font-medium ${t.featured ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                    {t.rank}
                  </p>
                  <p className="font-display mt-1 text-3xl font-bold tracking-tight">{t.price}</p>
                  <p className={`mt-4 text-sm leading-relaxed ${t.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {t.note}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
