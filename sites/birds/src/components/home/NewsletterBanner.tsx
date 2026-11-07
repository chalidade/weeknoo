import { ArrowRight, Check } from 'lucide-react'
import { Artwork } from '@/components/Artwork'
import { useApp } from '@/lib/app-context'
import { hrefFor } from '@/lib/router'

export function NewsletterBanner() {
  const { member, openAuth } = useApp()
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-60 md:block">
        <Artwork preset="waves" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/30" />
      <div className="relative mx-auto max-w-[1320px] px-5 py-20 lg:px-10">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Birds Membership</p>
          {member ? (
            <>
              <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.025em] md:text-4xl">You have full member access, {member.fullName.split(' ')[0]}.</h2>
              <p className="mt-4 text-white/75">Every member briefing, exhibit and executive PDF is unlocked on this device.</p>
              <a href={hrefFor.saved()} className="group mt-8 inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-royal hover:text-white">
                Open your saved library <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </a>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.025em] md:text-4xl">Executive intelligence, without the paywall.</h2>
              <p className="mt-4 text-white/75">Membership is free. Join in one step to unlock deep-dive briefings and downloadable executive dossiers.</p>
              <ul className="mt-6 space-y-2 text-sm text-white/85">
                {['Unabridged member briefings', 'Executive PDF dossiers', 'No payment, ever'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="size-4 text-sky" /> {t}
                  </li>
                ))}
              </ul>
              <button onClick={() => openAuth()} className="group mt-8 inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-royal hover:text-white">
                Join free <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
