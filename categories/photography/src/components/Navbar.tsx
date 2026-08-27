import { useState } from 'react'
import { Aperture, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type NavLink = { href: string; label: string }

const LINKS: NavLink[] = [
  { href: '#gallery', label: 'Galeri' },
  { href: '#about', label: 'Tentang' },
  { href: '#packages', label: 'Paket' },
  { href: '#testimonials', label: 'Testimoni' },
  { href: '#contact', label: 'Kontak' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#hero"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.2em] uppercase"
        >
          <Aperture className="size-4" />
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
          <a
            href="#contact"
            className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
          >
            Cek Tanggal
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((o) => !o)}
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
                className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'mt-2')}
            >
              Cek Tanggal
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
