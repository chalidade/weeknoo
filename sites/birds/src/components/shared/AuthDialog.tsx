import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Modal } from './Modal'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

const PERKS = ['Unabridged member briefings', 'Executive PDF dossiers', 'Saved library across your visits']

export function AuthDialog() {
  const { authOpen, closeAuth, authReason, join, signIn } = useApp()
  const [mode, setMode] = useState<'join' | 'signin'>('join')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid work email.')
    setBusy(true)
    try {
      if (mode === 'join') {
        if (name.trim().length < 2) return setError('Please enter your full name.')
        await join(name, email)
      } else if (!(await signIn(email))) {
        setError('No membership found for this email on this device. Join free instead — it takes one click.')
        setMode('join')
      }
    } finally {
      setBusy(false)
    }
  }

  const input =
    'w-full border-0 border-b border-input bg-transparent px-0 py-2.5 text-[0.9375rem] text-navy placeholder:text-muted-foreground focus:border-royal focus:ring-0 focus:outline-none transition-colors'

  return (
    <Modal open={authOpen} onClose={closeAuth} label="Member access">
      <div className="border-t-4 border-royal px-7 pt-9 pb-8 sm:px-9">
        <p className="kicker">Birds Membership</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          {mode === 'join' ? 'Unlock full member access' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-deck">
          {authReason ?? 'Membership is 100% free. No payment, no card — instant access to every briefing.'}
        </p>

        {mode === 'join' && (
          <ul className="mt-5 space-y-1.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-navy">
                <Check className="size-4 text-royal" strokeWidth={2.5} /> {p}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'join' && (
            <label className="block">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Full name</span>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" autoFocus />
            </label>
          )}
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Work email</span>
            <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="name@company.com" autoFocus={mode === 'signin'} />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            disabled={busy}
            className="group mt-2 flex w-full items-center justify-center gap-2 bg-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-royal disabled:opacity-60"
          >
            {mode === 'join' ? 'Join free & unlock instantly' : 'Sign in'}
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-deck">
          {mode === 'join' ? 'Already a member?' : 'New to Birds?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'join' ? 'signin' : 'join')
              setError(null)
            }}
            className={cn('font-semibold text-royal underline-offset-4 hover:underline')}
          >
            {mode === 'join' ? 'Sign in' : 'Join free'}
          </button>
        </p>
        <p className="mt-4 text-center text-[0.6875rem] leading-relaxed text-muted-foreground">
          Your membership is stored privately on this device. We never ask for payment.
        </p>
      </div>
    </Modal>
  )
}
