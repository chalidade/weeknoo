import { motion } from 'motion/react'
import { ArrowUpRight, Smartphone } from 'lucide-react'

const ACTIONS = 'https://github.com/chalidade/weeknoo/actions'

const SITES = [
  {
    name: 'jaim',
    title: 'JAIM — Jaga Iman',
    description: 'Catat sholat harian, progres tilawah 30 juz, dan jadwal sholat sesuai lokasi.',
    url: 'https://chalidade.github.io/weeknoo/jaim/',
  },
  {
    name: 'chalidade-portfolio-sites',
    title: 'Portfolio',
    description: 'Portfolio pribadi — profil, pengalaman, proyek, dan kontak.',
    url: 'https://chalidade.github.io/weeknoo/chalidade-portfolio-sites/',
  },
  {
    name: 'motion-app',
    title: 'Motion App',
    description: 'Landing page app dengan animasi Motion.',
    url: 'https://chalidade.github.io/weeknoo/motion-app/',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function Sites() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl">
          Site yang sudah jadi
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-2 text-muted-foreground">
          Setiap push otomatis mem-build ulang web + APK-nya.
        </motion.p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SITES.map((site) => (
            <motion.a
              key={site.name}
              variants={fadeUp}
              href={site.url}
              className="group rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium">{site.title}</h3>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{site.description}</p>
              <p className="mt-4 font-mono text-xs text-muted-foreground/60">
                /{site.name}/
              </p>
            </motion.a>
          ))}
        </div>

        <motion.p variants={fadeUp} className="mt-6 text-sm text-muted-foreground">
          <Smartphone className="mr-1.5 inline size-3.5 align-[-2px]" />
          Versi APK Android tiap site bisa diunduh dari{' '}
          <a href={ACTIONS} className="underline underline-offset-4 hover:text-foreground">
            tab Actions
          </a>{' '}
          (artifact <span className="font-mono text-xs">&lt;site&gt;-apk</span>).
        </motion.p>
      </motion.div>
    </section>
  )
}
