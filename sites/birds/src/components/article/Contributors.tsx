import { ArrowUpRight } from 'lucide-react'
import type { Contributor } from '@/data/types'
import { Portrait } from '@/components/shared/Portrait'
import { LinkedInIcon } from '@/components/shared/ShareDialog'
import { cn } from '@/lib/utils'

function ContributorCard({ person, large }: { person: Contributor; large?: boolean }) {
  return (
    <article className={cn('print-avoid flex h-full flex-col', large ? 'gap-5 sm:flex-row sm:gap-7' : 'gap-4 border-t border-border pt-6')}>
      <Portrait name={person.fullName} photoUrl={person.photoUrl} className={large ? 'size-24 text-[3rem]' : 'size-16 text-[2.25rem]'} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className={cn('font-semibold text-ink', large ? 'text-xl' : 'text-base')}>{person.fullName}</p>
        <p className="mt-0.5 text-sm text-royal">
          {person.title}, {person.company}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-deck">{person.personalBio}</p>
        <div className="mt-3 bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-navy">About {person.company}. </span>
          {person.companyBio}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <a href={person.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-navy transition hover:text-royal">
            <LinkedInIcon className="size-4 text-[#0A66C2]" /> LinkedIn
          </a>
          <a href={person.companyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-navy transition hover:text-royal">
            {person.company} website <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </article>
  )
}

export function Contributors({ author, experts }: { author: Contributor; experts: Contributor[] }) {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-10 sm:px-8" aria-label="Contributors">
      <p className="mb-5 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Written by</p>
      <ContributorCard person={author} large />
      {experts.length > 0 && (
        <div className="mt-12">
          <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Featured experts interviewed</p>
          <div className={cn('grid gap-x-10 gap-y-8', experts.length > 1 && 'md:grid-cols-2')}>
            {experts.map((e) => (
              <ContributorCard key={e.fullName} person={e} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
