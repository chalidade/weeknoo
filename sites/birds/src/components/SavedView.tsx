import { Bookmark } from 'lucide-react'
import { ARTICLES } from '@/data/articles'
import { useApp } from '@/lib/app-context'
import { hrefFor } from '@/lib/router'
import { ArticleCard } from './home/ArticleCard'

export function SavedView() {
  const { bookmarks } = useApp()
  const items = bookmarks.map((id) => ARTICLES.find((a) => a.id === id)).filter((a) => !!a)
  return (
    <section className="mx-auto min-h-[70vh] max-w-[1320px] px-5 pt-32 pb-24 lg:px-10">
      <p className="kicker">Your library</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Saved briefings</h1>
      <p className="mt-3 text-deck">
        {items.length} saved {items.length === 1 ? 'article' : 'articles'} · stored on this device
      </p>
      {items.length === 0 ? (
        <div className="mt-14 border border-dashed border-input px-6 py-16 text-center">
          <Bookmark className="mx-auto size-8 text-slate" />
          <p className="mt-4 font-semibold text-ink">Nothing saved yet</p>
          <p className="mt-1 text-sm text-deck">Use the bookmark icon on any briefing to keep it here.</p>
          <a href={hrefFor.home()} className="mt-6 inline-block text-sm font-semibold text-royal hover:underline">
            Browse latest insights
          </a>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {items.map((a) => (
            <ArticleCard key={a.id} article={a} showDeck />
          ))}
        </div>
      )}
    </section>
  )
}
