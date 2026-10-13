import { useState } from 'react'
import { CookingPot, Menu as MenuIcon, ShoppingBag, X } from 'lucide-react'
import { cart, useCart } from '@/lib/bara'

type NavLink = { label: string; href: string }

const LINKS: NavLink[] = [
  { label: 'Menu', href: '#menu' },
  { label: 'Konsep', href: '#konsep' },
  { label: 'Outlet', href: '#outlet' },
  { label: 'Kemitraan', href: '#kemitraan' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#beranda" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <CookingPot className="size-5" />
          </span>
          Bubur<span className="-ml-1.5 text-primary">Bara</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cart.open}
            aria-label={`Keranjang pesanan (${count})`}
            className="relative inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Pesan</span>
            {count > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-accent text-[11px] font-extrabold text-accent-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex size-10 items-center justify-center rounded-xl border bg-card text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
