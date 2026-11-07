import { motion } from 'motion/react'
import { Bookmark, BookmarkCheck, Download, Headphones, Share2, Square } from 'lucide-react'
import type { Article } from '@/data/types'
import { AccessBadge } from '@/components/shared/AccessBadge'
import { useApp } from '@/lib/app-context'
import { formatDate } from '@/lib/format'
import { hrefFor } from '@/lib/router'
import { seriesByName } from '@/data/categories'
import { useNarration } from './useNarration'
import { cn } from '@/lib/utils'

export function ArticleHeader({ article, unlocked, narrationText }: { article: Article; unlocked: boolean; narrationText: string }) {
  const { isSaved, toggleBookmark, openShare, openAuth, toast } = useApp()
  const narration = useNarration(narrationText)
  const saved = isSaved(article.id)
  const series = seriesByName(article.category)

  const downloadPdf = () => {
    if (!unlocked) {
      openAuth('The executive PDF dossier is a member benefit. Join free in one step — no payment needed.')
      return
    }
    const prev = document.title
    document.title = `Birds Executive Dossier — ${article.title}`
    toast('Preparing your executive PDF — choose “Save as PDF”')
    setTimeout(() => {
      window.print()
      document.title = prev
    }, 350)
  }

  const listen = () => {
    if (!narration.toggle()) toast('Audio narration is not supported in this browser')
  }

  const action =
    'inline-flex items-center gap-2 border border-border px-3.5 py-2.5 text-[0.8125rem] font-medium text-navy transition hover:border-royal hover:text-royal'

  return (
    <motion.header
      className="mx-auto max-w-3xl px-5 pt-12 sm:px-8 md:pt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <p className="kicker">
        <a href={hrefFor.series(series.slug)} className="hover:underline">
          {article.category}
        </a>
        {article.series && <span className="text-royal/80"> · {article.series}</span>}
      </p>
      <h1 className="mt-4 text-[2rem] leading-[1.12] font-semibold tracking-[-0.025em] text-ink sm:text-[2.5rem] md:text-[3rem]">{article.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-deck md:text-xl">{article.subtitle}</p>

      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="font-medium text-navy">{article.author.fullName}</span>
        <span aria-hidden>·</span>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{article.readTime}</span>
        <AccessBadge type={article.accessType} className="ml-auto" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-y border-border py-4">
        <button onClick={listen} className={cn(action, narration.speaking && 'border-royal bg-royal text-white hover:text-white')} aria-pressed={narration.speaking}>
          {narration.speaking ? <Square className="size-3.5" fill="currentColor" /> : <Headphones className="size-4" />}
          {narration.speaking ? 'Stop' : 'Listen'}
        </button>
        <button onClick={() => toggleBookmark(article.id)} className={cn(action, saved && 'border-navy')} aria-pressed={saved}>
          {saved ? <BookmarkCheck className="size-4 text-royal" /> : <Bookmark className="size-4" />}
          {saved ? 'Saved' : 'Save'}
        </button>
        <button onClick={() => openShare(article)} className={action}>
          <Share2 className="size-4" /> Share
        </button>
        <button onClick={downloadPdf} className={cn(action, 'border-navy bg-navy text-white hover:border-royal hover:bg-royal hover:text-white sm:ml-auto')}>
          <Download className="size-4" /> Download PDF
        </button>
      </div>
    </motion.header>
  )
}
