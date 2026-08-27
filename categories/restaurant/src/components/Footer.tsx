import { UtensilsCrossed } from 'lucide-react'

type FooterLink = { label: string; href: string }

const LINKS: FooterLink[] = [
  { label: 'Menu', href: '#menu' },
  { label: 'Cerita Kami', href: '#cerita' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Reservasi', href: '#reservasi' },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <UtensilsCrossed className="size-5 text-primary" />
            __SITE_NAME__
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground text-pretty">
            Rumah makan keluarga dengan resep Nusantara turun-temurun sejak 1998.
            Dimasak sepenuh hati, disajikan sepenuh hangat.
          </p>
        </div>

        <nav aria-label="Tautan footer" className="text-sm">
          <p className="font-medium">Jelajahi</p>
          <ul className="mt-3 space-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-medium">Hubungi kami</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>Jl. Kenanga No. 12, Jakarta Selatan</li>
            <li>(021) 555-0123</li>
            <li>WhatsApp 0812-3456-7890</li>
            <li>Setiap hari · 10.00–22.00 WIB</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground">
          © 2026 __SITE_NAME__. Seluruh hak cipta.
        </p>
      </div>
    </footer>
  )
}
