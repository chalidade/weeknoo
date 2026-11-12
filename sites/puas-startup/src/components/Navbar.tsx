import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mailtoUrl } from '@/lib/contact'

const LINKS = [
  { href: '#program', label: 'Program' },
  { href: '#proposal', label: 'Isi Proposal' },
  { href: '#hadiah', label: 'Hadiah' },
  { href: '#jadwal', label: 'Jadwal' },
  { href: '#faq', label: 'FAQ' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5',
          scrolled ? 'glass shadow-2xl shadow-black/40' : 'border border-transparent',
        )}
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="PUAS — kembali ke atas">
          <img src={`${import.meta.env.BASE_URL}puas-mark.png`} alt="" className="size-9" />
          <span className="font-display text-lg font-bold tracking-wide">PUAS</span>
          <span className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[10px] tracking-widest text-primary uppercase sm:inline">
            Startup
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={mailtoUrl()}
            className="bg-gold hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-gold-1/20 transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Send className="size-4" /> Kirim Proposal
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border md:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href={mailtoUrl()}
              className="bg-gold mt-2 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-primary-foreground"
            >
              <Send className="size-4" /> Kirim Proposal
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
