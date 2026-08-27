import { useState } from 'react'
import { Menu as MenuIcon, UtensilsCrossed, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type NavLink = { label: string; href: string }

const LINKS: NavLink[] = [
  { label: 'Menu', href: '#menu' },
  { label: 'Cerita Kami', href: '#cerita' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Lokasi', href: '#lokasi' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#beranda"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <UtensilsCrossed className="size-5 text-primary" />
          __SITE_NAME__
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a href="#reservasi" className={cn(buttonVariants({ size: 'sm' }))}>
            Reservasi
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          className="inline-flex size-9 items-center justify-center rounded-md border bg-card text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reservasi"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: 'sm' }), 'mt-2')}
            >
              Reservasi
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
