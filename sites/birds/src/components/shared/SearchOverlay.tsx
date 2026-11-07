import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { ARTICLES } from '@/data/articles'
import { SERIES } from '@/data/categories'
import { useApp } from '@/lib/app-context'
import { hrefFor } from '@/lib/router'
import { AccessBadge } from './AccessBadge'

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useApp()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input, textarea, [contenteditable]')
      if (e.key === '/' && !typing) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50)
    else setQ('')
  }, [searchOpen])

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return []
    return ARTICLES.filter((a) => {
      const hay = [a.title, a.subtitle, a.category, a.series, a.author.fullName, ...a.interviewedExperts.map((e) => `${e.fullName} ${e.company}`), ...a.keyTakeaways]
        .join(' ')
        .toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }, [q])

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[65] overflow-y-auto bg-background print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:px-8 sm:pt-10">
            <div className="flex justify-end">
              <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="rounded-full p-2 text-navy transition hover:bg-muted">
                <X className="size-6" />
              </button>
            </div>
            <label className="mt-6 flex items-center gap-4 border-b-2 border-navy pb-3 focus-within:border-royal">
              <Search className="size-7 shrink-0 text-royal" strokeWidth={1.75} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search insights, experts, series…"
                className="w-full bg-transparent text-2xl font-medium tracking-tight text-navy placeholder:text-slate focus:outline-none sm:text-3xl"
              />
            </label>

            {!q && (
              <div className="mt-10">
                <p className="kicker text-muted-foreground">Browse series</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SERIES.map((s) => (
                    <a key={s.slug} href={hrefFor.series(s.slug)} onClick={() => setSearchOpen(false)} className="border border-border px-3.5 py-2 text-sm text-navy transition hover:border-royal hover:text-royal">
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {q && (
              <p className="mt-6 text-sm text-muted-foreground">
                {results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”
              </p>
            )}
            <ul className="mt-2 divide-y divide-border">
              {results.map((a) => (
                <li key={a.id}>
                  <a href={hrefFor.article(a.id)} onClick={() => setSearchOpen(false)} className="group flex items-start justify-between gap-6 py-5">
                    <div>
                      <p className="kicker">{a.category}</p>
                      <p className="mt-1.5 text-lg leading-snug font-semibold text-ink group-hover:text-royal">{a.title}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{a.author.fullName}</span>
                        <span>·</span>
                        <AccessBadge type={a.accessType} />
                      </div>
                    </div>
                    <ArrowUpRight className="mt-1 size-5 shrink-0 text-slate transition group-hover:text-royal" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
