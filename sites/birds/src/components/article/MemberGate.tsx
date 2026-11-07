import { motion } from 'motion/react'
import { ArrowRight, Download, FileText, Lock } from 'lucide-react'
import { useApp } from '@/lib/app-context'

export function MemberGate({ remaining }: { remaining: number }) {
  const { openAuth } = useApp()
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-background/0 to-background" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="my-6 border border-border border-t-4 border-t-royal bg-background px-6 py-9 text-center shadow-[0_24px_60px_-30px_rgba(0,15,52,0.35)] sm:px-12"
      >
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted text-royal">
          <Lock className="size-5" />
        </span>
        <p className="kicker mt-5">Member Briefing</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Unlock member access to keep reading</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-deck">
          {remaining} more {remaining === 1 ? 'section' : 'sections'}, every exhibit and the executive PDF are waiting. Membership is 100% free — instant one-step registration, no payment.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={() => openAuth()} className="group inline-flex items-center gap-2 bg-navy px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-royal">
            Join free & unlock <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
          <button onClick={() => openAuth()} className="px-4 py-3 text-sm font-semibold text-navy underline-offset-4 hover:text-royal hover:underline">
            I’m already a member
          </button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5" /> Full deep-dive analysis
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Download className="size-3.5" /> Executive PDF dossier
          </span>
        </div>
      </motion.div>
    </div>
  )
}
