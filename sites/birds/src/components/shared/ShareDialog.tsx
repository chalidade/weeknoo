import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Link2, Mail } from 'lucide-react'
import { Modal } from './Modal'
import { useApp } from '@/lib/app-context'
import { articleUrl } from '@/lib/router'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  )
}

export { LinkedInIcon }

export function ShareDialog() {
  const { shareArticle: a, closeShare, toast } = useApp()
  const [copied, setCopied] = useState(false)
  const url = a ? articleUrl(a.id) : ''
  const enc = encodeURIComponent

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const t = document.createElement('textarea')
      t.value = url
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    toast('Link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const targets = a
    ? [
        { label: 'LinkedIn', Icon: LinkedInIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
        { label: 'X / Twitter', Icon: XIcon, href: `https://twitter.com/intent/tweet?text=${enc(a.title + ' — via Birds')}&url=${enc(url)}` },
        {
          label: 'Email',
          Icon: Mail,
          href: `mailto:?subject=${enc('Birds briefing: ' + a.title)}&body=${enc(`${a.subtitle}\n\nRead the full briefing on Birds — Baugment’s Insights, Research, and Discoveries:\n${url}`)}`,
        },
      ]
    : []

  return (
    <Modal open={!!a} onClose={closeShare} label="Share this article">
      {a && (
        <div className="px-7 pt-9 pb-8 sm:px-9">
          <p className="kicker">Share this briefing</p>
          <h2 className="mt-3 line-clamp-2 pr-6 text-lg leading-snug font-semibold text-ink">{a.title}</h2>
          <div className="mt-6 flex items-stretch border border-input">
            <input readOnly value={url} className="min-w-0 flex-1 truncate bg-muted px-3 text-sm text-deck outline-none" onFocus={(e) => e.target.select()} />
            <button onClick={copy} className="flex w-28 items-center justify-center gap-1.5 bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-royal">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={String(copied)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-1.5">
                  {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {targets.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target={label === 'Email' ? undefined : '_blank'}
                rel="noreferrer"
                className="flex flex-col items-center gap-2 border border-border px-2 py-4 text-xs font-medium text-navy transition hover:border-royal hover:text-royal"
              >
                <Icon className="size-5" />
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
