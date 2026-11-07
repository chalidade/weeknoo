import type { Article } from '@/data/types'
import { Chart } from '@/components/charts/Chart'
import { formatDate } from '@/lib/format'
import { articleUrl } from '@/lib/router'

/**
 * Print-only executive dossier. Hidden on screen; the "Download PDF" button
 * calls window.print(), and the browser's "Save as PDF" produces an A4 file.
 */
export function PrintDossier({ article }: { article: Article }) {
  const people = [article.author, ...article.interviewedExperts]
  return (
    <div className="hidden bg-white text-[10.5pt] leading-[1.6] text-black print:block">
      <div className="flex items-end justify-between border-b-[3px] border-navy pb-3">
        <div>
          <p className="text-[20pt] leading-none font-semibold tracking-tight text-navy">
            Birds<span className="text-royal">.</span>
          </p>
          <p className="mt-1 text-[7pt] tracking-[0.18em] text-deck">BAUGMENT’S INSIGHTS, RESEARCH, AND DISCOVERIES</p>
        </div>
        <div className="text-right text-[7.5pt] text-deck">
          <p className="font-semibold tracking-[0.14em] text-royal uppercase">Executive Dossier</p>
          <p>{formatDate(article.publishedAt)}</p>
        </div>
      </div>

      <p className="mt-8 text-[8pt] font-semibold tracking-[0.14em] text-royal uppercase">
        {article.category}
        {article.series ? ` · ${article.series}` : ''}
      </p>
      <h1 className="mt-2 text-[24pt] leading-[1.15] font-semibold tracking-tight">{article.title}</h1>
      <p className="mt-3 text-[12pt] leading-snug text-deck">{article.subtitle}</p>
      <p className="mt-4 text-[8.5pt] text-deck">
        {article.author.fullName}, {article.author.title} · {article.readTime} · {article.accessType === 'member' ? 'Member Briefing' : 'Free Access'}
      </p>

      <div className="print-avoid mt-6 border-l-4 border-royal bg-muted px-5 py-4">
        <p className="text-[8pt] font-semibold tracking-[0.14em] text-royal uppercase">Executive key takeaways</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          {article.keyTakeaways.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>

      {article.contentSections.map((s, i) => (
        <section key={i} className="mt-6">
          {s.heading && <h2 className="mb-2 text-[14pt] font-semibold text-navy" style={{ breakAfter: 'avoid' }}>{s.heading}</h2>}
          {s.paragraphs.map((p, j) => (
            <p key={j} className="mt-2">
              {p}
            </p>
          ))}
          {s.chartIndex !== undefined && article.charts?.[s.chartIndex] && <Chart spec={article.charts[s.chartIndex]} exhibit={s.chartIndex + 1} staticRender />}
          {s.actionTable && (
            <table className="print-avoid mt-4 w-full border-collapse text-[8.5pt]">
              <thead>
                <tr className="border-b-2 border-navy text-left">
                  {s.actionTable.columns.map((c) => (
                    <th key={c} className="py-1.5 pr-2">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.actionTable.rows.map((r, k) => (
                  <tr key={k} className="border-b border-border">
                    {r.map((c, m) => (
                      <td key={m} className="py-1.5 pr-2 align-top">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {s.pullQuote && (
            <blockquote className="print-avoid my-5 border-y border-navy py-4 text-center text-[13pt] font-medium text-navy">
              “{s.pullQuote.text}”
              {s.pullQuote.author && <footer className="mt-2 text-[8.5pt] font-normal text-deck">— {s.pullQuote.author}{s.pullQuote.title ? `, ${s.pullQuote.title}` : ''}</footer>}
            </blockquote>
          )}
        </section>
      ))}

      <div className="print-avoid mt-10 border-t-2 border-navy pt-4">
        <p className="text-[8pt] font-semibold tracking-[0.14em] text-royal uppercase">Contributors</p>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-3 text-[8.5pt]">
          {people.map((p) => (
            <div key={p.fullName}>
              <p className="font-semibold">{p.fullName}</p>
              <p className="text-deck">
                {p.title}, {p.company}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8 border-t border-border pt-3 text-[7.5pt] text-deck">
        © Baugment · Birds — Baugment’s Insights, Research, and Discoveries · {articleUrl(article.id)}
      </p>
    </div>
  )
}
