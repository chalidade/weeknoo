import { ARTICLES } from '@/data/articles'
import { seriesBySlug } from '@/data/categories'
import { ArticleCard } from './ArticleCard'
import { LatestInsights } from './LatestInsights'
import { MarqueeHero } from './MarqueeHero'
import { NewsletterBanner } from './NewsletterBanner'
import { SeriesHeader } from './SeriesHeader'
import { SeriesSections } from './SeriesSections'

export function HomeView({ series: slug }: { series?: string }) {
  const series = slug ? seriesBySlug(slug) : undefined

  if (series) {
    const items = ARTICLES.filter((a) => a.category === series.name)
    return (
      <>
        <SeriesHeader series={series} count={items.length} />
        <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10">
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {items.map((a, i) => (
              <ArticleCard key={a.id} article={a} size={i === 0 ? 'lg' : 'md'} showDeck />
            ))}
          </div>
        </section>
        <NewsletterBanner />
      </>
    )
  }

  return (
    <>
      <MarqueeHero />
      <LatestInsights />
      <NewsletterBanner />
      <div className="pt-8">
        <SeriesSections />
      </div>
    </>
  )
}
