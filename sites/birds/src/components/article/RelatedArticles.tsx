import { ARTICLES } from '@/data/articles'
import type { Article } from '@/data/types'
import { ArticleCard } from '@/components/home/ArticleCard'

export function RelatedArticles({ article }: { article: Article }) {
  const same = ARTICLES.filter((a) => a.id !== article.id && a.category === article.category)
  const rest = ARTICLES.filter((a) => a.id !== article.id && a.category !== article.category)
  const picks = [...same, ...rest].slice(0, 3)
  return (
    <section className="mt-16 bg-muted py-16" aria-label="Continue reading">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <h2 className="border-t-2 border-navy pt-4 text-2xl font-semibold tracking-tight text-ink">Continue reading</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {picks.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  )
}
