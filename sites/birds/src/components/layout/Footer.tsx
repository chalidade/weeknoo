import { SERIES } from '@/data/categories'
import { hrefFor } from '@/lib/router'

export function Footer() {
  return (
    <footer className="bg-navy text-white print:hidden">
      <div className="mx-auto max-w-[1320px] px-5 pt-16 pb-10 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="text-3xl font-semibold tracking-[-0.03em]">
              Birds<span className="text-royal">.</span>
            </p>
            <p className="tagline mt-2 text-white/60">Baugment’s Insights, Research, and Discoveries</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              Executive intelligence on workforce, leadership and capability across the GCC, Southeast Asia and global markets. No advertising. No clickbait.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {(['Workforce Intelligence', 'Human Leadership', 'Mind & Impact'] as const).map((g) => (
              <div key={g}>
                <p className="text-xs font-semibold tracking-[0.14em] text-sky uppercase">{g}</p>
                <ul className="mt-4 space-y-2.5">
                  {SERIES.filter((s) => s.group === g).map((s) => (
                    <li key={s.slug}>
                      <a href={hrefFor.series(s.slug)} className="text-sm text-white/80 transition hover:text-white">
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Baugment. All rights reserved.</p>
          <p>A Baugment publication · Sample content for demonstration</p>
        </div>
      </div>
    </footer>
  )
}
