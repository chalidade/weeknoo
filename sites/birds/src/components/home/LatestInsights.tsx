import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ARTICLES, featuredArticle } from '@/data/articles'
import { SERIES } from '@/data/categories'
import type { Category } from '@/data/types'
import { cn } from '@/lib/utils'
import { ArticleCard, ArticleRow } from './ArticleCard'

export function LatestInsights() {
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const lead = featuredArticle()
  const pool = ARTICLES.filter((a) => a.id !== lead.id)
  const list = filter === 'all' ? pool : ARTICLES.filter((a) => a.category === filter)
  const [first, ...others] = list

  return (
    <section className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10" id="latest">
      <div className="flex flex-col gap-6 border-t-2 border-navy pt-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.025em] text-ink md:text-4xl">Latest insights</h2>
          <p className="mt-2 text-deck">Research and perspectives for leaders shaping the workforce of the future.</p>
        </div>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:justify-end lg:px-0" role="tablist" aria-label="Filter by series">
          {(['all', ...SERIES.map((s) => s.name)] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                'shrink-0 border px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition',
                filter === c ? 'border-navy bg-navy text-white' : 'border-border text-navy hover:border-royal hover:text-royal',
              )}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={filter} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-10">
          {first ? (
            <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr]">
              <ArticleCard article={first} size="lg" showDeck />
              <div>
                {others.slice(0, 4).map((a) => (
                  <ArticleRow key={a.id} article={a} />
                ))}
                {others.length === 0 && <p className="text-sm text-muted-foreground">More briefings in this series are on the way.</p>}
              </div>
            </div>
          ) : (
            <p className="text-deck">No briefings yet in this series.</p>
          )}
          {others.length > 4 && (
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {others.slice(4).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
