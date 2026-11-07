import { Bookmark, BookmarkCheck, PlayCircle } from 'lucide-react'
import type { Article } from '@/data/types'
import { Media } from '@/components/Artwork'
import { AccessBadge } from '@/components/shared/AccessBadge'
import { useApp } from '@/lib/app-context'
import { formatDate } from '@/lib/format'
import { hrefFor } from '@/lib/router'
import { cn } from '@/lib/utils'

export function ArticleCard({ article: a, size = 'md', showDeck = false }: { article: Article; size?: 'md' | 'lg'; showDeck?: boolean }) {
  const { isSaved, toggleBookmark } = useApp()
  const saved = isSaved(a.id)
  return (
    <article className="group relative flex flex-col">
      <a href={hrefFor.article(a.id)} className="relative block aspect-[16/10] overflow-hidden bg-navy" aria-label={a.title}>
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <Media src={a.featuredImage} />
        </div>
        {a.heroType === 'video' && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-navy/80 px-2 py-1 text-[0.625rem] font-semibold tracking-wider text-white uppercase backdrop-blur">
            <PlayCircle className="size-3" /> Video
          </span>
        )}
        {/* interactive preview: first takeaway on hover */}
        <div className="absolute inset-0 hidden flex-col justify-end bg-navy/88 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          <p className="text-[0.625rem] font-semibold tracking-[0.14em] text-sky uppercase">Key takeaway</p>
          <p className={cn('mt-2 leading-snug text-white', size === 'lg' ? 'text-lg' : 'text-sm')}>{a.keyTakeaways[0]}</p>
        </div>
      </a>
      <div className="mt-4 flex items-center justify-between gap-3">
        <a href={hrefFor.article(a.id)} className="kicker hover:underline">
          {a.category}
        </a>
        <button
          onClick={() => toggleBookmark(a.id)}
          aria-label={saved ? 'Remove from saved' : 'Save article'}
          aria-pressed={saved}
          className="text-navy/60 transition hover:text-royal"
        >
          {saved ? <BookmarkCheck className="size-4 text-royal" /> : <Bookmark className="size-4" />}
        </button>
      </div>
      <a href={hrefFor.article(a.id)} className="mt-2">
        <h3 className={cn('leading-snug font-semibold tracking-[-0.015em] text-ink transition-colors group-hover:text-royal', size === 'lg' ? 'text-2xl md:text-[1.75rem]' : 'text-lg')}>
          <span className="link-underline">{a.title}</span>
        </h3>
      </a>
      {showDeck && <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-deck">{a.subtitle}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{formatDate(a.publishedAt)}</span>
        <span aria-hidden>·</span>
        <span>{a.readTime}</span>
        <AccessBadge type={a.accessType} className="ml-auto" />
      </div>
    </article>
  )
}

export function ArticleRow({ article: a }: { article: Article }) {
  return (
    <a href={hrefFor.article(a.id)} className="group grid grid-cols-[1fr_6.5rem] gap-5 border-t border-border py-5 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_8rem]">
      <div>
        <p className="kicker">{a.category}</p>
        <h3 className="mt-1.5 leading-snug font-semibold text-ink transition-colors group-hover:text-royal">{a.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{a.readTime}</span>
          <AccessBadge type={a.accessType} />
        </div>
      </div>
      <div className="aspect-[4/3] overflow-hidden bg-navy">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
          <Media src={a.featuredImage} />
        </div>
      </div>
    </a>
  )
}
