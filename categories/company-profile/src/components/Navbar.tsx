import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavLink = { label: string; href: string }

const LINKS: NavLink[] = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Klien', href: '#klien' },
  { label: 'Kontak', href: '#kontak' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#beranda"
          className="font-display text-xl font-semibold tracking-tight"
        >
          __SITE_NAME__
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a href="#kontak" className={cn(buttonVariants({ size: 'sm' }))}>
            Konsultasi Gratis
          </a>
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted md:hidden"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
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
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#kontak"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: 'sm' }), 'mt-2')}
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
