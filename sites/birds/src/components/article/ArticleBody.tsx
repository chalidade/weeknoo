import type { Article } from '@/data/types'
import { Chart } from '@/components/charts/Chart'
import { Media } from '@/components/Artwork'
import { ActionTable } from './ActionTable'
import { KeyTakeaways } from './KeyTakeaways'
import { MediaCarousel } from './MediaCarousel'
import { MemberGate } from './MemberGate'
import { PullQuote } from './PullQuote'

export const PREVIEW_SECTIONS = 2

export function ArticleBody({ article, unlocked }: { article: Article; unlocked: boolean }) {
  const sections = unlocked ? article.contentSections : article.contentSections.slice(0, PREVIEW_SECTIONS)
  const hidden = article.contentSections.length - sections.length

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 sm:px-8">
      <KeyTakeaways items={article.keyTakeaways} />
      <div className="prose-birds">
        {sections.map((s, si) => (
          <section key={si} className="mt-12 first:mt-0">
            {s.heading && <h2 className="mb-5 text-2xl leading-tight font-semibold tracking-[-0.02em] text-ink md:text-[1.75rem]">{s.heading}</h2>}
            {s.paragraphs.map((p, pi) => (
              <p key={pi} className={si === 0 && pi === 0 ? 'dropcap' : undefined}>
                {p}
              </p>
            ))}
            {s.chartIndex !== undefined && article.charts?.[s.chartIndex] && <Chart spec={article.charts[s.chartIndex]} exhibit={s.chartIndex + 1} />}
            {s.actionTable && <ActionTable {...s.actionTable} />}
            {s.figure && (
              <figure className="my-12 md:-mx-24 lg:-mx-40">
                <div className="aspect-[16/9] overflow-hidden bg-navy">
                  <Media src={s.figure.imageUrl} alt={s.figure.caption} />
                </div>
                <figcaption className="mt-3 px-5 text-sm text-deck md:px-0">
                  {s.figure.caption}
                  {s.figure.credit && <span className="text-muted-foreground"> · {s.figure.credit}</span>}
                </figcaption>
              </figure>
            )}
            {s.showCarousel && article.carouselItems && <MediaCarousel items={article.carouselItems} />}
            {s.pullQuote && <PullQuote {...s.pullQuote} />}
          </section>
        ))}
      </div>
      {hidden > 0 && <MemberGate remaining={hidden} />}
      {unlocked && (
        <div className="mt-16 flex items-center gap-4 text-xs tracking-[0.14em] text-muted-foreground uppercase">
          <span className="h-px flex-1 bg-border" />
          End of briefing
          <span className="h-px flex-1 bg-border" />
        </div>
      )}
    </div>
  )
}
