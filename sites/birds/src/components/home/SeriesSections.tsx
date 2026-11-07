import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { ARTICLES } from '@/data/articles'
import { SERIES } from '@/data/categories'
import { hrefFor } from '@/lib/router'
import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'

export function SeriesSections() {
  return (
    <section aria-label="Series" className="pb-8">
      {SERIES.map((s, i) => {
        const items = ARTICLES.filter((a) => a.category === s.name).slice(0, 3)
        return (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className={cn('py-16', i % 2 === 1 && 'bg-muted')}
          >
            <div className="mx-auto grid max-w-[1320px] gap-10 px-5 lg:grid-cols-[18rem_1fr] lg:px-10">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Series {String(i + 1).padStart(2, '0')} · {s.group}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">{s.name}</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-deck">{s.description}</p>
                <a href={hrefFor.series(s.slug)} className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-royal">
                  Explore the series <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </a>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
