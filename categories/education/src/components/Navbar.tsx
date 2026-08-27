import { useState } from 'react'
import { GraduationCap, Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavLink = { label: string; href: string }

const LINKS: NavLink[] = [
  { label: 'Program', href: '#program' },
  { label: 'Keunggulan', href: '#keunggulan' },
  { label: 'Pengajar', href: '#pengajar' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Pendaftaran', href: '#pendaftaran' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#beranda" className="inline-flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-4.5" />
          </span>
          __SITE_NAME__
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a href="#pendaftaran" className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-5 font-bold')}>
            Daftar Sekarang
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4" aria-label="Navigasi seluler">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pendaftaran"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: 'sm' }), 'mt-2 w-full rounded-full font-bold')}
            >
              Daftar Sekarang
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
