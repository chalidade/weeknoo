import { useEffect, useMemo } from 'react'
import { articleById } from '@/data/articles'
import { useApp } from '@/lib/app-context'
import { hrefFor } from '@/lib/router'
import { ArticleBody, PREVIEW_SECTIONS } from './ArticleBody'
import { ArticleHeader } from './ArticleHeader'
import { ArticleHero } from './ArticleHero'
import { Contributors } from './Contributors'
import { PrintDossier } from './PrintDossier'
import { ReadingProgress } from './ReadingProgress'
import { RelatedArticles } from './RelatedArticles'

export function ArticleView({ id }: { id: string }) {
  const article = articleById(id)
  const { member } = useApp()
  const unlocked = article?.accessType === 'free' || !!member

  useEffect(() => {
    if (article) document.title = `${article.title} — Birds`
    return () => {
      document.title = 'Birds — Baugment’s Insights, Research, and Discoveries'
    }
  }, [article])

  const narration = useMemo(() => {
    if (!article) return ''
    const secs = unlocked ? article.contentSections : article.contentSections.slice(0, PREVIEW_SECTIONS)
    return [article.title, article.subtitle, ...secs.flatMap((s) => [s.heading ?? '', ...s.paragraphs])].filter(Boolean).join('. ')
  }, [article, unlocked])

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-40 pb-32 text-center">
        <p className="kicker">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">This briefing could not be found</h1>
        <a href={hrefFor.home()} className="mt-6 inline-block font-semibold text-royal hover:underline">
          Return to Birds
        </a>
      </div>
    )
  }

  return (
    <>
      <ReadingProgress />
      <article className="print:hidden">
        <ArticleHero article={article} />
        <ArticleHeader article={article} unlocked={unlocked} narrationText={narration} />
        <Contributors author={article.author} experts={article.interviewedExperts} />
        <ArticleBody article={article} unlocked={unlocked} />
      </article>
      <div className="print:hidden">
        <RelatedArticles article={article} />
      </div>
      {unlocked && <PrintDossier article={article} />}
    </>
  )
}
