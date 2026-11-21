import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CalendarClock, Check, Copy, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  EMAIL,
  EMPTY_PITCH,
  QUESTIONS,
  mailtoUrl,
  pitchSubject,
  pitchText,
  waUrl,
  type Pitch,
} from '@/lib/contact'
import { phaseAt } from '@/lib/waves'
import { useNow } from '@/lib/useNow'
import { WhatsAppIcon } from '@/components/icons'

// Profile, the six questions, then review-and-send.
const STEPS = ['Profil', ...QUESTIONS.map((q) => q.short), 'Kirim']
const SEND = STEPS.length - 1

const PROFILE = [
  { key: 'startup', label: 'Nama startup atau ide', type: 'text', autoComplete: 'organization' },
  { key: 'founders', label: 'Nama founder dan co-founder atau investor', type: 'text', autoComplete: 'name' },
  { key: 'wa', label: 'Nomor WhatsApp', type: 'tel', autoComplete: 'tel' },
] as const

type Db = typeof import('@/lib/db')

export function Proposal() {
  const [pitch, setPitch] = useState<Pitch>(EMPTY_PITCH)
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<'none' | 'saved' | 'restored'>('none')
  const [copied, setCopied] = useState<'no' | 'yes' | 'manual'>('no')

  const section = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLPreElement>(null)
  const db = useRef<Promise<Db> | null>(null)
  const touched = useRef(false)
  const moved = useRef(false)

  const loadDb = () => (db.current ??= import('@/lib/db'))

  // The deadline shown beside the six points follows the current wave.
  const now = useNow()
  const deadline = {
    wave1: 'Deadline 25 Nov 2026',
    between: 'Gelombang 2: Jan – Feb 2027',
    wave2: 'Deadline Gelombang 2: Feb 2027',
    closed: 'Pendaftaran sudah ditutup',
  }[now === null ? 'wave1' : phaseAt(now)]

  // Restore a draft once the composer is near the viewport. The database is
  // loaded only then, so it never weighs on the first paint.
  useEffect(() => {
    const el = section.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        loadDb()
          .then((m) => m.db.drafts.get('pitch'))
          .then((d) => {
            if (!d || touched.current) return
            setPitch({
              startup: d.startup ?? '',
              founders: d.founders ?? '',
              wa: d.wa ?? '',
              answers: QUESTIONS.map((_, i) => d.answers?.[i] ?? ''),
            })
            setStep(Math.min(Math.max(d.step ?? 0, 0), SEND))
            setDraft('restored')
          })
          .catch(() => {}) // storage unavailable (private mode): the form still works
      },
      { rootMargin: '900px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Save shortly after the founder stops typing.
  useEffect(() => {
    if (!touched.current) return
    const id = setTimeout(() => {
      loadDb()
        .then((m) => m.db.drafts.put({ id: 'pitch', ...pitch, step, updatedAt: Date.now() }))
        .then(() => setDraft('saved'))
        .catch(() => {})
    }, 500)
    return () => clearTimeout(id)
  }, [pitch, step])

  // After moving between steps, put the cursor where the typing continues.
  useEffect(() => {
    if (!moved.current) return
    panel.current?.querySelector<HTMLElement>('[data-first]')?.focus()
  }, [step])

  const edit = (patch: Partial<Pitch>) => {
    touched.current = true
    setPitch((p) => ({ ...p, ...patch }))
  }
  const answer = (i: number, value: string) =>
    edit({ answers: pitch.answers.map((a, k) => (k === i ? value : a)) })
  const go = (n: number) => {
    moved.current = true
    setCopied('no')
    setStep(Math.min(Math.max(n, 0), SEND))
  }
  const reset = () => {
    touched.current = false
    setPitch(EMPTY_PITCH)
    setDraft('none')
    go(0)
    loadDb()
      .then((m) => m.db.drafts.delete('pitch'))
      .catch(() => {})
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (step < SEND) go(step + 1)
  }

  const done = (i: number) =>
    i === 0 ? pitch.startup.trim() !== '' : i < SEND ? pitch.answers[i - 1].trim() !== '' : false
  const missing = QUESTIONS.filter((_, i) => pitch.answers[i].trim() === '').map((q) => q.short)

  const text = pitchText(pitch)
  const mailto = mailtoUrl(pitchSubject(pitch), text)
  const whatsapp = waUrl(
    `Halo PUAS, saya mau ikut Program Kompetisi Ide & Startup lewat jalur Fast Track.\n\n${text}`,
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied('yes')
    } catch {
      // Clipboard blocked: select the text so the founder can copy it by hand.
      const range = document.createRange()
      if (preview.current) range.selectNodeContents(preview.current)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      setCopied('manual')
    }
  }

  const question = step > 0 && step < SEND ? QUESTIONS[step - 1] : null

  return (
    <section id="proposal" ref={section} className="wrap scroll-mt-20">
      <h2 className="h-group group-head">Kirim ide &amp; proposal</h2>
      <div className="bento">
        <div className="tile tile-emerald col-span-2 lg:col-span-5">
          <h3 className="h-tile text-balance">Format bebas, asalkan dalam waktu singkat menjawab:</h3>
          <ol className="mt-5 grid gap-2">
            {QUESTIONS.map((q, i) => (
              <li key={q.short} className="flex items-center gap-3 rounded-2xl bg-white/10 px-3.5 py-3 leading-snug font-semibold">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber text-sm font-extrabold text-ink">
                  {i + 1}
                </span>
                {q.label}
              </li>
            ))}
          </ol>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2 text-[0.9375rem] font-bold text-ink">
            <CalendarClock className="size-[1.125rem] shrink-0" aria-hidden="true" />
            {deadline}
          </p>
        </div>

        <div ref={panel} className="tile tile-white col-span-2 lg:col-span-7">
          <h3 className="h-tile">Tulis proposalmu di sini</h3>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">
            Isi satu per satu, lalu kirim dari email-mu sendiri. Sudah punya pitch deck? Kirim langsung ke{' '}
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(pitchSubject())}`}
              className="font-semibold text-ink underline underline-offset-4"
            >
              {EMAIL}
            </a>
            .
          </p>

          <ol className="mt-5 flex gap-1.5 sm:flex-wrap sm:gap-2" aria-label="Langkah proposal">
            {STEPS.map((s, i) => {
              const current = i === step
              const filled = done(i)
              return (
                <li key={s} className="min-w-0 flex-1 sm:flex-none">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={current ? 'step' : undefined}
                    aria-label={`${s}${filled ? ', sudah diisi' : ''}`}
                    className="block w-full rounded-full py-2 sm:py-0"
                  >
                    <span
                      className={cn(
                        'flex h-1.5 items-center justify-center gap-1.5 rounded-full text-sm font-semibold sm:h-9 sm:px-3.5',
                        current ? 'bg-emerald text-white' : filled ? 'bg-amber text-ink' : 'bg-mist text-muted-foreground',
                      )}
                    >
                      {filled && !current && <Check className="hidden size-3.5 sm:block" aria-hidden="true" />}
                      <span className="hidden sm:inline">{s}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <form onSubmit={onSubmit} className="mt-4 sm:mt-6">
            <div className="min-h-[20rem]">
              {step === 0 && (
                <>
                  <p className="text-sm font-semibold text-pine">Sebelum mulai</p>
                  <p className="h-tile mt-1">Kenalan dulu</p>
                  <div className="mt-4 grid gap-3.5">
                    {PROFILE.map((f, i) => (
                      <label key={f.key} className="block">
                        <span className="mb-1.5 block text-sm font-semibold">{f.label}</span>
                        <input
                          className="field"
                          type={f.type}
                          autoComplete={f.autoComplete}
                          value={pitch[f.key]}
                          onChange={(e) => edit({ [f.key]: e.target.value } as Partial<Pitch>)}
                          {...(i === 0 ? { 'data-first': '' } : {})}
                        />
                      </label>
                    ))}
                  </div>
                </>
              )}

              {question && (
                <>
                  <p className="text-sm font-semibold text-pine">
                    Pertanyaan {step} dari {QUESTIONS.length}
                  </p>
                  <label htmlFor="pitch-answer" className="h-tile mt-1 block text-balance">
                    {question.ask}
                  </label>
                  <p id="pitch-hint" className="mt-1.5 leading-relaxed text-muted-foreground">
                    {question.hint}
                  </p>
                  <textarea
                    key={step}
                    id="pitch-answer"
                    aria-describedby="pitch-hint"
                    className="field mt-3.5 min-h-44 resize-y leading-relaxed"
                    rows={6}
                    value={pitch.answers[step - 1]}
                    onChange={(e) => answer(step - 1, e.target.value)}
                    data-first=""
                  />
                </>
              )}

              {step === SEND && (
                <>
                  <p className="text-sm font-semibold text-pine">Terakhir</p>
                  <p className="h-tile mt-1" tabIndex={-1} data-first="">
                    Cek, lalu kirim
                  </p>
                  {missing.length > 0 && (
                    <p className="mt-3 rounded-2xl bg-sand px-4 py-3 text-[0.95rem] leading-relaxed">
                      Belum dijawab: {missing.join(', ')}. Kamu tetap bisa mengirim, tapi enam poin itu yang diminta
                      PUAS.
                    </p>
                  )}
                  <pre
                    ref={preview}
                    className="mt-3.5 max-h-60 overflow-auto rounded-2xl bg-mist p-4 font-sans text-[0.9rem] leading-relaxed break-words whitespace-pre-wrap"
                  >
                    {text}
                  </pre>
                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <a href={mailto} className="btn btn-amber px-4">
                      <Mail className="size-5 shrink-0" aria-hidden="true" />
                      Buka di email
                    </a>
                    <button type="button" onClick={copy} className="btn btn-line px-4">
                      {copied === 'yes' ? (
                        <Check className="size-5 shrink-0" aria-hidden="true" />
                      ) : (
                        <Copy className="size-5 shrink-0" aria-hidden="true" />
                      )}
                      {copied === 'yes' ? 'Tersalin' : 'Salin proposal'}
                    </button>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-line px-4">
                      <WhatsAppIcon className="size-5 shrink-0" />
                      Kirim ke WhatsApp
                    </a>
                  </div>
                  <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground" aria-live="polite">
                    {copied === 'manual'
                      ? 'Penyalinan otomatis tidak diizinkan browser. Teks proposal sudah diblok, salin dari sana.'
                      : `Tombol email membuka aplikasi email-mu dengan proposal ini sudah terisi untuk ${EMAIL}. Proposal baru terkirim setelah kamu menekan kirim di sana. Kalau lewat WhatsApp, jangan lupa kirim ke email juga.`}
                  </p>
                  {mailto.length > 1900 && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Proposalmu cukup panjang. Kalau isi email terpotong, pakai Salin proposal lalu tempel di email.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {draft === 'none' && 'Jawabanmu tidak dikirim ke server. Draf hanya disimpan di perangkat ini.'}
                {draft === 'restored' && 'Draf terakhirmu dipulihkan.'}
                {draft === 'saved' && 'Draf tersimpan di perangkat ini.'}
                {draft !== 'none' && (
                  <>
                    {' '}
                    <button type="button" onClick={reset} className="font-semibold text-ink underline underline-offset-4">
                      Mulai dari awal
                    </button>
                  </>
                )}
              </p>
              <div className="ml-auto flex gap-2.5">
                {step > 0 && (
                  <button type="button" onClick={() => go(step - 1)} className="btn btn-line h-12 px-5">
                    Kembali
                  </button>
                )}
                {step < SEND && (
                  <button type="submit" className="btn btn-ink h-12 px-6">
                    {step === SEND - 1 ? 'Cek proposal' : 'Lanjut'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
