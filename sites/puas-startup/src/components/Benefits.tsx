import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** A small company block: three buildings, the tallest in amber. */
function CompanyArt() {
  return (
    <svg viewBox="0 0 120 84" className="h-full w-auto" aria-hidden="true">
      <rect x="6" y="36" width="30" height="48" rx="4" className="fill-pine" />
      <rect x="42" y="6" width="38" height="78" rx="4" className="fill-amber" />
      <rect x="86" y="48" width="28" height="36" rx="4" className="fill-white" />
      <g className="fill-ink">
        <rect x="50" y="16" width="8" height="8" rx="1.5" />
        <rect x="64" y="16" width="8" height="8" rx="1.5" />
        <rect x="50" y="31" width="8" height="8" rx="1.5" />
        <rect x="64" y="31" width="8" height="8" rx="1.5" />
        <rect x="50" y="46" width="8" height="8" rx="1.5" />
        <rect x="64" y="46" width="8" height="8" rx="1.5" />
        <rect x="56" y="66" width="10" height="18" rx="2" />
        <rect x="92" y="56" width="6" height="6" rx="1.5" />
        <rect x="102" y="56" width="6" height="6" rx="1.5" />
        <rect x="92" y="68" width="6" height="6" rx="1.5" />
      </g>
      <g className="fill-amber">
        <rect x="13" y="45" width="6" height="6" rx="1.5" />
        <rect x="23" y="45" width="6" height="6" rx="1.5" />
        <rect x="13" y="58" width="6" height="6" rx="1.5" />
      </g>
    </svg>
  )
}

function Person({ className }: { className: string }) {
  return (
    <span className={cn('flex aspect-square h-full items-center justify-center rounded-full', className)}>
      <svg viewBox="0 0 24 24" className="size-[52%]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
      </svg>
    </span>
  )
}

/** The two people who receive an Iqama. */
function PeopleArt() {
  return (
    <div className="flex h-full">
      <Person className="bg-ink text-amber" />
      <Person className="-ml-3 bg-white text-ink ring-4 ring-amber" />
    </div>
  )
}

/** The three kinds of support, as labels. */
function SupportArt() {
  return (
    <div className="flex h-full flex-wrap content-start gap-1.5 text-[0.8125rem] leading-none font-bold lg:gap-2 lg:text-[0.9375rem]">
      <span className="rounded-full bg-emerald px-3 py-2 text-white">Legal</span>
      <span className="rounded-full bg-amber px-3 py-2 text-ink">Lisensi</span>
      <span className="rounded-full bg-mist px-3 py-2 text-ink">Operasional</span>
    </div>
  )
}

/** A business in the middle, linked to local partners. */
function NetworkArt() {
  return (
    <svg viewBox="0 0 120 84" className="h-full w-auto" aria-hidden="true">
      <g className="stroke-white/45" strokeWidth="2.5" strokeLinecap="round">
        <path d="M60 44 L18 16" />
        <path d="M60 44 L104 14" />
        <path d="M60 44 L98 72" />
        <path d="M60 44 L20 70" />
      </g>
      <circle cx="18" cy="16" r="9" className="fill-white" />
      <circle cx="104" cy="14" r="8" className="fill-pine stroke-white" strokeWidth="2.5" />
      <circle cx="98" cy="72" r="9" className="fill-white" />
      <circle cx="20" cy="70" r="7" className="fill-pine stroke-white" strokeWidth="2.5" />
      <circle cx="60" cy="44" r="15" className="fill-amber" />
    </svg>
  )
}

// The four things the poster promises, in its wording.
const BENEFITS: { title: string; note?: string; tone: string; noteTone?: string; art: ReactNode }[] = [
  { title: 'Dirikan perusahaan resmi di Saudi', tone: 'tile-ink', art: <CompanyArt /> },
  {
    title: 'Iqama (izin tinggal) untuk 2 orang',
    note: 'Founder & Co-founder (Investor)',
    tone: 'tile-amber',
    noteTone: 'text-ink/80',
    art: <PeopleArt />,
  },
  { title: 'Pendampingan legal, lisensi, & operasional', tone: 'tile-white', art: <SupportArt /> },
  { title: 'Akses ekosistem bisnis & partner lokal di Saudi', tone: 'tile-emerald', art: <NetworkArt /> },
]

export function Benefits() {
  return (
    <section id="program" className="@container wrap mt-2.5 scroll-mt-20 sm:mt-4" aria-label="Yang didapat">
      <ul className="bento">
        {BENEFITS.map((b) => (
          <li
            key={b.title}
            className={cn('tile half flex flex-col justify-between gap-5 lg:col-span-3 lg:min-h-[14.5rem]', b.tone)}
          >
            <div className="h-[4.25rem] lg:h-[5.25rem]">{b.art}</div>
            <div>
              <h2 className="h-tile text-balance">{b.title}</h2>
              {b.note && <p className={cn('mt-1.5 text-sm leading-snug font-medium', b.noteTone)}>{b.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
