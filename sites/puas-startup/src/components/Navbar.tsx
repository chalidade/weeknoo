import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { waUrl } from '@/lib/contact'

const LINKS = [
  { href: '#program', label: 'Program' },
  { href: '#hadiah', label: 'Hadiah' },
  { href: '#jadwal', label: 'Jadwal' },
  { href: '#proposal', label: 'Proposal' },
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
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors',
        (scrolled || open) && 'bg-mist/90 backdrop-blur-md',
      )}
    >
      <div className="wrap">
        <nav className="flex h-[4.125rem] items-center justify-between gap-3 px-2 sm:px-3" aria-label="Utama">
          <a href="#top" className="flex shrink-0 items-center" aria-label="PUAS Startup, kembali ke atas">
            <img
              src={`${import.meta.env.BASE_URL}puas-logo.webp`}
              alt="PUAS"
              width={257}
              height={88}
              className="h-[2.1rem] w-auto"
            />
          </a>

          <ul className="hidden items-center gap-8 text-[0.95rem] font-medium md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="underline-offset-8 hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#proposal" className="btn btn-sm btn-ink">
              <span className="min-[24rem]:hidden">Daftar</span>
              <span className="hidden min-[24rem]:inline">Kirim proposal</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex size-[2.625rem] items-center justify-center rounded-full bg-white md:hidden"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={open}
              aria-controls="menu-mobile"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <ul id="menu-mobile" className="mb-2.5 rounded-[1.625rem] bg-white p-2 md:hidden">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3.5 text-lg font-bold hover:bg-mist"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="p-2">
              <a
                href={waUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa w-full"
                onClick={() => setOpen(false)}
              >
                Fast track lewat WhatsApp
              </a>
            </li>
          </ul>
        )}
      </div>
    </header>
  )
}
