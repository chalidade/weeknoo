import { motion } from 'motion/react'
import type { SeriesInfo } from '@/data/categories'
import { Artwork } from '@/components/Artwork'

const ART: Record<string, string> = {
  'workforce-intelligence': 'grid',
  'practitioners-perspective': 'columns',
  'leading-with-heart': 'dunes',
  'ld-around-the-world': 'orbits',
  'mind-in-motion': 'waves',
  'impact-generation': 'network',
  'competency-unlock': 'prism',
}

export function SeriesHeader({ series, count }: { series: SeriesInfo; count: number }) {
  return (
    <section className="border-b border-border bg-muted pt-[4.25rem]">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr] md:py-20 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="kicker">{series.group === series.name ? 'Series' : series.group}</p>
          <h1 className="mt-3 text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-ink md:text-6xl">{series.name}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-deck">{series.description}</p>
          <p className="mt-6 text-sm text-muted-foreground">
            {count} {count === 1 ? 'briefing' : 'briefings'}
          </p>
        </motion.div>
        <motion.div className="hidden aspect-[4/3] overflow-hidden md:block" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <Artwork preset={ART[series.slug] ?? 'waves'} />
        </motion.div>
      </div>
    </section>
  )
}
