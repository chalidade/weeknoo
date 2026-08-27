import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type NavLink = { label: string; href: string }

const LINKS: NavLink[] = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Harga', href: '#harga' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#beranda" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            __SITE_NAME__
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a href="#harga" className={cn(buttonVariants({ size: 'default' }))}>
            Beli Sekarang
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t bg-background px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#harga"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants(), 'mt-2')}
            >
              Beli Sekarang
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
