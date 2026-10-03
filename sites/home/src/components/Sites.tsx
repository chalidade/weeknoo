import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Smartphone } from 'lucide-react'

const ACTIONS = 'https://github.com/chalidade/weeknoo/actions'

// Each card is a flat object (no nested braces) — scripts/delete-site.sh
// strips a card by matching `name: '<site>'` inside one brace pair.
const SITES = [
  {
    name: 'ask',
    title: 'ask — AI lokal',
    description:
      'Tanya AI yang jalan di komputermu sendiri lewat Ollama — gratis, tanpa internet, lengkap dengan proses berpikirnya. Perlu Ollama terpasang di perangkat yang membukanya.',
    url: 'https://chalidade.github.io/weeknoo/ask/',
    tag: 'AI',
    hue: 290,
  },
  {
    name: 'jaim',
    title: 'JAIM — Jaga Iman',
    description: 'Catat sholat harian, progres tilawah 30 juz, dan jadwal sholat sesuai lokasi.',
    url: 'https://chalidade.github.io/weeknoo/jaim/',
    tag: 'Ibadah',
    hue: 160,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Sites() {
  return (
    <section id="sites" className="mx-auto max-w-5xl scroll-mt-28 px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.p variants={fadeUp} className="font-mono text-xs tracking-widest text-primary uppercase">
          Galeri
        </motion.p>
        <motion.div variants={fadeUp} className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Site yang{' '}
            <span className="font-display font-normal tracking-normal italic">sudah jadi</span>
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Setiap push otomatis mem-build ulang web dan APK-nya.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {SITES.map((site) => (
            <motion.a
              key={site.name}
              variants={fadeUp}
              href={site.url}
              style={{ '--hue': site.hue } as CSSProperties}
              className="group relative overflow-hidden rounded-3xl border bg-card transition-colors hover:border-[oklch(0.75_0.15_var(--hue)/40%)]"
            >
              {/* Mini browser preview, tinted with the site's hue */}
              <div className="relative h-44 overflow-hidden border-b bg-[radial-gradient(120%_100%_at_0%_0%,oklch(0.55_0.17_var(--hue)/45%),transparent_60%)]">
                <div className="absolute top-6 left-6 right-[-2rem] bottom-[-2rem] rounded-tl-xl border bg-background/80 shadow-2xl transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:-translate-x-1">
                  <div className="flex items-center gap-1.5 border-b px-3 py-2">
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                      chalidade.github.io/weeknoo/{site.name}/
                    </span>
                  </div>
                  <div className="space-y-2.5 p-4">
                    <div className="h-3 w-2/5 rounded-full bg-[oklch(0.75_0.15_var(--hue))]" />
                    <div className="h-2 w-3/4 rounded-full bg-foreground/10" />
                    <div className="h-2 w-3/5 rounded-full bg-foreground/10" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-10 flex-1 rounded-lg bg-foreground/5" />
                      <div className="h-10 flex-1 rounded-lg bg-foreground/5" />
                      <div className="h-10 flex-1 rounded-lg bg-foreground/5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium">{site.title}</h3>
                    <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
                      {site.tag}
                    </span>
                  </div>
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{site.description}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.p variants={fadeUp} className="mt-8 text-sm text-muted-foreground">
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
