import { useEffect, useState } from 'react'
import { Menu as MenuIcon, MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { waLink } from '@/lib/cafe'

type NavLink = { label: string; href: string }

const LINKS: NavLink[] = [
  { label: 'Menu', href: '#menu' },
  { label: 'Menu Baru', href: '#baru' },
  { label: 'Paket', href: '#paket' },
  { label: 'Suasana', href: '#suasana' },
  { label: 'Ulasan', href: '#ulasan' },
  { label: 'Lokasi', href: '#lokasi' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled || open ? 'border-b bg-background/85 backdrop-blur-lg' : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#beranda" className="flex items-center gap-2">
          <Logo className="size-9" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            HA.CHI.LI
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-4')}
          >
            <MessageCircle />
            Pesan via WA
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          className="inline-flex size-10 items-center justify-center rounded-full border bg-card text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t bg-background lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants(), 'mt-2 rounded-full')}
            >
              <MessageCircle />
              Pesan via WA
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
